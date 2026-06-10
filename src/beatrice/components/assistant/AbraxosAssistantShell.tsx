import { useRef } from "react";
import { AbraxosFloatingButton } from "./AbraxosFloatingButton";
import { AbraxosMiniChat } from "./AbraxosMiniChat";

export function AbraxosAssistantShell() {
  const fabRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <AbraxosMiniChat fabRef={fabRef} />
      <AbraxosFloatingButton ref={fabRef} />
    </>
  );
}
