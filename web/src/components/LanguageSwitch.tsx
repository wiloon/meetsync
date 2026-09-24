"use client";

import { useLocale } from "@/i18n/LocaleContext";

export function LanguageSwitch() {
  const { locale, setLocale } = useLocale();

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    border: "none",
    background: active ? "#2f6f4f" : "none",
    color: active ? "#fff" : "#aaa",
    padding: "6px 14px",
    borderRadius: 16,
    fontSize: 13,
    cursor: "pointer",
  });

  return (
    <div
      style={{
        background: "#222",
        borderRadius: 20,
        padding: 4,
        display: "flex",
        gap: 2,
      }}
    >
      <button
        type="button"
        style={buttonStyle(locale === "en")}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        style={buttonStyle(locale === "zh")}
        onClick={() => setLocale("zh")}
      >
        中文
      </button>
    </div>
  );
}
