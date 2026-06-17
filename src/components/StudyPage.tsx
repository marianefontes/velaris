import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  Globe,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { localeOptions, useI18n } from "../i18n/I18nProvider";
import { getStudyPageContent } from "../i18n/pages/studyPage";
import { getApiBaseUrl } from "../services/apiConfig";
import {
  getStudySessionForInvite,
  saveStudySession,
  validateStudySession,
} from "../services/studyTracking";

type PageState = "loading" | "ready" | "submitting" | "success" | "invalid" | "used";

interface InviteResponse {
  participant_code: string;
  status: "invited" | "started" | "completed" | "expired" | "revoked";
  expires_at: string;
  consent_version: string;
}

interface EnrollmentResponse {
  session_id: string;
  access_token: string;
  participant_code: string;
}

interface StudyForm {
  fullName: string;
  roleTitle: string;
  primaryArea: string;
  experienceRange: string;
  designSystemExperience: string;
  designSystemFrequency: string;
  companyDisclosure: "yes" | "no";
  companyName: string;
  confirmsAdult: boolean;
  consentAcademicUse: boolean;
  consentInteractionRecording: boolean;
  consentVoluntary: boolean;
}

const INITIAL_FORM: StudyForm = {
  fullName: "",
  roleTitle: "",
  primaryArea: "",
  experienceRange: "",
  designSystemExperience: "",
  designSystemFrequency: "",
  companyDisclosure: "no",
  companyName: "",
  confirmsAdult: false,
  consentAcademicUse: false,
  consentInteractionRecording: false,
  consentVoluntary: false,
};

