import { useMemo } from "react";
import { useAppSettings } from "@/providers/AppSettingsProvider";

export const useCurrency = () => {
  const { settings } = useAppSettings();
  const { code, symbol, position, locale } = settings.currency;

  const formatter = useMemo(() => {
    // Use code for robust formatting; show symbol configured in UI for display.
    try {
      return new Intl.NumberFormat(locale || "en-AE", {
        style: "currency",
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      return new Intl.NumberFormat(locale || "en-AE", {
        style: "currency",
        currency: "AED",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }, [code, locale]);

  const format = (amount: number) => {
    // Respect custom symbol/position if set, else use formatter output.
    const standard = formatter.format(amount);
    if (!symbol) return standard;
    const numeric = amount.toFixed(2);
    if (position === "suffix") return `${numeric} ${symbol}`;
    return `${symbol} ${numeric}`;
  };

  return {
    format,
    symbol,
    code,
    position,
  };
};