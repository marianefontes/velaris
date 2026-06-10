export const ABRAXOS_AVATAR_SRC = "/abraxos-avatar.png";
export const ABRAXOS_CHAT_ICON_SRC = "/abraxos-chat-icon.png";

const SIZE_CLASS = {
  xs: "h-4 w-4",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  fab: "h-full w-full",
} as const;

export function AbraxosMark({
  size = "md",
  className = "",
  alt = "",
  variant = "chat",
}: {
  size?: keyof typeof SIZE_CLASS;
  className?: string;
  alt?: string;
  variant?: "chat" | "avatar";
}) {
  const src = variant === "chat" ? ABRAXOS_CHAT_ICON_SRC : ABRAXOS_AVATAR_SRC;

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      draggable={false}
      className={`rounded-full object-contain ${SIZE_CLASS[size]} ${className}`}
    />
  );
}
