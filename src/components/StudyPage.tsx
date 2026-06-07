import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const AREA_OPTIONS = [
  ["design", "Design / UX / UI"],
  ["frontend", "Desenvolvimento front-end"],
  ["product", "Produto / Gestão de produto"],
  ["qa", "Qualidade / QA"],
  ["content", "Conteúdo / UX Writing"],
  ["accessibility", "Acessibilidade"],
  ["research", "Pesquisa"],
  ["other", "Outra área"],
];

function FieldLabel({ children, optional = false }: { children: string; optional?: boolean }) {
  return (
    <span className="flex items-center justify-between text-xs font-semibold text-slate-200">
      {children}
      {optional ? <span className="text-[10px] font-normal uppercase tracking-widest text-slate-600">Opcional</span> : null}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
  optional?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <FieldLabel optional={optional}>{label}</FieldLabel>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="grid gap-2">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="h-12 rounded-xl border border-white/10 bg-surface-container px-4 text-sm text-white outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      >
        <option value="" disabled>Selecione uma opção</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
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
        const data = await response.json() as InviteResponse;
        if (!active) return;
        setInvite(data);

        if (data.status === "invited") {
          setState("ready");
          return;
        }

        const saved = getStudySessionForInvite(token);
        if (saved && await validateStudySession(saved)) {
          setState("success");
          return;
        }
        setState(data.status === "started" || data.status === "completed" ? "used" : "invalid");
      } catch {
        if (active) {
          setError("Não foi possível validar o convite. Verifique sua conexão e tente novamente.");
          setState("invalid");
        }
      }
    }

    loadInvite();
    return () => { active = false; };
  }, [token]);

  const update = <Key extends keyof StudyForm>(key: Key, value: StudyForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!allConsentsAccepted) {
      setError("Confirme todos os itens de consentimento para continuar.");
      return;
    }
    if (form.companyDisclosure === "yes" && !form.companyName.trim()) {
      setError("Informe o nome da empresa ou selecione que prefere não informar.");
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
        const body = await response.json().catch(() => null) as { detail?: string } | null;
        throw new Error(body?.detail ?? "enrollment_failed");
      }

      const enrollment = await response.json() as EnrollmentResponse;
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
        message === "invite_already_used"
          ? "Este convite já foi utilizado."
          : "Não foi possível iniciar a participação. Tente novamente em alguns instantes.",
      );
      setState("ready");
    }
  }

  if (state === "loading") {
    return (
      <StudyFrame>
        <div className="flex min-h-[55vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
            Validando convite de pesquisa
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
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Convite de pesquisa</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {state === "used" ? "Este convite já foi utilizado." : "Este convite não está disponível."}
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            {error || (state === "used"
              ? "Abra o convite no mesmo navegador usado no cadastro ou entre em contato com as pesquisadoras."
              : "O link pode ter expirado, sido revogado ou estar incompleto. Solicite um novo convite às pesquisadoras.")}
          </p>
        </div>
      </StudyFrame>
    );
  }

  if (state === "success") {
    return (
      <StudyFrame>
        <div className="mx-auto flex min-h-[68vh] max-w-2xl flex-col justify-center py-16">
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06]">
            <CheckCircle2 className="h-6 w-6 text-emerald-300" />
          </div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300/80">
            Participação {invite?.participant_code}
          </p>
          <h1 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cadastro concluído. Sua sessão está pronta.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-400">
            A partir do próximo passo, sua navegação e suas interações com o Oráculo serão associadas apenas ao código da pesquisa.
          </p>
          <button
            type="button"
            onClick={() => navigate("/main")}
            className="mt-9 inline-flex w-fit items-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-on-primary transition hover:bg-primary-dim active:scale-[0.98]"
          >
            Começar experiência
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
            <img src="/aetheris.png" alt="Aetheris" className="h-10 w-10 object-contain" />
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-white">AETHERIS</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-600">Pesquisa acadêmica</p>
            </div>
          </div>

          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70">
            Participante {invite?.participant_code}
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Antes de conversar com a Beatrice.
          </h1>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Precisamos conhecer brevemente seu contexto profissional e registrar seu consentimento para a pesquisa do TCC.
          </p>

          <div className="mt-9 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {[
              { icon: Clock3, title: "Duração estimada", body: "Aproximadamente 30 minutos" },
              { icon: GraduationCap, title: "Finalidade", body: "Uso acadêmico e estudantil" },
              { icon: ShieldCheck, title: "Apresentação dos dados", body: "Identificação substituída por código" },
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
              title="Sobre você"
              description="Esses dados ajudam a interpretar os resultados conforme o perfil profissional."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput
                label="Nome completo"
                value={form.fullName}
                onChange={(value) => update("fullName", value)}
                placeholder="Como podemos identificar você?"
                autoComplete="name"
              />
              <TextInput
                label="Cargo ou função atual"
                value={form.roleTitle}
                onChange={(value) => update("roleTitle", value)}
                placeholder="Ex.: Product Designer"
                autoComplete="organization-title"
              />
              <SelectInput
                label="Principal área de atuação"
                value={form.primaryArea}
                onChange={(value) => update("primaryArea", value)}
                options={AREA_OPTIONS}
              />
              <SelectInput
                label="Tempo de experiência profissional"
                value={form.experienceRange}
                onChange={(value) => update("experienceRange", value)}
                options={[
                  ["under-1", "Menos de 1 ano"],
                  ["1-2", "1 a 2 anos"],
                  ["3-5", "3 a 5 anos"],
                  ["6-10", "6 a 10 anos"],
                  ["over-10", "Mais de 10 anos"],
                ]}
              />
              <SelectInput
                label="Experiência com design systems"
                value={form.designSystemExperience}
                onChange={(value) => update("designSystemExperience", value)}
                options={[
                  ["none", "Nenhuma experiência"],
                  ["basic", "Básica"],
                  ["intermediate", "Intermediária"],
                  ["advanced", "Avançada"],
                ]}
              />
              <SelectInput
                label="Frequência de uso de design systems"
                value={form.designSystemFrequency}
                onChange={(value) => update("designSystemFrequency", value)}
                options={[
                  ["never", "Nunca utilizo"],
                  ["rarely", "Raramente"],
                  ["monthly", "Algumas vezes por mês"],
                  ["weekly", "Semanalmente"],
                  ["daily", "Diariamente"],
                ]}
              />
            </div>
          </section>

          <section>
            <SectionHeading
              number="02"
              icon={<Building2 className="h-4 w-4" />}
              title="Empresa"
              description="Essa informação é opcional e não será divulgada no trabalho."
            />
            <fieldset>
              <legend className="mb-3 text-xs font-semibold text-slate-200">
                Você deseja informar a empresa onde trabalha?
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["yes", "Sim, desejo informar"],
                  ["no", "Prefiro não informar"],
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
                    label="Nome da empresa"
                    value={form.companyName}
                    onChange={(value) => update("companyName", value)}
                    placeholder="Informe o nome da organização"
                    autoComplete="organization"
                  />
                </div>
              ) : null}
            </fieldset>
          </section>

          <section>
            <SectionHeading
              number="03"
              icon={<FileCheck2 className="h-4 w-4" />}
              title="Consentimento"
              description="Leia as condições abaixo antes de iniciar sua participação."
            />

            <div className="mb-5 rounded-2xl border border-primary/15 bg-primary/[0.045] p-5">
              <p className="text-sm font-semibold text-white">Termo resumido de consentimento</p>
              <div className="mt-3 space-y-3 text-xs leading-5 text-slate-400">
                <p>
                  Esta atividade integra o trabalho acadêmico sobre o Aetheris, desenvolvido por Mariane Beatriz Soares Fontes e Gabrielle Canalle no CESAR.
                </p>
                <p>
                  Nome, cargo, perfil profissional, respostas, perguntas enviadas, respostas recebidas, páginas acessadas e tempo de interação poderão ser registrados para análise acadêmica e estudantil.
                </p>
                <p>
                  Em relatórios, apresentações e publicações, seu nome e a empresa informada não serão divulgados. A participação será apresentada por um código, como {invite?.participant_code ?? "P000"}. Os dados poderão ser mantidos por até 12 meses para auditoria acadêmica.
                </p>
                <p>
                  A participação é voluntária. Você pode interrompê-la a qualquer momento e solicitar a retirada dos dados pelo mesmo canal em que recebeu o convite. Não inclua informações confidenciais da sua empresa nas perguntas ao Oráculo.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <ConsentCheck checked={form.confirmsAdult} onChange={(value) => update("confirmsAdult", value)}>
                Confirmo que tenho 18 anos ou mais.
              </ConsentCheck>
              <ConsentCheck checked={form.consentAcademicUse} onChange={(value) => update("consentAcademicUse", value)}>
                Autorizo o uso dos dados informados exclusivamente para finalidades acadêmicas e estudantis relacionadas a esta pesquisa.
              </ConsentCheck>
              <ConsentCheck checked={form.consentInteractionRecording} onChange={(value) => update("consentInteractionRecording", value)}>
                Estou ciente de que minha navegação, perguntas, respostas e resultados das tarefas serão registrados para análise.
              </ConsentCheck>
              <ConsentCheck checked={form.consentVoluntary} onChange={(value) => update("consentVoluntary", value)}>
                Entendo que minha participação é voluntária e que minha identidade e empresa não serão divulgadas nos resultados.
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
              Consentimento v{invite?.consent_version ?? "2026-06-06-v1"}
            </div>
            <button
              type="submit"
              disabled={state === "submitting" || !allConsentsAccepted}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-on-primary transition enabled:hover:bg-primary-dim enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {state === "submitting" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {state === "submitting" ? "Preparando sessão" : "Concordar e participar"}
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
