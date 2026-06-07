# EXECUTION_MODES.md — Modos de Execução do Agente

> Os cinco modos operacionais do agente de código e as transições entre eles. Memória operacional.
> NÃO confundir com o rollback de calibração da Beatrice (`laboratory/store.py`), que é outra camada.
> Atualizado: 2026-06-07.

---

## 1. Os cinco modos

| Modo | Objetivo | Pode escrever? | Pode deletar? |
|------|----------|:--------------:|:-------------:|
| **Audit** | Diagnosticar, mapear, achar evidência | ❌ | ❌ |
| **Plan** | Desenhar plano de mudança, sem executar | ❌ | ❌ |
| **Execute** | Aplicar mudança aprovada | ✅ | só com permissão |
| **Review** | Validar o que foi feito (build, testes, diff) | ❌ | ❌ |
| **Rollback** | Reverter mudança problemática | ✅ (reverter) | ✅ (reverter) |

---

## 2. Fluxo padrão

```
Audit → Plan → [permissão] → Execute → Review → (Rollback se falhar)
```

- **Audit** e **Plan** nunca alteram nada. São o default para qualquer pedido não-trivial.
- A transição **Plan → Execute** exige permissão explícita quando o risco é Medium+ (ver `RISK_MODEL.md`).
- **Review** é obrigatório após Execute: `npm run build` no mínimo.
- **Rollback** é acionado se Review falhar ou se o usuário pedir.

---

## 3. Audit Mode

- Só leitura: Read, Grep, Glob, Bash (somente comandos não-mutantes).
- Entrega: diagnóstico + evidências (arquivo:linha) + riscos.
- Nunca conclui com "apliquei" — Audit não aplica.

## 4. Plan Mode

- Entrega: plano por fases, arquivos prováveis, risco por item, validação necessária, rollback.
- Separar claramente: melhoria segura / moderada / alto risco.
- Terminar com pedido de permissão para a primeira fase.

## 5. Execute Mode

Pré-condições:
- [ ] Permissão obtida (se Risk ≥ Medium)
- [ ] Plano apresentado
- [ ] Preflight de `AGENT.md` §5 cumprido

Durante:
- Uma mudança coerente por vez.
- Para ações destrutivas: **dry-run / diff preview ANTES** de aplicar.
- Nunca deletar sem confirmação por etapa.

## 6. Review Mode

- `npm run build` (gate principal).
- Testes relevantes (`test:rag`, `test:beatrice`).
- Verificar espelhamento (`AGENT.md` §3).
- Conferir que nada de gerado foi commitado (`GENERATED_FILES.md`).
- Entrega: o que mudou, validação que passou, o que falta.

## 7. Rollback Mode

- Preferir `git` para reverter (revert commit isolado por mudança).
- Se houve migração de dados (localStorage/SQLite), reverter exige plano de migração inversa — declarar antes.
- Toda mudança High deve ter tido plano de rollback definido ANTES (RISK_MODEL §4).

---

## 8. Proteções contra exclusão acidental

- Nenhuma exclusão de arquivo sem permissão explícita listando os arquivos.
- Nunca `rm -rf`, `git clean -fdx`, `git reset --hard` sem confirmação.
- Antes de deletar: confirmar que o arquivo é morto (sem imports ativos) — ver lista em `CLAUDE.md` "Arquivos Mortos Conhecidos".
- Mover (`git mv`) > deletar+recriar, para preservar histórico.

---

## 9. Como sinalizar o modo na resposta

Abrir respostas não-triviais declarando o modo:

```
Mode: Audit — diagnóstico apenas, nada será alterado.
```
```
Mode: Execute — aplicando Fase 1 (autorizada). Validação ao final.
```
