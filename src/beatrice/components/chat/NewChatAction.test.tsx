import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import {
  useWorkspaceComposer,
  useWorkspaceHistory,
} from "../../providers/WorkspaceProvider";
import { NewChatAction } from "./NewChatAction";

vi.mock("../../hooks/usePersonaContext", () => ({
  usePersonaContext: vi.fn(),
}));

vi.mock("../../providers/WorkspaceProvider", () => ({
  useWorkspaceComposer: vi.fn(),
  useWorkspaceHistory: vi.fn(),
}));

describe("NewChatAction", () => {
  const startNewConversation = vi.fn();
  const setProfileId = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.setItem("aetheris.locale", "pt-BR");
    vi.mocked(usePersonaContext).mockReturnValue({
      activePersonaContext: {
        label: "Product Designer",
        theme: {
          accentBg: "bg-primary/10",
          accentBorder: "border-primary/20",
          accentText: "text-primary",
          panel: "border-white/10 bg-surface-container-high",
          signal: "bg-primary",
        },
      },
      setProfileId,
    } as unknown as ReturnType<typeof usePersonaContext>);
    vi.mocked(useWorkspaceComposer).mockReturnValue({
      isLoading: false,
    } as unknown as ReturnType<typeof useWorkspaceComposer>);
    vi.mocked(useWorkspaceHistory).mockReturnValue({
      activeConversation: {
        history: [{ role: "user", content: "Conversa atual" }],
      },
      startNewConversation,
    } as unknown as ReturnType<typeof useWorkspaceHistory>);
  });

  it("asks for confirmation and cancel keeps the current conversation", async () => {
    render(
      <I18nProvider>
        <NewChatAction />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Novo chat" }));

    expect(screen.getByRole("alertdialog")).toBeTruthy();
    expect(screen.getByText("Tem certeza que deseja iniciar um novo chat? A conversa atual será removida da tela.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(startNewConversation).not.toHaveBeenCalled();
  });

  it("starts a clean conversation after confirmation without changing perspective", async () => {
    render(
      <I18nProvider>
        <NewChatAction />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Novo chat" }));
    fireEvent.click(screen.getByRole("button", { name: "Iniciar novo chat" }));

    expect(startNewConversation).toHaveBeenCalledTimes(1);
    expect(setProfileId).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("starts immediately when the current chat is empty", () => {
    vi.mocked(useWorkspaceHistory).mockReturnValue({
      activeConversation: { history: [] },
      startNewConversation,
    } as unknown as ReturnType<typeof useWorkspaceHistory>);

    render(
      <I18nProvider>
        <NewChatAction />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Novo chat" }));

    expect(startNewConversation).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("disables the action while a response is streaming", () => {
    vi.mocked(useWorkspaceComposer).mockReturnValue({
      isLoading: true,
    } as unknown as ReturnType<typeof useWorkspaceComposer>);

    render(
      <I18nProvider>
        <NewChatAction />
      </I18nProvider>,
    );

    const button = screen.getByRole("button", { name: "Novo chat" });
    expect(button.hasAttribute("disabled")).toBe(true);

    fireEvent.click(button);
    expect(startNewConversation).not.toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("closes the confirmation with Escape", async () => {
    render(
      <I18nProvider>
        <NewChatAction />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Novo chat" }));
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(startNewConversation).not.toHaveBeenCalled();
  });
});
