// presenceBus — tiny event channel between interface surfaces and the global
// presence layer. Lets the search bar (or any surface) ask the ambient field
// to react without prop-drilling through AppShell.

export interface ConvergeDetail {
  x: number;
  y: number;
}

type PresenceEvents = {
  converge: ConvergeDetail;
  silhouette: undefined;
};

type Listener<K extends keyof PresenceEvents> = (detail: PresenceEvents[K]) => void;

const listeners: { [K in keyof PresenceEvents]: Set<Listener<K>> } = {
  converge: new Set(),
  silhouette: new Set(),
};

export function onPresence<K extends keyof PresenceEvents>(event: K, listener: Listener<K>) {
  listeners[event].add(listener);
  return () => {
    listeners[event].delete(listener);
  };
}

export function emitPresence<K extends keyof PresenceEvents>(event: K, detail: PresenceEvents[K]) {
  listeners[event].forEach((listener) => listener(detail));
}
