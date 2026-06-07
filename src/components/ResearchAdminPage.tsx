import { ArrowLeft, Check, Copy, KeyRound, Link2, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { getApiBaseUrl } from "../services/apiConfig";
import { readResearchAdminKey, saveResearchAdminKey } from "../services/researchAdminAuth";

interface ResearchInvite {
  participant_code: string;
  status: string;
  created_at: string;
  expires_at: string;
  full_name?: string | null;
  role_title?: string | null;
  company_name?: string | null;
  session_id?: string | null;
  event_count: number;
}

interface ResearchEvent {
  id: number;
  event_type: string;
  occurred_at: string;
  path?: string | null;
  metadata: Record<string, unknown>;
}

interface ResearchSessionDetail {
  session_id: string;
  participant_code: string;
  status: string;
  full_name: string;
  company_name?: string | null;
  role_title: string;
  primary_area: string;
  experience_range: string;
  design_system_experience: string;
  design_system_frequency: string;
  consented_at: string;
  last_seen_at: string;
  events: ResearchEvent[];
}

export function ResearchAdminPage() {
  const [adminKey, setAdminKey] = useState(readResearchAdminKey);
  const [participantCode, setParticipantCode] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("30");
  const [invites, setInvites] = useState<ResearchInvite[]>([]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ResearchSessionDetail | null>(null);
  const [error, setError] = useState("");

  const loadInvites = useCallback(async (key = adminKey) => {
    if (!key) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${getApiBaseUrl()}/research/invites`, {
        headers: { "X-Research-Key": key },
      });
      if (!response.ok) throw new Error(response.status === 401 ? "Chave administrativa inválida." : "Não foi possível carregar os convites.");
      const body = await response.json() as { invites: ResearchInvite[] };
      saveResearchAdminKey(key);
      setInvites(body.invites);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao carregar convites.");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    if (adminKey) loadInvites(adminKey);
  }, []); // Only restore the protected session once on mount.

  async function createInvite(event: FormEvent) {
    event.preventDefault();
    if (!adminKey) {
      setError("Informe a chave administrativa.");
      return;
    }
    setLoading(true);
    setError("");
    setGeneratedLink("");
    try {
      const response = await fetch(`${getApiBaseUrl()}/research/invites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Research-Key": adminKey,
        },
        body: JSON.stringify({
          participant_code: participantCode.trim() || null,
          expires_in_days: Number(expiresInDays),
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { detail?: string } | null;
        throw new Error(body?.detail === "Participant code already exists" ? "Esse código já está em uso." : "Não foi possível gerar o convite.");
      }
      const body = await response.json() as { token: string };
      setGeneratedLink(`${window.location.origin}/study/${body.token}`);
      setParticipantCode("");
      saveResearchAdminKey(adminKey);
      await loadInvites(adminKey);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao gerar convite.");
      setLoading(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function openSession(sessionId: string) {
    setDetailLoading(true);
    setError("");
    try {
      const response = await fetch(`${getApiBaseUrl()}/research/sessions/${sessionId}`, {
        headers: { "X-Research-Key": adminKey },
      });
      if (!response.ok) throw new Error("Não foi possível carregar a sessão.");
      setSelectedSession(await response.json() as ResearchSessionDetail);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao carregar sessão.");
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background px-5 py-10 text-on-surface sm:px-8 lg:px-12">
      <main className="mx-auto max-w-[1120px]">
        <header className="mb-10 border-b border-white/[0.07] pb-8">
          <div className="mb-4 flex items-center gap-3">
            <img src="/aetheris.png" alt="Aetheris" className="h-9 w-9 object-contain" />
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-primary/70">Research console</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Convites da avaliação acadêmica</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Gere um link imprevisível para cada participante e acompanhe o início da coleta por código.
          </p>
        </header>

        {selectedSession ? (
          <SessionDetail session={selectedSession} onBack={() => setSelectedSession(null)} />
        ) : (
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <Plus className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-white">Gerar convite</h2>
            </div>
            <form onSubmit={createInvite} className="space-y-5">
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-300">Chave administrativa</span>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 focus-within:border-primary/35">
                  <KeyRound className="h-4 w-4 text-slate-600" />
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(event) => setAdminKey(event.target.value)}
                    className="h-11 w-full bg-transparent px-3 text-sm text-white outline-none"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-300">Código do participante</span>
                <input
                  value={participantCode}
                  onChange={(event) => setParticipantCode(event.target.value.toUpperCase())}
                  placeholder="Automático, ex.: P001"
                  maxLength={12}
                  className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none focus:border-primary/35"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-300">Validade do link</span>
                <select
                  value={expiresInDays}
                  onChange={(event) => setExpiresInDays(event.target.value)}
                  className="h-11 rounded-xl border border-white/10 bg-surface-container px-4 text-sm text-white outline-none focus:border-primary/35"
                >
                  <option value="7">7 dias</option>
                  <option value="14">14 dias</option>
                  <option value="30">30 dias</option>
                  <option value="60">60 dias</option>
                </select>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-on-primary transition hover:bg-primary-dim active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                Gerar link personalizado
              </button>
            </form>

            {generatedLink ? (
              <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.04] p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300">Link criado</p>
                <p className="break-all font-mono text-[11px] leading-5 text-slate-300">{generatedLink}</p>
                <button onClick={copyLink} type="button" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado" : "Copiar link"}
                </button>
              </div>
            ) : null}
            {error ? <p role="alert" className="mt-4 text-xs text-rose-300">{error}</p> : null}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">Participantes</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Convites gerados</h2>
              </div>
              <button
                type="button"
                onClick={() => loadInvites()}
                disabled={!adminKey || loading}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:text-white disabled:opacity-30"
                aria-label="Atualizar convites"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
              {invites.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-slate-500">
                  Informe a chave administrativa para carregar ou gerar convites.
                </div>
              ) : (
                <div className="divide-y divide-white/[0.07]">
                  {invites.map((invite) => (
                    <button
                      key={`${invite.participant_code}-${invite.created_at}`}
                      type="button"
                      disabled={!invite.session_id || detailLoading}
                      onClick={() => invite.session_id && openSession(invite.session_id)}
                      className="grid w-full gap-3 px-5 py-4 text-left transition enabled:hover:bg-white/[0.025] disabled:cursor-default sm:grid-cols-[80px_1fr_auto] sm:items-center"
                    >
                      <span className="font-mono text-xs font-bold text-primary">{invite.participant_code}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{invite.full_name || "Aguardando cadastro"}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {[invite.role_title, invite.company_name].filter(Boolean).join(" · ") || `Expira em ${new Date(invite.expires_at).toLocaleDateString("pt-BR")}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-slate-600">{invite.event_count ?? 0} eventos</span>
                        <span className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${
                          invite.status === "completed"
                            ? "border-emerald-300/25 text-emerald-300"
                            : invite.status === "started"
                              ? "border-primary/25 text-primary"
                              : "border-white/10 text-slate-500"
                        }`}>
                          {invite.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
        )}
      </main>
    </div>
  );
}

function SessionDetail({
  session,
  onBack,
}: {
  session: ResearchSessionDetail;
  onBack: () => void;
}) {
  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos convites
      </button>

      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="self-start rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 lg:sticky lg:top-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            {session.participant_code}
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">{session.full_name}</h2>
          <p className="mt-2 text-sm text-slate-400">{session.role_title}</p>
          {session.company_name ? <p className="mt-1 text-xs text-slate-500">{session.company_name}</p> : null}

          <dl className="mt-7 divide-y divide-white/[0.07] border-y border-white/[0.07] text-xs">
            {[
              ["Área", labelForValue(session.primary_area)],
              ["Experiência profissional", labelForValue(session.experience_range)],
              ["Experiência com DS", labelForValue(session.design_system_experience)],
              ["Uso de DS", labelForValue(session.design_system_frequency)],
              ["Consentimento", formatDateTime(session.consented_at)],
              ["Última atividade", formatDateTime(session.last_seen_at)],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[1fr_auto] gap-4 py-3">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-medium text-slate-300">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">Uso individual</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Linha do tempo da sessão</h2>
            </div>
            <span className="font-mono text-[10px] text-slate-600">{session.events.length} eventos</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            {session.events.map((event) => (
              <div key={event.id} className="border-b border-white/[0.07] p-5 last:border-b-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary/70" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                      {eventLabel(event.event_type)}
                    </span>
                  </div>
                  <time className="font-mono text-[10px] text-slate-600">{formatDateTime(event.occurred_at)}</time>
                </div>
                {event.path ? <p className="mt-3 font-mono text-[11px] text-slate-500">{event.path}</p> : null}
                <EventMetadata metadata={event.metadata} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventMetadata({ metadata }: { metadata: Record<string, unknown> }) {
  const entries = Object.entries(metadata).filter(([, value]) => value !== null && value !== "");
  if (entries.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {entries.map(([key, value]) => (
        <div key={key} className="grid gap-1 sm:grid-cols-[120px_1fr]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-600">{key.replace(/_/g, " ")}</span>
          <span className="whitespace-pre-wrap break-words text-xs leading-5 text-slate-400">
            {typeof value === "string" ? value : JSON.stringify(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function eventLabel(value: string): string {
  return {
    study_started: "Estudo iniciado",
    page_view: "Página acessada",
    prompt_submitted: "Pergunta enviada",
    response_completed: "Resposta recebida",
    response_error: "Erro de resposta",
    perspective_changed: "Perspectiva alterada",
    task_started: "Tarefa iniciada",
    task_completed: "Tarefa concluída",
    survey_answered: "Questionário respondido",
    study_completed: "Estudo concluído",
  }[value] ?? value.replace(/_/g, " ");
}

function labelForValue(value: string): string {
  return {
    design: "Design / UX / UI",
    frontend: "Front-end",
    product: "Produto",
    qa: "Qualidade / QA",
    content: "Conteúdo",
    accessibility: "Acessibilidade",
    research: "Pesquisa",
    other: "Outra",
    "under-1": "Menos de 1 ano",
    "1-2": "1 a 2 anos",
    "3-5": "3 a 5 anos",
    "6-10": "6 a 10 anos",
    "over-10": "Mais de 10 anos",
    none: "Nenhuma",
    basic: "Básica",
    intermediate: "Intermediária",
    advanced: "Avançada",
    never: "Nunca",
    rarely: "Raramente",
    monthly: "Mensalmente",
    weekly: "Semanalmente",
    daily: "Diariamente",
  }[value] ?? value;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
