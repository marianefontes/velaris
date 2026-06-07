import { useCallback, useEffect, useState } from "react";
import type { BeatriceSettings } from "../types/beatrice";
import {
  defaultBeatriceSettings,
  readBeatriceSettings,
  writeBeatriceSettings,
} from "../storage/beatriceStorage";

export function useBeatriceSettings() {
  const [settings, setSettings] = useState<BeatriceSettings>(() => readBeatriceSettings());

  useEffect(() => {
    writeBeatriceSettings(settings);
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<BeatriceSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultBeatriceSettings);
  }, []);

  return {
    settings,
    resetSettings,
    updateSettings,
  };
}
