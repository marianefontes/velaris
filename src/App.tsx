import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { useI18n } from "./i18n/I18nProvider";

const MainPage = lazy(() =>
  import("./components/MainPage").then((module) => ({ default: module.MainPage })),
);
const DashboardPage = lazy(() =>
  import("./components/DashboardPage").then((module) => ({ default: module.DashboardPage })),
);
const BeatriceChatPage = lazy(() =>
  import("./components/BeatriceChatPage").then((module) => ({
    default: module.BeatriceChatPage,
  })),
);
const ComponentsPage = lazy(() =>
  import("./components/ComponentsPage").then((module) => ({ default: module.ComponentsPage })),
);
const DevIntegrationPage = lazy(() =>
  import("./components/DevIntegrationPage").then((module) => ({
    default: module.DevIntegrationPage,
  })),
);
const DesignDecisionsPage = lazy(() =>
  import("./components/DesignDecisionsPage").then((module) => ({
    default: module.DesignDecisionsPage,
  })),
);
const FoundationsPage = lazy(() =>
  import("./components/FoundationsPage").then((module) => ({ default: module.FoundationsPage })),
);
const GuidelinesPage = lazy(() =>
  import("./components/GuidelinesPage").then((module) => ({ default: module.GuidelinesPage })),
);
const PersonaPage = lazy(() =>
  import("./components/PersonaPage").then((module) => ({ default: module.PersonaPage })),
);
const PatternsPage = lazy(() =>
  import("./components/PatternsPage").then((module) => ({ default: module.PatternsPage })),
);
const ReasoningPage = lazy(() =>
  import("./components/ReasoningPage").then((module) => ({ default: module.ReasoningPage })),
);
const SystemEvaluationPage = lazy(() =>
  import("./components/SystemEvaluationPage").then((module) => ({
    default: module.SystemEvaluationPage,
  })),
);
const TokensPage = lazy(() =>
  import("./components/TokensPage").then((module) => ({ default: module.TokensPage })),
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

function App() {
  return (
    <AppShell>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/beatrice-chat" element={<BeatriceChatPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/dev-integration" element={<DevIntegrationPage />} />
          <Route path="/design-decisions" element={<DesignDecisionsPage />} />
          <Route path="/foundations" element={<FoundationsPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/persona" element={<PersonaPage />} />
          <Route path="/patterns" element={<PatternsPage />} />
          <Route path="/reasoning" element={<ReasoningPage />} />
          <Route path="/system-evaluation" element={<SystemEvaluationPage />} />
          <Route path="/tokens" element={<TokensPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export default App;
