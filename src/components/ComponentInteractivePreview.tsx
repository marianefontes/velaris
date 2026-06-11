import {
  BookOpenCheck,
  Check,
  CheckCircle2,
  Command,
  CreditCard,
  ExternalLink,
  ListChecks,
  LoaderCircle,
  MessageCircleQuestion,
  TriangleAlert,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { getComponentsPreviewCopy } from "../i18n/pages/componentsPreview";
import type { ComponentDoc } from "./componentPresentation";
import type {
  ButtonIntent,
  ButtonState,
  ComponentPlaygroundConfig,
} from "./componentWorkbench";

const BUTTON_INTENT_CLASSES: Record<ButtonIntent, string> = {
  primary: "border-primary bg-primary text-on-primary hover:bg-primary-dim",
  secondary:
    "border-primary/20 bg-surface-container-highest text-primary hover:border-primary/40 hover:bg-primary/10",
  positive:
    "border-[var(--velaris-color-success)] bg-[var(--velaris-color-success)] text-background hover:brightness-90",
  negative: "border-error bg-error text-on-error hover:bg-error-dim",
};

const BUTTON_HOVER_CLASSES: Record<ButtonIntent, string> = {
  primary: "border-primary bg-primary-dim",
  secondary: "border-primary/40 bg-primary/10 text-primary",
  positive: "border-[var(--velaris-color-success)] bg-[var(--velaris-color-success)] brightness-90",
  negative: "border-error-dim bg-error-dim text-on-error",
};

function buttonPreviewClassName(config: ComponentPlaygroundConfig): string {
  const intent = config.intent.toLowerCase() as ButtonIntent;
  const state = config.state.toLowerCase() as ButtonState;
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-bold uppercase tracking-widest outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] active:translate-y-px";
  if (state === "disabled") {
    return `${base} cursor-not-allowed border-white/[0.07] bg-white/[0.025] text-on-surface-variant/45`;
  }

  return [
    base,
    BUTTON_INTENT_CLASSES[intent],
    state === "hover" ? BUTTON_HOVER_CLASSES[intent] : "",
    state === "focus"
      ? "border-primary [box-shadow:0_0_0_3px_rgba(222,204,253,0.35)]"
      : "focus-visible:border-primary focus-visible:[box-shadow:0_0_0_3px_rgba(222,204,253,0.35)]",
    state === "loading" ? "cursor-wait" : "",
  ].filter(Boolean).join(" ");
}

