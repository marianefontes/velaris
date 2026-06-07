import { useWorkspace } from "../../providers/WorkspaceProvider";
import { ChatMessage } from "./ChatMessage";

export function ChatStream() {
  const { bottomRef, content, messages, settings } = useWorkspace();

  return (
    <div className="flex flex-col gap-6 pt-2">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} content={content} settings={settings} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

