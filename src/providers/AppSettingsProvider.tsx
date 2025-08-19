import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CurrencySettings = {
  code: string;
  symbol: string;
  position: "prefix" | "suffix";
  locale?: string;
};

export type AppSettings = {
  pharmacyName: string;
  location: string;
  logoUrl?: string;
  currency: CurrencySettings;
};

type AppSettingsContextType = {
  settings: AppSettings;
  setSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
};

const DEFAULT_SETTINGS: AppSettings = {
  pharmacyName: "Al Kindi Pharmacy",
  location: "Sharjah",
  logoUrl: "",
  currency: {
    code: "AED",
    symbol: "AED",
    position: "prefix",
    locale: "en-AE",
  },
};

const STORAGE_KEY = "app_settings";

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppSettings;
        setSettingsState({ ...DEFAULT_SETTINGS, ...parsed, currency: { ...DEFAULT_SETTINGS.currency, ...(parsed as any).currency } });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const setSettings = (updater: (prev: AppSettings) => AppSettings) => {
    setSettingsState((prev) => updater(prev));
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...partial, currency: { ...prev.currency, ...(partial.currency || {}) } }));
  };

  const value = useMemo(() => ({ settings, setSettings, updateSettings }), [settings]);

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
};

export const useAppSettings = () => {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    if (typeof window !== "undefined" && !(window as any).__APP_SETTINGS_WARNED__) {
      (window as any).__APP_SETTINGS_WARNED__ = true;
      console.warn("AppSettingsProvider not found; using default settings fallback.");
    }
    const noop = () => {};
    return {
      settings: DEFAULT_SETTINGS,
      setSettings: noop,
      updateSettings: noop,
    };
  }
  return ctx;
};