export function ComponentInteractivePreview({
  item,
  config,
  onStateChange,
}: {
  item: ComponentDoc;
  config: ComponentPlaygroundConfig;
  onStateChange: (state: string) => void;
}) {
  const { locale } = useI18n();
  const copy = useMemo(() => getComponentsPreviewCopy(locale), [locale]);
  const [count, setCount] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState("balanced");
  const [chip, setChip] = useState(true);
  const [text, setText] = useState("");
  const [area, setArea] = useState("");
  const [select, setSelect] = useState("designer");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [linkVisited, setLinkVisited] = useState(false);
  const [tab, setTab] = useState("preview");
  const [cardSelected, setCardSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [confidence, setConfidence] = useState(86);
  const [commandQuery, setCommandQuery] = useState("");
  const [sourceOpen, setSourceOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [displayType, setDisplayType] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);
  const buttonPreviewRef = useRef<HTMLButtonElement>(null);
  const togglePreviewRef = useRef<HTMLButtonElement>(null);
  const state = config.state.toLowerCase();
  const intent = config.intent.toLowerCase();

  useEffect(() => {
    if (item.id !== "button") return;
    if (state === "focus") {
      buttonPreviewRef.current?.focus();
      return;
    }
    if (document.activeElement === buttonPreviewRef.current) {
      buttonPreviewRef.current?.blur();
    }
  }, [item.id, state]);

  useEffect(() => {
    if (item.id === "toggle-switch") {
      if (state === "on") setEnabled(true);
      if (state === "off") setEnabled(false);
      if (state === "focus") {
        setEnabled(false);
        togglePreviewRef.current?.focus();
      } else if (document.activeElement === togglePreviewRef.current) {
        togglePreviewRef.current?.blur();
      }
    }
    if (item.id === "checkbox") setChecked(state === "checked" || state === "indeterminate");
    if (item.id === "radio-button") setRadio(state === "checked" ? "balanced" : "");
    if (item.id === "selectable-chip") setChip(state === "selected");
    if (item.id === "text-input") setText(state === "filled" ? "Velaris" : "");
    if (item.id === "text-area") setArea(state === "filled" ? copy.sampleDecisionContext : "");
    if (item.id === "select-dropdown") setSelect(state === "selected" ? "designer" : "");
    if (item.id === "date-picker") setDate(state === "selected" ? "2026-06-06" : "");
    if (item.id === "form-field") setEmail(state === "valid" ? "nome@empresa.com" : state === "error" ? copy.invalidEmailValue : "");
    if (item.id === "link") setLinkVisited(state === "visited");
    if (item.id === "tabs") setTab(state === "active" ? "preview" : "");
    if (item.id === "card") setCardSelected(state === "selected");
    if (item.id === "modal-dialog") setModalOpen(state !== "closed");
    if (item.id === "alert") setAlertVisible(state !== "dismissed");
    if (item.id === "toast") setToastVisible(state !== "paused");
    if (item.id === "skeleton-loader") setLoaded(state === "loaded");
    if (item.id === "explanation-tooltip") {
      setTooltipOpen(["hover", "focus", "open"].includes(state));
    }
    if (item.id === "confidence-badge") {
      setConfidence(state === "low" ? 34 : state === "medium" ? 67 : state === "high" ? 94 : 86);
    }
    if (item.id === "command-palette") {
      setCommandQuery(state === "empty" ? copy.noResultsQuery : state === "results" ? "audit" : "");
    }
    if (item.id === "source-attribution") setSourceOpen(state === "expanded" || state === "high match");
    if (item.id === "audit-panel") setAuditOpen(state !== "collapsed");
    if (item.id === "typography") setDisplayType(state === "display");
    if (item.id === "icon") {
      setIconIndex(intent === "status" ? 1 : intent === "category" ? 2 : 0);
    }
  }, [copy, intent, item.id, state]);

  const previewButton =
    "rounded-xl bg-signature px-5 py-3 text-xs font-bold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50";
  const secondaryButton =
    "rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-primary/25 hover:text-white";

  switch (item.id) {
    case "button":
      {
        const blocked = state === "loading" || state === "disabled";
        const statusId = blocked ? "button-preview-status" : undefined;
        return (
          <div className="text-center">
            <button
              ref={buttonPreviewRef}
              type="button"
              className={buttonPreviewClassName(config)}
              data-intent={intent}
              data-state={state}
              disabled={blocked}
              aria-busy={state === "loading" || undefined}
              aria-describedby={statusId}
              autoFocus={state === "focus"}
              onClick={() => setCount((value) => value + 1)}
            >
              {state === "loading" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              <span>{config.label ?? copy.generateAnalysis}</span>
            </button>
            <p className="mt-3 text-xs text-slate-400">
              {copy.executedCount.replace("{count}", String(count))}
            </p>
            {blocked ? (
              <p id={statusId} className="mt-2 text-[11px] leading-5 text-slate-400" aria-live="polite">
                {state === "loading"
                  ? copy.processingAsync
                  : copy.unavailableAction}
              </p>
            ) : null}
          </div>
        );
      }
    case "toggle-switch":
      {
        const toggleLabel =
          intent === "visibility"
            ? copy.showDetails
            : intent === "mode"
              ? copy.editMode
              : copy.reduceMotion;
        return (
          <div className="w-full max-w-sm">
            <button
              ref={togglePreviewRef}
              type="button"
              role="switch"
              aria-checked={enabled}
              disabled={state === "disabled"}
              autoFocus={state === "focus"}
              onClick={() => {
                const next = !enabled;
                setEnabled(next);
                onStateChange(next ? "On" : "Off");
              }}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm font-semibold text-white outline-none transition-[box-shadow,opacity] duration-[160ms] focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${state === "focus" ? "ring-2 ring-primary/50" : ""}`}
            >
              <span
                data-toggle-track
                aria-hidden
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-[160ms] ${enabled ? "bg-primary" : "bg-white/10"}`}
              >
                <span
                  data-toggle-thumb
                  className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-background transition-transform duration-[160ms] ${enabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </span>
              <span>{toggleLabel} {enabled ? copy.enabled : copy.disabled}</span>
            </button>
          </div>
        );
      }
    case "checkbox":
      return (
        <label className={`flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm text-white ${state === "disabled" ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            checked={checked}
            disabled={state === "disabled"}
            autoFocus={state === "focus"}
            aria-checked={state === "indeterminate" ? "mixed" : checked}
            onChange={(event) => {
              setChecked(event.target.checked);
              onStateChange(event.target.checked ? "Checked" : "Unchecked");
            }}
            className="h-5 w-5 accent-primary focus-visible:ring-2 focus-visible:ring-primary/50"
          />
          {intent === "consent"
            ? copy.consentSources
            : intent === "bulk"
              ? copy.selectAll
              : copy.includeRetrievedSources}
        </label>
      );
    case "radio-button":
      return (
        <fieldset className="space-y-3">
          <legend className={`mb-3 text-xs font-bold uppercase tracking-widest ${state === "error" ? "text-error" : "text-slate-400"}`}>
            {intent === "plan" ? copy.plan : intent === "preference" ? copy.preference : copy.singleChoice}
          </legend>
          {["concise", "balanced", "detailed"].map((value) => (
            <label key={value} className={`flex min-h-11 items-center gap-3 text-sm text-white ${state === "disabled" ? "opacity-40" : ""}`}>
              <input
                type="radio"
                name="depth"
                value={value}
                checked={radio === value}
                disabled={state === "disabled"}
                autoFocus={state === "focus" && value === "balanced"}
                onChange={() => {
                  setRadio(value);
                  onStateChange("Checked");
                }}
                className="h-4 w-4 accent-primary"
              />
              {value === "concise" ? copy.concise : value === "balanced" ? copy.balanced : copy.detailed}
            </label>
          ))}
          {state === "error" ? <p className="text-xs text-error">{copy.selectOption}</p> : null}
        </fieldset>
      );
    case "selectable-chip":
      return (
        <button
          type="button"
          aria-pressed={chip}
          disabled={state === "disabled"}
          autoFocus={state === "focus"}
          onClick={() => {
            const next = !chip;
            setChip(next);
            onStateChange(next ? "Selected" : "Default");
          }}
          className={`min-h-11 rounded-full border px-4 py-2 text-xs font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${chip ? "border-primary/30 bg-primary/15 text-primary" : state === "hover" ? "border-white/20 bg-white/[0.07] text-white" : "border-white/10 bg-white/[0.03] text-slate-400"}`}
        >
          {intent === "tag" ? copy.documentation : intent === "attribute" ? copy.highConfidence : copy.accessibility}
        </button>
      );
    case "text-input":
      return (
        <label className="w-full max-w-sm text-xs font-semibold text-slate-400">
          {intent === "search" ? copy.searchSources : intent === "email" ? copy.email : copy.projectName}
          <input
            type={intent === "email" ? "email" : intent === "search" ? "search" : "text"}
            value={text}
            disabled={state === "disabled"}
            autoFocus={state === "focus"}
            aria-invalid={state === "error"}
            onChange={(event) => {
              setText(event.target.value);
              onStateChange(event.target.value ? "Filled" : "Empty");
            }}
            placeholder={copy.projectPlaceholder}
            className={`mt-2 min-h-11 w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 ${state === "error" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          />
          {state === "error" ? <span className="mt-2 block text-[11px] text-error">{copy.reviewValue}</span> : null}
        </label>
      );
    case "text-area":
      return (
        <label className="w-full max-w-sm text-xs font-semibold text-slate-400">
          {intent === "prompt" ? copy.beatricePrompt : intent === "comment" ? copy.comment : copy.decisionContext}
          <textarea
            value={area}
            disabled={state === "disabled"}
            autoFocus={state === "focus"}
            aria-invalid={state === "error"}
            onChange={(event) => {
              setArea(event.target.value);
              onStateChange(event.target.value ? "Filled" : "Empty");
            }}
            rows={4}
            placeholder={copy.contextPlaceholder}
            className={`mt-2 w-full resize-y rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 ${state === "error" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          />
        </label>
      );
    case "select-dropdown":
      return (
        <label className="w-full max-w-xs text-xs font-semibold text-slate-400">
          {intent === "filter" ? copy.filterSources : intent === "configuration" ? copy.configuration : copy.perspective}
          <select
            value={select}
            disabled={state === "disabled"}
            autoFocus={state === "open"}
            aria-invalid={state === "error"}
            onChange={(event) => {
              setSelect(event.target.value);
              onStateChange(event.target.value ? "Selected" : "Closed");
            }}
            className={`mt-2 min-h-11 w-full rounded-xl border bg-surface-container-high px-4 py-3 text-sm text-white outline-none disabled:opacity-40 ${state === "error" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          >
            <option value="">{copy.select}</option>
            <option value="designer">Designer</option>
            <option value="dev">Developer</option>
            <option value="product_designer">Product Designer</option>
            <option value="qa">QA</option>
            <option value="tech_writer">Tech Writer</option>
            <option value="a11y">Accessibility Specialist</option>
            <option value="maintainer">Maintainer</option>
            <option value="design_system_manager">Design System Manager</option>
          </select>
        </label>
      );
    case "date-picker":
      return (
        <label className="w-full max-w-xs text-xs font-semibold text-slate-400">
          {intent === "range" ? copy.auditPeriod : intent === "deadline" ? copy.deadline : copy.reviewDate}
          <input
            type="date"
            value={date}
            disabled={state === "disabled"}
            autoFocus={state === "open"}
            aria-invalid={state === "invalid"}
            onChange={(event) => {
              setDate(event.target.value);
              onStateChange(event.target.value ? "Selected" : "Empty");
            }}
            className={`mt-2 min-h-11 w-full rounded-xl border bg-surface-container-high px-4 py-3 text-sm text-white outline-none disabled:opacity-40 ${state === "invalid" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          />
        </label>
      );
    case "form-field": {
      const invalid = state === "error" || (email.length > 0 && !email.includes("@"));
      return (
        <label className="w-full max-w-sm text-xs font-semibold text-slate-400">
          {intent === "validation" ? copy.email : intent === "guidance" ? copy.analysisName : copy.inputData}
          {state === "required" ? <span className="ml-1 text-error">*</span> : null}
          <input
            value={email}
            disabled={state === "disabled"}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={invalid}
            aria-describedby="email-hint"
            placeholder="nome@empresa.com"
            className={`mt-2 min-h-11 w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:opacity-40 ${invalid ? "border-error/50" : state === "valid" ? "border-[var(--velaris-color-success)]/50" : "border-white/10 focus:border-primary/35"}`}
          />
          <span id="email-hint" className={`mt-2 block text-[11px] ${invalid ? "text-error" : "text-slate-400"}`}>
            {invalid ? copy.validEmail : state === "valid" ? copy.validatedValue : copy.contactOnly}
          </span>
        </label>
      );
    }
    case "link":
      return (
        <button
          type="button"
          disabled={state === "disabled"}
          autoFocus={state === "focus"}
          onClick={() => {
            setLinkVisited(true);
            onStateChange("Visited");
          }}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${state === "hover" ? "bg-primary/10 text-white" : ""}`}
        >
          {intent === "external" ? copy.originalSource : intent === "download" ? copy.downloadReport : copy.exploreFoundations}
          {intent === "external" ? <ExternalLink className="h-4 w-4" /> : null}
          {linkVisited ? <Check className="h-4 w-4" aria-label={copy.visited} /> : null}
        </button>
      );
    case "tabs":
      return (
        <div className="w-full max-w-sm">
          <div role="tablist" className="flex border-b border-white/10">
            {["preview", "usage", "code"].map((value, index) => (
              <button key={value} type="button" role="tab" aria-selected={tab === value} disabled={state === "disabled"} autoFocus={state === "focus" && index === 0} onClick={() => { setTab(value); onStateChange("Active"); }} className={`min-h-11 px-4 py-2 text-xs font-bold uppercase tracking-wider outline-none disabled:opacity-40 ${tab === value ? "border-b-2 border-primary text-primary" : state === "hover" && index === 0 ? "bg-white/5 text-white" : "text-slate-400"}`}>
                {value === "preview" ? copy.preview : value === "usage" ? copy.usage : copy.code}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="p-5 text-sm text-slate-300">{intent}: {tab || copy.noActiveTab}</div>
        </div>
      );
    case "card":
      return (
        <button type="button" aria-pressed={cardSelected} disabled={state === "disabled" || state === "loading"} onClick={() => { const next = !cardSelected; setCardSelected(next); onStateChange(next ? "Selected" : "Default"); }} className={`min-h-11 w-full max-w-xs rounded-2xl border p-5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${cardSelected ? "border-primary/35 bg-primary/10" : state === "hover" ? "border-white/20 bg-white/[0.07]" : "border-white/10 bg-white/[0.03]"}`}>
          <CreditCard className="h-5 w-5 text-primary" />
          <p className="mt-4 text-sm font-bold text-white">{intent === "entity" ? copy.confidenceBadge : intent === "summary" ? copy.analysisSummary : copy.interactiveChoice}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">{state === "loading" ? copy.loadingContent : copy.selectToCompare}</p>
        </button>
      );
    case "modal-dialog":
      return (
        <div className="text-center">
          <button type="button" disabled={state === "disabled"} onClick={() => { setModalOpen(true); onStateChange("Open"); }} className={`${previewButton} disabled:cursor-not-allowed disabled:opacity-40`}>{copy.openDialog}</button>
          {modalOpen ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/70 p-6">
              <div role="dialog" aria-modal="true" aria-labelledby="preview-dialog-title" className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-container-high p-5 text-left shadow-panel">
                <div className="flex items-start justify-between">
                  <h4 id="preview-dialog-title" className="font-bold text-white">{intent === "edit" ? copy.editParameters : intent === "critical decision" ? copy.removeSource : copy.confirmDecision}</h4>
                  <button type="button" onClick={() => { setModalOpen(false); onStateChange("Closed"); }} aria-label={copy.close}><X className="h-4 w-4 text-slate-400" /></button>
                </div>
                <p className={`mt-3 text-xs leading-5 ${state === "error" ? "text-error" : "text-slate-400"}`}>{state === "error" ? copy.operationFailed : copy.auditRegistration}</p>
                <button type="button" disabled={state === "submitting" || state === "disabled"} onClick={() => { setModalOpen(false); onStateChange("Closed"); }} className={`mt-5 ${previewButton} disabled:cursor-wait disabled:opacity-50`}>{state === "submitting" ? copy.processing : copy.confirm}</button>
              </div>
            </div>
          ) : null}
        </div>
      );
    case "data-table": {
      const baseRows = state === "empty" ? [] : ascending ? ["Audit Panel", "Button", "Confidence Badge"] : ["Confidence Badge", "Button", "Audit Panel"];
      const rows = state === "loading" ? [copy.loading] : baseRows;
      return (
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{intent === "compare" ? copy.compareComponents : intent === "inspect" ? copy.inspectComponents : copy.manageComponents}</caption>
            <thead className="bg-white/[0.04] text-slate-400">
              <tr><th className="px-4 py-3"><button type="button" onClick={() => { setAscending((value) => !value); onStateChange("Sorted"); }}>{copy.component} {ascending ? "↑" : "↓"}</button></th><th className="px-4 py-3">{copy.status}</th></tr>
            </thead>
            <tbody>
              {rows.map((row, index) => <tr key={row} className={`border-t border-white/[0.06] ${state === "selected row" && index === 0 ? "bg-primary/10" : ""}`}><td className="px-4 py-3 text-white">{row}</td><td className="px-4 py-3 text-primary">{state === "loading" ? "..." : copy.stable}</td></tr>)}
              {rows.length === 0 ? <tr><td colSpan={2} className="px-4 py-8 text-center text-slate-400">{copy.noResults}</td></tr> : null}
            </tbody>
          </table>
        </div>
      );
    }
    case "alert": {
      const alertTone = state === "error"
        ? "border-error/25 bg-error/[0.07] text-error"
        : state === "success"
          ? "border-[var(--velaris-color-success)]/25 bg-[color:rgba(126,231,135,0.07)] text-[var(--velaris-color-success)]"
          : state === "warning"
            ? "border-warning/20 bg-warning/[0.06] text-warning"
            : "border-primary/20 bg-primary/[0.06] text-primary";
      return alertVisible ? (
        <div role="alert" className={`flex w-full max-w-md items-start gap-3 rounded-xl border p-4 ${alertTone}`}>
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1"><p className="text-sm font-bold text-white">{intent === "warn" ? copy.attentionNeeded : intent === "block" ? copy.actionBlocked : copy.systemUpdate}</p><p className="mt-1 text-xs text-slate-400">{copy.reviewEvidence}</p></div>
          <button type="button" onClick={() => { setAlertVisible(false); onStateChange("Dismissed"); }} aria-label={copy.closeAlert}><X className="h-4 w-4 text-slate-400" /></button>
        </div>
      ) : <button type="button" onClick={() => { setAlertVisible(true); onStateChange("Info"); }} className={secondaryButton}>{copy.restoreAlert}</button>;
    }
    case "toast":
      return (
        <div className="text-center">
          <button type="button" onClick={() => { setToastVisible(true); onStateChange("Visible"); }} className={previewButton}>{copy.showNotification}</button>
          {toastVisible ? <div role="status" className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-[transform,opacity,background-color,border-color,color] ${intent === "success" ? "border-[var(--velaris-color-success)]/25 bg-[color:rgba(126,231,135,0.08)] text-[var(--velaris-color-success)]" : "border-primary/20 bg-primary/10 text-primary"} ${state === "entering" ? "translate-y-1 opacity-70" : state === "leaving" ? "-translate-y-1 opacity-40" : ""}`}><CheckCircle2 className="h-4 w-4" aria-hidden />{intent === "undo" ? copy.removedUndo : intent === "info" ? copy.syncStarted : copy.analysisComplete}</div> : null}
        </div>
      );
    case "skeleton-loader":
      return (
        <div className="w-full max-w-sm">
          <button type="button" onClick={() => { const next = !loaded; setLoaded(next); onStateChange(next ? "Loaded" : "Loading"); }} className={`${secondaryButton} mb-5`}>{loaded ? copy.showLoading : copy.loadContent}</button>
          {state === "error" ? <div role="alert" className="rounded-xl border border-error/20 bg-error/[0.06] p-4 text-sm text-error">{copy.loadFailure}</div> : loaded ? <div className="rounded-xl border border-white/10 p-4"><p className="font-semibold text-white">{copy.retrievedSource}</p><p className="mt-2 text-xs text-slate-400">{intent}: 92% {copy.match}</p></div> : <div aria-busy="true" className="space-y-3"><div className={`h-5 w-2/3 rounded bg-white/10 ${state === "reduced motion" ? "" : "animate-pulse"}`} /><div className={`h-3 w-full rounded bg-white/[0.06] ${state === "reduced motion" ? "" : "animate-pulse"}`} /><div className={`h-3 w-4/5 rounded bg-white/[0.06] ${state === "reduced motion" ? "" : "animate-pulse"}`} /></div>}
        </div>
      );
    case "explanation-tooltip":
      return (
        <div className="relative">
          <button type="button" aria-describedby="confidence-tip" onMouseEnter={() => { setTooltipOpen(true); onStateChange("Hover"); }} onMouseLeave={() => { setTooltipOpen(false); onStateChange("Closed"); }} onFocus={() => { setTooltipOpen(true); onStateChange("Focus"); }} onBlur={() => { setTooltipOpen(false); onStateChange("Closed"); }} className={secondaryButton}>
            {intent === "shortcut" ? copy.shortcut : intent === "definition" ? copy.definition : copy.explanation} <MessageCircleQuestion className="ml-1 inline h-4 w-4" />
          </button>
          {tooltipOpen ? <div id="confidence-tip" role="tooltip" className="absolute bottom-full left-1/2 mb-3 w-64 -translate-x-1/2 rounded-xl border border-primary/20 bg-surface-container-high p-3 text-xs leading-5 text-slate-300 shadow-panel">{copy.calibratedTooltip}</div> : null}
        </div>
      );
    case "confidence-badge": {
      const tier = confidence >= 80 ? copy.high : confidence >= 55 ? copy.medium : copy.low;
      return (
        <div className="w-full max-w-sm">
          <div className={`flex items-center justify-between rounded-xl border p-4 ${state === "unavailable" ? "border-white/10 bg-white/[0.03] opacity-50" : confidence >= 80 ? "border-[var(--velaris-color-success)]/20 bg-[color:rgba(126,231,135,0.06)]" : confidence >= 55 ? "border-warning/20 bg-warning/[0.05]" : "border-error/20 bg-error/[0.05]"}`}><span className="text-sm font-semibold text-white">{intent === "warn" ? copy.confidenceRisk : intent === "support trust" ? copy.confidenceEvidence : copy.confidence} {state === "unavailable" ? copy.unavailable : tier}</span><span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-black text-primary">{state === "unavailable" ? "-" : `${confidence}%`}</span></div>
          <input aria-label={copy.confidence} disabled={state === "unavailable" || state === "inspecting"} type="range" min="25" max="98" value={confidence} onChange={(event) => { const value = Number(event.target.value); setConfidence(value); onStateChange(value >= 80 ? "High" : value >= 55 ? "Medium" : "Low"); }} className="mt-5 w-full accent-primary disabled:opacity-40" />
        </div>
      );
    }
    case "command-palette": {
      const commands = [copy.openComponents, copy.queryConfidenceBadge, copy.inspectAuditPanel].filter((command) => command.toLowerCase().includes(commandQuery.toLowerCase()));
      return (
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <label className="flex min-h-11 items-center gap-3 border-b border-white/10 px-4 py-3"><Command className="h-4 w-4 text-primary" /><input disabled={state === "closed" || state === "executing"} value={commandQuery} onChange={(event) => { setCommandQuery(event.target.value); onStateChange(event.target.value ? "Searching" : "Results"); }} placeholder={intent === "navigate" ? copy.goTo : intent === "execute" ? copy.executeAction : copy.searchCommand} className="w-full bg-transparent text-sm text-white outline-none disabled:opacity-40" /></label>
          <div className="p-2">{state === "closed" ? <p className="px-3 py-4 text-xs text-slate-400">{copy.paletteClosed}</p> : commands.map((command) => <button key={command} type="button" onClick={() => onStateChange("Executing")} className="block min-h-11 w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5 hover:text-white">{command}</button>)}{state !== "closed" && commands.length === 0 ? <p className="px-3 py-4 text-xs text-slate-400">{copy.noCommand}</p> : null}</div>
        </div>
      );
    }
    case "source-attribution":
      return (
        <div className="w-full max-w-md">
          <button type="button" disabled={state === "unavailable"} aria-expanded={sourceOpen} onClick={() => { const next = !sourceOpen; setSourceOpen(next); onStateChange(next ? "Expanded" : "Collapsed"); }} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-40"><span className="flex items-center gap-2 text-sm font-semibold text-white"><BookOpenCheck className="h-4 w-4 text-primary" />{intent === "verify" ? copy.verifiedSource : intent === "inspect" ? copy.inspectExcerpt : "ComponentsPage.tsx"}</span><span className="text-xs font-bold text-primary">{state === "partial match" ? "54%" : state === "unavailable" ? "-" : `92% ${copy.match}`}</span></button>
          {sourceOpen ? <div className="mt-2 rounded-xl border border-white/[0.07] bg-black/20 p-4 text-xs leading-5 text-slate-400">{copy.sourceEvidence}</div> : null}
        </div>
      );
    case "audit-panel":
      return (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <button type="button" aria-expanded={auditOpen} onClick={() => { const next = !auditOpen; setAuditOpen(next); onStateChange(next ? "Expanded" : "Collapsed"); }} className="flex min-h-11 w-full items-center justify-between"><span className="flex items-center gap-2 text-sm font-semibold text-white"><ListChecks className="h-4 w-4 text-primary" />{intent === "govern" ? copy.governance : intent === "debug" ? copy.diagnosis : copy.decisionTrail}</span><span className="text-xs font-bold text-primary">{auditOpen ? copy.collapse : copy.inspect}</span></button>
          <div className="mt-4 grid grid-cols-3 gap-2">{["Retrieval", "Ranking", "Synthesis"].map((stage, index) => <div key={stage} className={`rounded-lg border p-2 text-center ${state === "conflict" && index === 1 ? "border-error/30 bg-error/[0.06]" : "border-white/[0.07] bg-black/20"}`}><Check className={`mx-auto h-3.5 w-3.5 ${state === "running" && index === 2 ? "animate-pulse text-warning" : state === "conflict" && index === 1 ? "text-error" : "text-primary"}`} aria-hidden /><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{stage}</p></div>)}</div>
          {auditOpen ? <div className="mt-4 border-t border-white/[0.07] pt-4 text-xs leading-5 text-slate-400">{state === "conflict" ? copy.sourceConflict : state === "running" ? copy.auditRunning : copy.auditSummary}</div> : null}
        </div>
      );
    case "typography":
      return (
        <button type="button" onClick={() => { const next = !displayType; setDisplayType(next); onStateChange(next ? "Display" : "Heading"); }} className="min-h-11 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">{intent === "metadata" ? copy.metadata : intent === "reading" ? copy.continuousReading : copy.typeScale}</p>
          <p className={`mt-3 tracking-tight text-white transition-[font-size,line-height,letter-spacing] ${state === "code" ? "font-mono text-lg" : state === "caption" || state === "label" ? "text-xs font-bold uppercase tracking-widest" : displayType ? "text-5xl font-black" : "text-3xl font-black"}`}>{copy.explainableEvidence}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{copy.toggleTypeScale}</p>
        </button>
      );
    case "icon": {
      const icons = [ShieldPreview, SourcePreview, AuditPreview];
      const ActiveIcon = icons[iconIndex] ?? ShieldPreview;
      if (state === "decorative") {
        return (
          <div className="text-center">
            <span aria-hidden className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.06] text-primary/60">
              <ActiveIcon className="h-9 w-9" />
            </span>
            <p className="mt-3 text-xs text-slate-400">{copy.decorativeIcon}</p>
          </div>
        );
      }
      return (
        <div className="text-center">
          <button type="button" disabled={state === "disabled"} onClick={() => { setIconIndex((value) => (value + 1) % icons.length); onStateChange("Active"); }} className={`flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-colors hover:bg-primary/15 disabled:opacity-40 ${state === "active" ? "ring-2 ring-primary/50" : ""}`} aria-label={intent === "status" ? copy.toggleStatusIcon : copy.toggleIcon}>
            <ActiveIcon className="h-9 w-9" />
          </button>
          <p className="mt-3 text-xs text-slate-400">{intent}: {copy.clickToChangeSymbol}</p>
        </div>
      );
    }
  }
}

function ShieldPreview({ className }: { className?: string }) {
  return <CheckCircle2 className={className} />;
}

function SourcePreview({ className }: { className?: string }) {
  return <BookOpenCheck className={className} />;
}

function AuditPreview({ className }: { className?: string }) {
  return <ListChecks className={className} />;
}
