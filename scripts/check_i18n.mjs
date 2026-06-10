import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const strict = process.argv.includes("--strict");
const translationFile = path.join(root, "src/i18n/translations.ts");
const visibleAttributes = new Set(["alt", "aria-label", "placeholder", "title"]);
const sourceExtensions = new Set([".ts", ".tsx"]);

function walkSourceFiles(dir, output) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      walkSourceFiles(full, output);
    } else if (sourceExtensions.has(path.extname(entry.name))) {
      output.push(path.relative(root, full));
    }
  }
  return output;
}

function sourceFiles() {
  // Prefer ripgrep when available; fall back to a Node walk so the check runs
  // in environments without rg (e.g. fresh CI containers or local machines).
  try {
    return execFileSync("rg", ["--files", "src", "-g", "*.ts", "-g", "*.tsx"], {
      cwd: root,
      encoding: "utf8",
    }).trim().split("\n").filter(Boolean);
  } catch {
    return walkSourceFiles(path.join(root, "src"), []);
  }
}

function loadTranslations() {
  const source = fs.readFileSync(translationFile, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const exports = {};
  new Function("exports", output)(exports);
  return exports.translations;
}

function flatten(value, prefix = "", output = new Map()) {
  for (const [key, child] of Object.entries(value)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (typeof child === "string") output.set(next, child);
    else flatten(child, next, output);
  }
  return output;
}

function lineOf(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function scanSource(file) {
  const absolute = path.join(root, file);
  const text = fs.readFileSync(absolute, "utf8");
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
  const translationKeys = [];
  const hardcoded = [];

  function visit(node) {
    if (
      ts.isCallExpression(node)
      && ts.isIdentifier(node.expression)
      && node.expression.text === "t"
      && node.arguments.length > 0
      && ts.isStringLiteralLike(node.arguments[0])
      && /^[a-z][a-z0-9_-]*(\.[a-z0-9_-]+)+$/i.test(node.arguments[0].text)
    ) {
      translationKeys.push({
        key: node.arguments[0].text,
        line: lineOf(sourceFile, node.arguments[0]),
      });
    }

    if (ts.isJsxText(node)) {
      const value = node.text.replace(/\s+/g, " ").trim();
      if (value && /[A-Za-zÀ-ÿ]/.test(value)) {
        hardcoded.push({ line: lineOf(sourceFile, node), value });
      }
    }

    if (
      ts.isJsxAttribute(node)
      && visibleAttributes.has(node.name.text)
      && node.initializer
      && ts.isStringLiteral(node.initializer)
      && /[A-Za-zÀ-ÿ]/.test(node.initializer.text)
    ) {
      hardcoded.push({
        line: lineOf(sourceFile, node),
        value: `${node.name.text}="${node.initializer.text}"`,
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { text, translationKeys, hardcoded };
}

const translations = loadTranslations();
const localeEntries = Object.entries(translations);
const localeMaps = Object.fromEntries(
  localeEntries.map(([locale, value]) => [locale, flatten(value)]),
);
const defaultKeys = new Set(localeMaps["pt-BR"].keys());
const errors = [];
const warnings = [];

for (const [locale, map] of Object.entries(localeMaps)) {
  const keys = new Set(map.keys());
  const missing = [...defaultKeys].filter((key) => !keys.has(key));
  const extra = [...keys].filter((key) => !defaultKeys.has(key));
  if (missing.length) errors.push(`${locale}: ${missing.length} missing keys: ${missing.slice(0, 12).join(", ")}`);
  if (extra.length) errors.push(`${locale}: ${extra.length} extra keys: ${extra.slice(0, 12).join(", ")}`);
}

const files = sourceFiles();
const usedKeys = new Set();
let hardcodedCount = 0;
let forbiddenCount = 0;

for (const file of files) {
  if (!sourceExtensions.has(path.extname(file))) continue;
  const scan = scanSource(file);

  for (const usage of scan.translationKeys) {
    usedKeys.add(usage.key);
    if (!defaultKeys.has(usage.key)) {
      errors.push(`${file}:${usage.line}: unknown i18n key "${usage.key}"`);
    }
  }

  if (scan.hardcoded.length) {
    hardcodedCount += scan.hardcoded.length;
    const sample = scan.hardcoded.slice(0, 4)
      .map((item) => `${file}:${item.line} ${JSON.stringify(item.value)}`)
      .join("\n  ");
    warnings.push(`${file}: ${scan.hardcoded.length} visible hardcoded candidates\n  ${sample}`);
  }

  const forbiddenMatches = scan.text.match(/[\u2014\u2013]|\u26A0\uFE0F/g) ?? [];
  if (forbiddenMatches.length) {
    forbiddenCount += forbiddenMatches.length;
    warnings.push(`${file}: ${forbiddenMatches.length} forbidden dash or warning marker occurrences`);
  }

  const lines = scan.text.split("\n").length;
  if (lines > 800) warnings.push(`${file}: ${lines} lines, review component split opportunities`);
}

const possiblyUnused = [...defaultKeys].filter((key) => !usedKeys.has(key));
const duplicateValues = new Map();
for (const [key, value] of localeMaps["pt-BR"]) {
  if (value.length < 4) continue;
  const keys = duplicateValues.get(value) ?? [];
  keys.push(key);
  duplicateValues.set(value, keys);
}
const duplicates = [...duplicateValues.entries()].filter(([, keys]) => keys.length > 1);

console.log(`Locales: ${localeEntries.map(([locale]) => locale).join(", ")}`);
console.log(`Translation keys: ${defaultKeys.size}`);
console.log(`Literal keys used: ${usedKeys.size}`);
console.log(`Visible hardcoded candidates: ${hardcodedCount}`);
console.log(`Forbidden characters or markers: ${forbiddenCount}`);
console.log(`Possibly unused keys: ${possiblyUnused.length}`);
console.log(`Duplicate PT-BR values: ${duplicates.length}`);

if (warnings.length) {
  console.log("\nWarnings:");
  console.log(warnings.slice(0, 40).map((warning) => `- ${warning}`).join("\n"));
  if (warnings.length > 40) console.log(`- ${warnings.length - 40} additional warnings omitted`);
}

if (errors.length) {
  console.error("\nErrors:");
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else if (strict && (hardcodedCount > 0 || forbiddenCount > 0)) {
  console.error("\nStrict mode failed because visible hardcoded content or forbidden characters remain.");
  process.exitCode = 1;
}