function StudyLocaleSelector() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shortLabel = locale.split("-")[0].toUpperCase();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t("shell.localeSelectorAria")}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="focus-ring flex min-h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-white/15 hover:text-white"
      >
        <Globe aria-hidden="true" className="h-3.5 w-3.5 text-slate-300" />
        <span className="tracking-wide">{shortLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3 w-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("shell.localeSelectorAria")}
          className="absolute right-0 z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-white/10 bg-surface-container-highest/95 py-1 shadow-panel backdrop-blur-2xl"
        >
          {localeOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              role="menuitemradio"
              aria-checked={locale === option.code}
              onClick={() => {
                setLocale(option.code);
                setOpen(false);
                window.requestAnimationFrame(() => triggerRef.current?.focus());
              }}
              className={`focus-ring flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                locale === option.code
                  ? "bg-primary/8 font-semibold text-primary"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="font-mono text-[10px] text-slate-400">
                {option.code.split("-")[1]}
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldLabel({
  children,
  optional = false,
  optionalLabel,
}: {
  children: string;
  optional?: boolean;
  optionalLabel: string;
}) {
  return (
    <span className="flex items-center justify-between text-xs font-semibold text-slate-200">
      {children}
      {optional ? (
        <span className="text-[10px] font-normal uppercase tracking-widest text-slate-600">{optionalLabel}</span>
      ) : null}
    </span>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  optional,
  optionalLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
  optional?: boolean;
  optionalLabel: string;
}) {
  return (
    <label className="grid gap-2">
      <FieldLabel optional={optional} optionalLabel={optionalLabel}>
        {label}
      </FieldLabel>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={!optional}
        className="h-12 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-primary/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-primary/10 placeholder:text-slate-650"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  optionalLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly (readonly [string, string])[];
  placeholder: string;
  optionalLabel: string;
}) {
  return (
    <label className="grid gap-2">
      <FieldLabel optionalLabel={optionalLabel}>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="h-12 rounded-xl border border-white/10 bg-surface-container px-4 text-sm text-white outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function ConsentCheck({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: string;
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-white/[0.13]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        required
        className="peer sr-only"
      />
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/[0.03] text-transparent transition peer-checked:border-primary/45 peer-checked:bg-primary peer-checked:text-on-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <span className="text-xs leading-5 text-slate-400 transition group-hover:text-slate-300">{children}</span>
    </label>
  );
}

export function StudyPage() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const { locale } = useI18n();
  const content = useMemo(() => getStudyPageContent(locale), [locale]);
  const [state, setState] = useState<PageState>("loading");
  const [invite, setInvite] = useState<InviteResponse | null>(null);
  const [form, setForm] = useState<StudyForm>(INITIAL_FORM);
  const [error, setError] = useState("");

  const allConsentsAccepted = useMemo(
    () => form.confirmsAdult && form.consentAcademicUse && form.consentInteractionRecording && form.consentVoluntary,
    [form],
  );

  useEffect(() => {
    let active = true;

    async function loadInvite() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/study/invites/${token}`);
        if (!response.ok) {
          if (active) setState("invalid");
          return;
        }
        const data = (await response.json()) as InviteResponse;
        if (!active) return;
        setInvite(data);

        if (data.status === "invited") {
          setState("ready");
          return;
        }

        const saved = getStudySessionForInvite(token);
        if (saved && (await validateStudySession(saved))) {
          setState("success");
          return;
        }
        setState(data.status === "started" || data.status === "completed" ? "used" : "invalid");
      } catch {
        if (active) {
          setError(content.connectionError);
          setState("invalid");
        }
      }
    }

    loadInvite();
    return () => {
      active = false;
    };
  }, [token, content.connectionError]);

  const update = <Key extends keyof StudyForm>(key: Key, value: StudyForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!allConsentsAccepted) {
      setError(content.errors.consentRequired);
      return;
    }
    if (form.companyDisclosure === "yes" && !form.companyName.trim()) {
      setError(content.errors.companyRequired);
      return;
    }

    setState("submitting");
    try {
      const response = await fetch(`${getApiBaseUrl()}/study/invites/${token}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName,
          role_title: form.roleTitle,
          primary_area: form.primaryArea,
          experience_range: form.experienceRange,
          design_system_experience: form.designSystemExperience,
          design_system_frequency: form.designSystemFrequency,
          company_disclosure: form.companyDisclosure === "yes",
          company_name: form.companyDisclosure === "yes" ? form.companyName : null,
          confirms_adult: form.confirmsAdult,
          consent_academic_use: form.consentAcademicUse,
          consent_interaction_recording: form.consentInteractionRecording,
          consent_voluntary: form.consentVoluntary,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { detail?: string } | null;
        throw new Error(body?.detail ?? "enrollment_failed");
      }

      const enrollment = (await response.json()) as EnrollmentResponse;
      saveStudySession({
        inviteToken: token,
        sessionId: enrollment.session_id,
        accessToken: enrollment.access_token,
        participantCode: enrollment.participant_code,
        createdAt: new Date().toISOString(),
      });
      setState("success");
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : "";
      setError(
        message === "invite_already_used" ? content.errors.inviteUsed : content.errors.enrollmentFailed,
      );
      setState("ready");
    }
  }

  const consentSummary = content.sections.consent.summaryParagraphs.map((paragraph) =>
    paragraph.replace("{code}", invite?.participant_code ?? "P000"),
  );

  if (state === "loading") {
    return (
      <StudyFrame>
        <div className="flex min-h-[55vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
            {content.loading}
          </div>
        </div>
      </StudyFrame>
    );
  }

  if (state === "invalid" || state === "used") {
    return (
      <StudyFrame>
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center py-16">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <LockKeyhole className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
            {content.inviteEyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {state === "used" ? content.usedTitle : content.invalidTitle}
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            {error || (state === "used" ? content.usedBody : content.invalidBody)}
          </p>
        </div>
      </StudyFrame>
    );
  }

  if (state === "success") {
    return (
      <StudyFrame>
        <div className="mx-auto flex min-h-[68vh] max-w-2xl flex-col justify-center py-16">
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-success/20 bg-success/[0.06]">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-success/80">
            {content.successEyebrow(invite?.participant_code ?? "")}
          </p>
          <h1 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">{content.successTitle}</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-400">{content.successBody}</p>
          <button
            type="button"
            onClick={() => navigate("/main")}
            className="mt-9 inline-flex w-fit items-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-on-primary transition hover:bg-primary-dim active:scale-[0.98]"
          >
            {content.startExperience}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </StudyFrame>
    );
  }

  return (
    <StudyFrame>
      <div className="grid gap-12 py-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:py-16">
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <div className="mb-8 flex items-center gap-3">
            <img src="/aetheris.png" alt="Velaris" className="h-10 w-10 object-contain" />
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-white">VELARIS</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-600">{content.brandSubtitle}</p>
            </div>
          </div>

          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70">
            {content.participantLabel(invite?.participant_code ?? "")}
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{content.heroTitle}</h1>
          <p className="mt-5 text-sm leading-6 text-slate-400">{content.heroBody}</p>

          <div className="mt-9 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {[
              { icon: Clock3, ...content.highlights[0] },
              { icon: GraduationCap, ...content.highlights[1] },
              { icon: ShieldCheck, ...content.highlights[2] },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-3 py-4">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">{title}</p>
                  <p className="mt-1 text-xs text-slate-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <form onSubmit={submit} className="space-y-10">
          <section>
            <SectionHeading
              number="01"
              icon={<UserRound className="h-4 w-4" />}
              title={content.sections.about.title}
              description={content.sections.about.description}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput
                label={content.fields.fullName}
                value={form.fullName}
                onChange={(value) => update("fullName", value)}
                placeholder={content.fields.fullNamePlaceholder}
                autoComplete="name"
                optionalLabel={content.optional}
              />
              <TextInput
                label={content.fields.roleTitle}
                value={form.roleTitle}
                onChange={(value) => update("roleTitle", value)}
                placeholder={content.fields.roleTitlePlaceholder}
                autoComplete="organization-title"
                optionalLabel={content.optional}
              />
              <SelectInput
                label={content.fields.primaryArea}
                value={form.primaryArea}
                onChange={(value) => update("primaryArea", value)}
                options={content.areaOptions}
                placeholder={content.selectPlaceholder}
                optionalLabel={content.optional}
              />
              <SelectInput
                label={content.fields.experienceRange}
                value={form.experienceRange}
                onChange={(value) => update("experienceRange", value)}
                options={content.experienceOptions}
                placeholder={content.selectPlaceholder}
                optionalLabel={content.optional}
              />
              <SelectInput
                label={content.fields.designSystemExperience}
                value={form.designSystemExperience}
                onChange={(value) => update("designSystemExperience", value)}
                options={content.designSystemExperienceOptions}
                placeholder={content.selectPlaceholder}
                optionalLabel={content.optional}
              />
              <SelectInput
                label={content.fields.designSystemFrequency}
                value={form.designSystemFrequency}
                onChange={(value) => update("designSystemFrequency", value)}
                options={content.designSystemFrequencyOptions}
                placeholder={content.selectPlaceholder}
                optionalLabel={content.optional}
              />
            </div>
          </section>

          <section>
            <SectionHeading
              number="02"
              icon={<Building2 className="h-4 w-4" />}
              title={content.sections.company.title}
              description={content.sections.company.description}
            />
            <fieldset>
              <legend className="mb-3 text-xs font-semibold text-slate-200">{content.sections.company.legend}</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["yes", content.sections.company.yes],
                  ["no", content.sections.company.no],
                ].map(([value, label]) => (
                  <label key={value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="company-disclosure"
                      value={value}
                      checked={form.companyDisclosure === value}
                      onChange={() => update("companyDisclosure", value as "yes" | "no")}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-3 text-center text-xs text-slate-400 transition peer-checked:border-primary/35 peer-checked:bg-primary/[0.08] peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
              {form.companyDisclosure === "yes" ? (
                <div className="mt-4">
                  <TextInput
                    label={content.fields.companyName}
                    value={form.companyName}
                    onChange={(value) => update("companyName", value)}
                    placeholder={content.fields.companyNamePlaceholder}
                    autoComplete="organization"
                    optionalLabel={content.optional}
                  />
                </div>
              ) : null}
            </fieldset>
          </section>

          <section>
            <SectionHeading
              number="03"
              icon={<FileCheck2 className="h-4 w-4" />}
              title={content.sections.consent.title}
              description={content.sections.consent.description}
            />

            <div className="mb-5 rounded-2xl border border-primary/15 bg-primary/[0.045] p-5">
              <p className="text-sm font-semibold text-white">{content.sections.consent.summaryTitle}</p>
              <div className="mt-3 space-y-3 text-xs leading-5 text-slate-400">
                {consentSummary.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <ConsentCheck checked={form.confirmsAdult} onChange={(value) => update("confirmsAdult", value)}>
                {content.consentChecks.adult}
              </ConsentCheck>
              <ConsentCheck checked={form.consentAcademicUse} onChange={(value) => update("consentAcademicUse", value)}>
                {content.consentChecks.academicUse}
              </ConsentCheck>
              <ConsentCheck
                checked={form.consentInteractionRecording}
                onChange={(value) => update("consentInteractionRecording", value)}
              >
                {content.consentChecks.recording}
              </ConsentCheck>
              <ConsentCheck checked={form.consentVoluntary} onChange={(value) => update("consentVoluntary", value)}>
                {content.consentChecks.voluntary}
              </ConsentCheck>
            </div>
          </section>

          {error ? (
            <div role="alert" className="rounded-xl border border-error/25 bg-error/[0.06] px-4 py-3 text-xs text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <LockKeyhole className="h-3.5 w-3.5" />
              {content.consentVersion(invite?.consent_version ?? "2026-06-06-v1")}
            </div>
            <button
              type="submit"
              disabled={state === "submitting" || !allConsentsAccepted}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-on-primary transition enabled:hover:bg-primary-dim enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {state === "submitting" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {state === "submitting" ? content.submitPreparing : content.submitCta}
            </button>
          </div>
        </form>
      </div>
    </StudyFrame>
  );
}

function StudyFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-background text-on-surface">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(222,204,253,0.10),transparent_34%),radial-gradient(ellipse_at_90%_95%,rgba(194,160,252,0.06),transparent_30%)]" />
      <main className="relative mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-12">
        <div className="flex justify-end pt-6">
          <StudyLocaleSelector />
        </div>
        {children}
      </main>
    </div>
  );
}

function SectionHeading({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 grid grid-cols-[auto_1fr] gap-x-3">
      <div className="row-span-2 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-primary/15 bg-primary/[0.06] text-primary/80">
        {icon}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] tracking-widest text-slate-600">{number}</span>
        <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}
