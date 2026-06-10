import { AlertTriangle, Database, FileText, ListChecks, ShieldCheck, Wrench, X } from "lucide-react";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import type { AuditSelectedRule } from "../../types/beatrice";
import { useI18n } from "../../../i18n/I18nProvider";
import { ExecutionTrace } from "./ExecutionTrace";

function percent(value: number | undefined, notAvailable: string) {
  return typeof value === "number" ? `${Math.round(value * 100)}%` : notAvailable;
}

export function AuditTrail() {
  const { locale, t } = useI18n();
  const {
    close,
    isOpen,
    mutationError,
    selectedMessage,
    updateDecisionStatus,
    updatingDecisionId,
  } = useAuditTrail();

  if (!isOpen) return null;

  const metadata = selectedMessage?.auditMetadata;
  const sources = selectedMessage?.sources ?? metadata?.sources ?? [];
  const decisionId = selectedMessage?.decisionId ?? metadata?.decision_id ?? undefined;
  const decisionStatus = selectedMessage?.decisionStatus ?? metadata?.decision_status ?? undefined;
  const notAvailable = t("beatrice.audit.notAvailable");
  const selectedRuleGroups: Array<[string, AuditSelectedRule[] | undefined]> = [
    [t("beatrice.audit.selectedDo"), metadata?.used_do_rules],
    [t("beatrice.audit.selectedDont"), metadata?.used_dont_rules],
    [t("beatrice.audit.selectedWhenToUse"), metadata?.used_when_to_use],
    [t("beatrice.audit.selectedWhenNotToUse"), metadata?.used_when_not_to_use],
  ];

  return (
    <div
      className="absolute inset-0 z-30 flex justify-end overflow-hidden rounded-[28px] bg-black/55 backdrop-blur-[5px]"
      onMouseDown={close}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="execution-trace-title"
        className="beatrice-scrollbar h-full w-full max-w-[32rem] overflow-y-auto border-l border-white/10 bg-surface-container-low/95 shadow-cognitive-lg backdrop-blur-3xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/8 bg-surface-container-low/90 px-6 py-5 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                {t("beatrice.audit.metadata")}
              </p>
              <h2 id="execution-trace-title" className="mt-1 text-sm font-black text-white">
                {t("beatrice.audit.executionTrace")}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t("beatrice.audit.close")}
            className="glass-panel flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-6 px-6 py-6">
          <section>
            <p className="mb-3 text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
              {t("beatrice.audit.executionSummary")}
            </p>
            <dl className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.025]">
              {[
                ["request_id", metadata?.request_id ?? notAvailable],
                ["workflow", metadata?.workflow ?? notAvailable],
                ["execution_status", metadata?.execution_status ?? notAvailable],
                ["profile_contract_applied", metadata?.profile_contract_applied === undefined ? notAvailable : String(metadata.profile_contract_applied)],
                ["profile_contract_id", metadata?.profile_contract_id ?? notAvailable],
                ["perspective_quality_score", percent(metadata?.perspective_quality_score ?? undefined, notAvailable)],
                ["evidence_tier", metadata?.evidence_tier ?? notAvailable],
                ["evidence_similarity", percent(metadata?.evidence_similarity, notAvailable)],
                ["decision_id", decisionId ?? notAvailable],
                ["decision_status", decisionStatus ?? notAvailable],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-white/6 px-3 py-2.5 last:border-0">
                  <dt className="font-mono text-[9px] text-slate-600">{label}</dt>
                  <dd className="max-w-[65%] break-words text-right text-[10px] font-semibold text-slate-300">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {(metadata?.recommended_component || metadata?.workflow === "component_decision") && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                  {t("beatrice.audit.structuredSelection")}
                </p>
              </div>
              <dl className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.025]">
                {[
                  ["recommended_component", metadata?.recommended_component ?? notAvailable],
                  ["component_id", metadata?.recommended_component_id ?? notAvailable],
                  ["component_status", metadata?.component_status ?? notAvailable],
                  ["weighted_score", metadata?.weighted_score?.toFixed(3) ?? notAvailable],
                  ["evidence_similarity", percent(metadata?.evidence_similarity, notAvailable)],
                  ["evidence_tier", metadata?.evidence_tier ?? notAvailable],
                  ["selection_policy", metadata?.selection_policy ?? notAvailable],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-white/6 px-3 py-2.5 last:border-0">
                    <dt className="font-mono text-[9px] text-slate-600">{label}</dt>
                    <dd className="max-w-[65%] break-words text-right text-[10px] font-semibold text-slate-300">{value}</dd>
                  </div>
                ))}
              </dl>
              {metadata?.selection_reason && (
                <p className="mt-2 text-[10px] leading-5 text-slate-500">{metadata.selection_reason}</p>
              )}
              <p className="mt-2 text-[9px] leading-4 text-slate-600">
                {t("beatrice.audit.evidenceSimilarityNote")}
              </p>
            </section>
          )}

          {metadata?.alternative_components && metadata.alternative_components.length > 0 && (
            <section>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                {t("beatrice.audit.alternativeComponents")}
              </p>
              <div className="space-y-2">
                {metadata.alternative_components.map((component) => (
                  <div key={component.component_id} className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold text-slate-200">{component.name}</p>
                      <span className="text-[9px] font-bold text-primary">{component.weighted_score.toFixed(3)}</span>
                    </div>
                    <p className="mt-1 text-[9px] text-slate-600">
                      {component.status} · {t("beatrice.audit.evidenceSimilarityInline")} {percent(component.evidence_similarity, notAvailable)} · {component.evidence_tier}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {metadata?.rejected_components && metadata.rejected_components.length > 0 && (
            <section>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                {t("beatrice.audit.rejectedCandidates")}
              </p>
              <div className="flex flex-wrap gap-2">
                {metadata.rejected_components.map((component) => (
                  <span key={`${component.component_id}-${component.reason}`} className="rounded-full border border-warning/15 bg-warning/[0.055] px-2.5 py-1 text-[9px] text-warning/70">
                    {component.name}: {component.reason}
                  </span>
                ))}
              </div>
            </section>
          )}

          {selectedRuleGroups.some(([, rules]) => Boolean(rules?.length)) && (
            <section>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                {t("beatrice.audit.selectedCompositionRules")}
              </p>
              <div className="space-y-3">
                {selectedRuleGroups.map(([label, rules]) => (
                  rules?.length ? (
                    <div key={label}>
                      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-primary/70">{label}</p>
                      <div className="space-y-1.5">
                        {rules.map((rule) => (
                          <div key={rule.id} className="rounded-lg border border-white/6 bg-black/10 px-3 py-2">
                            <p className="font-mono text-[9px] text-slate-600">{rule.id}</p>
                            <p className="mt-1 text-[10px] leading-5 text-slate-400">{rule.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            </section>
          )}

          {metadata?.missing_component_fields && metadata.missing_component_fields.length > 0 && (
            <section className="rounded-xl border border-warning/15 bg-warning/[0.055] p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-warning">
                {t("beatrice.audit.missingFields")}
              </p>
              <p className="mt-2 text-[10px] leading-5 text-warning/65">
                {metadata.missing_component_fields.join(", ")}
              </p>
            </section>
          )}

          {metadata?.field_sources && Object.keys(metadata.field_sources).length > 0 && (
            <section>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                {t("beatrice.audit.fieldProvenance")}
              </p>
              <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-xl border border-white/8 bg-white/[0.025] p-3">
                {Object.entries(metadata.field_sources).map(([field, fieldSources]) => (
                  <div key={field} className="text-[9px] leading-4">
                    <span className="font-mono text-primary/70">{field}</span>
                    <span className="ml-2 text-slate-600">{fieldSources.join(", ")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {metadata?.response_validation_status && (
            <section className={`rounded-xl border p-3 ${
              metadata.fallback_used
                ? "border-warning/20 bg-warning/[0.055]"
                : "border-success/15 bg-success/[0.045]"
            }`}>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                {t("beatrice.audit.responseValidation")}
              </p>
              <p className="mt-2 text-xs font-bold text-white">{metadata.response_validation_status}</p>
              {metadata.validation_violation_type && (
                <p className="mt-1 text-[10px] text-warning/75">
                  {metadata.validation_violation_type}
                </p>
              )}
              {metadata.fallback_used && (
                <p className="mt-2 text-[10px] leading-5 text-warning/65">
                  {t("beatrice.audit.deterministicFallback")} {metadata.fallback_reason}
                </p>
              )}
            </section>
          )}

          {metadata?.profile_contract_applied && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <ListChecks className="h-3.5 w-3.5 text-primary" />
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                  {t("beatrice.audit.perspectiveContract")}
                </p>
              </div>
              <div className="space-y-2 rounded-xl border border-white/8 bg-white/[0.025] p-3">
                <p className="text-[10px] leading-5 text-slate-400">
                  {t("beatrice.audit.signalsFound")}:{" "}
                  {(metadata.required_signals_found ?? []).join(", ") || notAvailable}
                </p>
                <p className="text-[10px] leading-5 text-slate-400">
                  {t("beatrice.audit.signalsMissing")}:{" "}
                  {(metadata.required_signals_missing ?? []).join(", ") || t("beatrice.audit.none")}
                </p>
                {metadata.profile_contract_warnings?.map((warning) => (
                  <p key={warning.code} className="text-[10px] leading-5 text-warning/80">
                    {warning.code}: {warning.message}
                  </p>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5 text-primary" />
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                {t("beatrice.audit.toolsUsed")}
              </p>
            </div>
            {metadata?.tools_used?.length ? (
              <div className="flex flex-wrap gap-2">
                {metadata.tools_used.map((tool) => (
                  <span key={tool.name} className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold text-primary/80">
                    {tool.name}: {tool.permission}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">{t("beatrice.audit.noTools")}</p>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <ListChecks className="h-3.5 w-3.5 text-primary" />
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                {t("beatrice.audit.executionTrace")}
              </p>
            </div>
            <ExecutionTrace steps={metadata?.steps} locale={locale} />
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-primary" />
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                {t("beatrice.audit.evidenceSources")}
              </p>
            </div>
            {sources.length > 0 ? (
              <div className="space-y-2.5">
                {sources.map((source, index) => (
                  <article key={`${source.title}-${index}`} className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-200">{source.title}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-600">{source.source}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary">
                        {percent(source.similarity, notAvailable)}
                      </span>
                    </div>
                    {source.excerpt && <p className="mt-2 text-[10px] leading-5 text-slate-500">{source.excerpt}</p>}
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">{t("beatrice.audit.noEvidence")}</p>
            )}
          </section>

          {metadata?.limitations && metadata.limitations.length > 0 && (
            <section className="rounded-xl border border-warning/15 bg-warning/[0.055] p-3">
              <div className="mb-2 flex items-center gap-2 text-warning">
                <AlertTriangle className="h-3.5 w-3.5" />
                <p className="text-[9px] font-black uppercase tracking-[0.16em]">
                  {t("beatrice.audit.limitations")}
                </p>
              </div>
              <ul className="space-y-1.5 text-[10px] leading-5 text-warning/65">
                {metadata.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
              </ul>
            </section>
          )}

          {decisionId && decisionStatus === "draft" && (
            <section className="rounded-xl border border-primary/20 bg-primary/[0.055] p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-bold text-white">{t("beatrice.audit.decisionDraft")}</p>
                  <p className="mt-1 text-[10px] leading-5 text-slate-500">
                    {t("beatrice.audit.decisionDraftBody")}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={updatingDecisionId === decisionId}
                  onClick={() => void updateDecisionStatus(decisionId, "confirmed")}
                  className="rounded-lg bg-primary px-3 py-2 text-[10px] font-black text-on-primary disabled:opacity-50"
                >
                  {t("beatrice.chat.confirmDecision")}
                </button>
                <button
                  type="button"
                  disabled={updatingDecisionId === decisionId}
                  onClick={() => void updateDecisionStatus(decisionId, "rejected")}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold text-slate-300 disabled:opacity-50"
                >
                  {t("beatrice.chat.rejectDecision")}
                </button>
              </div>
              {mutationError && <p className="mt-2 text-[10px] text-red-400">{mutationError}</p>}
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
