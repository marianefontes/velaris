import { KeyRound, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import {
  readResearchAdminKey,
  saveResearchAdminKey,
  verifyResearchAdminAccess,
  type ResearchAdminVerification,
} from "../services/researchAdminAuth";

function researchAdminErrorMessage(result: ResearchAdminVerification): string {
  if (result.authenticated) return "";
  return {
    invalid: "Chave administrativa inválida.",
    unconfigured: "RESEARCH_ADMIN_KEY não está configurada no servidor.",
    route_missing: "Endpoint de autenticação não encontrado.",
    unreachable: "Não foi possível contactar o servidor.",
    server_error: "Erro ao verificar a chave administrativa.",
  }[result.reason];
}

export function ResearchAdminGate({
  eyebrow,
  title,
  description,
  onAuthenticated,
}: {
  eyebrow: string;
  title: string;
  description: string;
  onAuthenticated: () => void;
}) {
  const [key, setKey] = useState(readResearchAdminKey);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      setErrorMessage("Informe a chave administrativa para continuar.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMessage("");
    const result = await verifyResearchAdminAccess(trimmedKey);
    if (!result.authenticated) {
      setErrorMessage(researchAdminErrorMessage(result));
      setStatus("error");
      return;
    }
    saveResearchAdminKey(trimmedKey);
    onAuthenticated();
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-[1180px] place-items-center px-6 py-14">
      <div className="grid w-full overflow-hidden rounded-[28px] border border-white/[0.09] bg-surface-container-low shadow-[0_30px_100px_rgba(0,0,0,0.42)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative min-h-[360px] overflow-hidden border-b border-white/[0.08] p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:36px_36px]" />
          <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary/70">{eyebrow}</p>
            <h1 className="mt-5 max-w-lg text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">{description}</p>
          </div>
        </div>
        <form onSubmit={submit} className="flex flex-col justify-center p-8 lg:p-12">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.07]">
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-white">Autenticar acesso interno</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Use a chave administrativa de pesquisa.</p>
          <label className="mt-7 grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Research admin key</span>
            <input
              type="password"
              value={key}
              onChange={(event) => {
                setKey(event.target.value);
                if (status === "error") setStatus("idle");
              }}
              autoComplete="current-password"
              className="h-12 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-primary/40"
              required
              autoFocus
            />
          </label>
          {status === "error" ? (
            <p role="alert" className="mt-3 text-xs leading-5 text-rose-300">{errorMessage}</p>
          ) : null}
          <button
            type="submit"
            disabled={status === "loading" || key.trim().length === 0}
            aria-busy={status === "loading"}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-bold uppercase tracking-[0.16em] text-on-primary transition hover:bg-primary-dim disabled:opacity-50"
          >
            {status === "loading" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
