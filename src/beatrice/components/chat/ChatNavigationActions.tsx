import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { profileIdOrDefault } from "../../domain/perspective/profileIds";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import type { NavigationAction } from "../../types/beatrice";

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function actionKey(action: NavigationAction): string {
  const profileId = action.metadata?.profileId;
  return `${action.label}-${action.href}-${profileId ?? "route"}`;
}

interface ChatNavigationActionsProps {
  navigationAction?: NavigationAction;
  secondaryNavigationActions?: NavigationAction[];
  compact?: boolean;
}

export function ChatNavigationActions({
  navigationAction,
  secondaryNavigationActions = [],
  compact = false,
}: ChatNavigationActionsProps) {
  const navigate = useNavigate();
  const personaContext = usePersonaContext();
  const actions = [
    ...(navigationAction ? [navigationAction] : []),
    ...secondaryNavigationActions,
  ];

  if (actions.length === 0) {
    return null;
  }

  const handleAction = (action: NavigationAction) => {
    const actionType = action.metadata?.action_type;
    const profileId = profileIdOrDefault(action.metadata?.profileId, personaContext.profileId);

    if (actionType === "set_profile" && action.metadata?.profileId) {
      personaContext.setProfileId(profileId);
    }

    if (isExternalHref(action.href)) {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }

    if (isInternalHref(action.href)) {
      navigate(action.href);
    }
  };

  return (
    <div
      className={`flex flex-wrap gap-2 ${compact ? "mt-2" : "mt-3 max-w-[72ch]"}`}
      data-chat-navigation-actions
    >
      {actions.map((action) => (
        <button
          key={actionKey(action)}
          type="button"
          onClick={() => handleAction(action)}
          aria-label={action.label}
          className={
            compact
              ? "focus-ring inline-flex min-h-9 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[12px] font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/15"
              : "focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/15"
          }
        >
          <span>{action.label}</span>
          <ArrowUpRight aria-hidden="true" className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </button>
      ))}
    </div>
  );
}
