# Comment Standards | AETHERIS

## Overview

Este documento define o padrão de comentários para manter consistência em toda a base de código.

---

## Core Rules

### 1. Only Relevant Comments

| Rule                | Detail                                                    |
| ------------------- | --------------------------------------------------------- |
| **Keep it concise** | Comentários devem explicar o "por quê", não o "o quê"     |
| **No obvious code** | Não comente código que é auto-explicativo                 |
| **Context matters** | Comente lógica complexa, decisões não óbvias, workarounds |

### 2. Separator Style

| Instead Of                              | Use                               |
| --------------------------------------- | --------------------------------- |
| `// ──────────────────────` (travessão) | `// \|\|\| Section Name`          |
| `// ----` (hífen)                       | `// \|\|\| Function Group`        |
| `/* ---- */`                            | `/* \|\|\| Multi-line context */` |

**Example:**

```typescript
// ||| Markdown renderer
function renderMarkdown(text: string) {
  // ...
}

// ||| Decision Intelligence helpers
function intentLabel(intent: string, locale: Locale): string {
  // ...
}

// ||| Command output renderers
function renderCommandMarkdown(text: string) {
  // ...
}
```

### 3. Inline Comments

Use `|` separator for clarity:

```typescript
const isChunkLine =
  item.includes("22") | item.includes("indexed") | item.includes("indexados");

// Instead of:
// const isChunkLine = item.includes("22") - item.includes("indexed") - item.includes("indexados");
```

### 4. TODO / Fixme Format

```typescript
// TODO | implement real corpus stats endpoint
// FIXME | edge case when buffer is empty
// NOTE | depends on ChromaDB health check
```

### 5. Block Comments

For multi-line explanations:

```typescript
/*
  ||| XRAI Attribution
  | Fetch sources before streaming text
  | Allows frontend to show evidence chain
  | Part of explainable AI pipeline
*/
```

---

## When to Comment

✅ **DO comment:**

- Complex algorithms or business logic
- Non-obvious design decisions
- Workarounds or hacks (with reasoning)
- Performance-critical sections
- External API dependencies
- Edge cases and special conditions

❌ **DON'T comment:**

- Variable names that are self-explanatory
- Loop constructs or simple assignments
- Standard React/TypeScript patterns
- Comments that repeat the code

---

## Example Transformations

### Before (Too Many Comments)

````typescript
// Set the messages array
setMessages(content.initialMessages);
// Clear the input field
setInput("");
// Clear the history
setHistory([]);

// Split on code fences
const parts = text.split(/(```(?:tsx?|jsx?|)\n[\s\S]*?```)/g);
````

### After (Relevant Only)

````typescript
setMessages(content.initialMessages);
setInput("");
setHistory([]);

// Split on code fences, preserving delimiters in odd indices for diff detection
const parts = text.split(/(```(?:tsx?|jsx?|)\n[\s\S]*?```)/g);
````

---

## Locales & Naming

- Comments can be in **English or Portuguese**
- Use consistent language per file
- File-level comments should match the primary language context

---

## Applied To

- ✅ `src/components/BeatriceChatPage.tsx`
- ✅ `src/components/PersonaPage.tsx`
- 📋 All future React components
- 📋 `server.py` (Python backend)
- 📋 RAG pipeline files

---

**Last Updated:** May 25, 2026  
**Version:** 1.0
