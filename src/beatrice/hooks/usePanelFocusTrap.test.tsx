import { fireEvent, render } from "@testing-library/react";
import { useRef } from "react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { usePanelFocusTrap } from "./usePanelFocusTrap";

function FocusTrap({
  children,
  label,
  onClose,
}: {
  children?: ReactNode;
  label: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  usePanelFocusTrap(true, ref, onClose);

  return (
    <section ref={ref} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>
      <button type="button">{label}</button>
      {children}
    </section>
  );
}

describe("usePanelFocusTrap", () => {
  it("lets only the topmost modal handle Escape", () => {
    const closePanel = vi.fn();
    const closeConfirmation = vi.fn();

    render(
      <FocusTrap label="Histórico" onClose={closePanel}>
        <FocusTrap label="Confirmação" onClose={closeConfirmation} />
      </FocusTrap>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(closeConfirmation).toHaveBeenCalledTimes(1);
    expect(closePanel).not.toHaveBeenCalled();
  });
});
