import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { PersonaProvider } from "./beatrice/providers/PersonaProvider";
import { AppShell } from "./components/AppShell";
import { useI18n } from "./i18n/I18nProvider";

// ─── 9 primary product surfaces ───────────────────────────────────────────
const MainHomePage = lazy(() =>
  import("./components/OracleHomePage").then((module) => ({ default: module.OracleHomePage })),
);
const OraclePage = lazy(() =>
  import("./components/OraclePage").then((module) => ({ default: module.OraclePage })),
);
const ReasoningPage = lazy(() =>
  import("./components/ReasoningPage").then((module) => ({ default: module.ReasoningPage })),
);
const PerspectivesPage = lazy(() =>
  import("./beatrice/pages/PerspectivesPage").then((module) => ({ default: module.PerspectivesPage })),
);
const FoundationsPage = lazy(() =>
  import("./components/FoundationsHubPage").then((module) => ({ default: module.FoundationsPage })),
);
const ComponentsPage = lazy(() =>
  import("./components/ComponentsPage").then((module) => ({ default: module.ComponentsPage })),
);
const ArchitecturePage = lazy(() =>
  import("./components/DevelopersPage").then((module) => ({ default: module.DevelopersPage })),
);
const EvaluationPage = lazy(() =>
  import("./components/EvaluationPage").then((module) => ({ default: module.EvaluationPage })),
);
const StudyResultsPage = lazy(() =>
  import("./components/StudyResultsPage").then((module) => ({ default: module.StudyResultsPage })),
);
const LaboratoryPage = lazy(() =>
  import("./components/LaboratoryPage").then((module) => ({ default: module.LaboratoryPage })),
);
const StudyPage = lazy(() =>
  import("./components/StudyPage").then((module) => ({ default: module.StudyPage })),
);
const ResearchAdminPage = lazy(() =>
  import("./components/ResearchAdminPage").then((module) => ({ default: module.ResearchAdminPage })),
);

function RouteFallback() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="glass-panel rounded-2xl px-6 py-4 text-center shadow-glow">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            {t("shell.loadingEyebrow")}
          </span>
        </div>
        <p className="text-sm text-slate-300">{t("shell.loadingText")}</p>
      </div>
    </div>
  );
}

function LegacySystemRedirect() {
  const { search } = useLocation();
  const focus = new URLSearchParams(search).get("focus");

  if (focus === "components") {
    return <Navigate to="/components" replace />;
  }

  if (focus === "patterns" || focus === "tokens" || focus === "foundations") {
    return <Navigate to={`/foundations?focus=${focus}`} replace />;
  }

  return <Navigate to="/foundations" replace />;
}

function App() {
  const { locale } = useI18n();

  return (
    <PersonaProvider locale={locale}>
      <AppShell>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/main" replace />} />

            {/* ─── 9 primary surfaces ───────────────────────────────── */}
            <Route path="/main" element={<MainHomePage />} />
            <Route path="/oracle" element={<OraclePage />} />
            <Route path="/reasoning" element={<ReasoningPage />} />
            <Route path="/perspectives" element={<PerspectivesPage />} />
            <Route path="/foundations" element={<FoundationsPage />} />
            <Route path="/components" element={<ComponentsPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
            <Route path="/results" element={<StudyResultsPage />} />
            <Route path="/laboratory" element={<LaboratoryPage />} />
            <Route path="/study/:token" element={<StudyPage />} />
            <Route path="/research" element={<ResearchAdminPage />} />

            {/* ─── Compatibility redirects ─────────────────────────── */}
            <Route path="/system" element={<LegacySystemRedirect />} />
            <Route path="/intelligence" element={<Navigate to="/reasoning" replace />} />
            <Route path="/principles" element={<Navigate to="/foundations" replace />} />
            <Route path="/dashboard" element={<Navigate to="/main" replace />} />
            <Route path="/comparison" element={<Navigate to="/evaluation?focus=baseline" replace />} />

            <Route path="/home" element={<Navigate to="/main" replace />} />
            <Route path="/oracle/chat" element={<Navigate to="/oracle" replace />} />
            <Route path="/beatrice-chat" element={<Navigate to="/oracle" replace />} />
            <Route path="/patterns" element={<Navigate to="/foundations?focus=patterns" replace />} />
            <Route path="/tokens" element={<Navigate to="/foundations?focus=tokens" replace />} />
            <Route path="/design-decisions" element={<Navigate to="/foundations" replace />} />
            <Route path="/guidelines" element={<Navigate to="/foundations?focus=manifesto" replace />} />
            <Route path="/persona" element={<Navigate to="/perspectives" replace />} />
            <Route path="/developers" element={<Navigate to="/architecture" replace />} />
            <Route path="/dev-integration" element={<Navigate to="/architecture" replace />} />
            <Route path="/system-evaluation" element={<Navigate to="/evaluation" replace />} />

            <Route path="*" element={<Navigate to="/main" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </PersonaProvider>
  );
}

export default App;
