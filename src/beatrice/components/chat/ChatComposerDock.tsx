import { ChatComposerCommands } from "./ChatComposerCommands";
import { ChatInput } from "./ChatInput";

export function ChatComposerDock() {
  return (
    <div className="beatrice-composer-dock">
      <div className="beatrice-composer-dock-fade pointer-events-none" aria-hidden />
      <div className="beatrice-composer-dock-inner mx-auto w-full max-w-[52rem]">
        <ChatComposerCommands />
        <ChatInput />
      </div>
    </div>
  );
}
