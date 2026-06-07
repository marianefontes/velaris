import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock3, MessageSquareText, Pencil, Plus, Trash2, X } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePanelFocusTrap } from "../../hooks/usePanelFocusTrap";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspace } from "../../providers/WorkspaceProvider";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { locale } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const {
    activeConversationId,
    conversations,
    createConversation,
    deleteConversation,
    openConversation,
    renameConversation,
  } = useWorkspace();
  const panelRef = useRef<HTMLElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  usePanelFocusTrap(isOpen, panelRef, onClose);

  const labels = locale === "en-US"
    ? {
        title: "Conversation History",
        subtitle: "Recent Beatrice sessions",
        newConversation: "New conversation",
        empty: "No conversations recorded yet",
        close: "Close history",
        rename: "Rename conversation",
        delete: "Delete conversation",
        save: "Save title",
        cancel: "Cancel rename",
        messages: "messages",
        active: "Active",
      }
    : {
        title: "Histórico de conversas",
        subtitle: "Sessões recentes da Beatrice",
        newConversation: "Nova conversa",
        empty: "Nenhuma conversa registrada ainda",
        close: "Fechar histórico",
        rename: "Renomear conversa",
        delete: "Deletar conversa",
        save: "Salvar título",
        cancel: "Cancelar renomeação",
        messages: "mensagens",
        active: "Ativa",
      };

  const recordedConversations = useMemo(
    () => conversations.filter((conversation) => conversation.history.length > 0),
    [conversations],
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "en-US" ? "en-US" : "pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );

  const beginRename = (conversationId: string, title: string) => {
    setEditingId(conversationId);
    setDraftTitle(title);
  };

  const finishRename = () => {
    if (!editingId) return;
    renameConversation(editingId, draftTitle);
    setEditingId(null);
    setDraftTitle("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[6px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onMouseDown={onClose}
        >
          <motion.section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="beatrice-history-title"
            tabIndex={-1}
            className="flex h-full w-full max-w-[28rem] flex-col overflow-hidden border-l border-white/10 bg-[linear-gradient(145deg,rgba(31,31,34,0.96),rgba(10,10,12,0.98))] shadow-[0_0_90px_rgba(222,204,253,0.14)] outline-none backdrop-blur-3xl sm:rounded-l-[28px]"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}>
                    <Clock3 className={`h-5 w-5 ${strategy.theme.accentText}`} />
                  </div>
                  <div>
                    <h2 id="beatrice-history-title" className="text-sm font-black text-white">
                      {labels.title}
                    </h2>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      {labels.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={labels.close}
                  className="glass-panel flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  createConversation();
                  onClose();
                }}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold text-background transition-all duration-200 hover:opacity-90 ${strategy.theme.signal}`}
              >
                <Plus className="h-4 w-4" />
                {labels.newConversation}
              </button>
            </header>

            <div className="beatrice-scrollbar flex-1 overflow-y-auto px-4 py-4">
              {recordedConversations.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10">
                    <MessageSquareText className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-white">{labels.empty}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {locale === "en-US"
                      ? "Your first prompt will become a named session here."
                      : "A primeira pergunta enviada vira uma sessão nomeada aqui."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recordedConversations.map((conversation) => {
                    const isActive = conversation.id === activeConversationId;
                    const isEditing = editingId === conversation.id;

                    return (
                      <motion.article
                        key={conversation.id}
                        layout
                        className={`group rounded-2xl border bg-surface-container-high/45 p-3 transition-all duration-200 ${
                          isActive
                            ? "border-primary/35 shadow-[0_0_34px_rgba(222,204,253,0.12)]"
                            : "border-white/8 hover:border-primary/20 hover:bg-white/[0.045]"
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={draftTitle}
                              onChange={(event) => setDraftTitle(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") finishRename();
                                if (event.key === "Escape") setEditingId(null);
                              }}
                              className="min-w-0 flex-1 rounded-xl border border-primary/20 bg-black/20 px-3 py-2 text-xs font-semibold text-white outline-none ring-primary/20 transition focus:ring-2"
                            />
                            <button
                              type="button"
                              onClick={finishRename}
                              aria-label={labels.save}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary hover:bg-primary/25"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              aria-label={labels.cancel}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/10 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                openConversation(conversation.id);
                                onClose();
                              }}
                              className="min-w-0 flex-1 text-left"
                            >
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-bold text-white">{conversation.title}</p>
                                {isActive && (
                                  <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                    {labels.active}
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                                {conversation.preview}
                              </p>
                              <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-600">
                                <span>{dateFormatter.format(new Date(conversation.updatedAt))}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-700" />
                                <span>{conversation.messageCount} {labels.messages}</span>
                              </div>
                            </button>

                            <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                              <button
                                type="button"
                                onClick={() => beginRename(conversation.id, conversation.title)}
                                aria-label={labels.rename}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-primary/10 hover:text-primary"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteConversation(conversation.id)}
                                aria-label={labels.delete}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
