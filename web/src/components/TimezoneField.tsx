"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

const FALLBACK_ZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function listTimezones(): string[] {
  const intlWithZones = Intl as unknown as {
    supportedValuesOf?: (key: string) => string[];
  };
  if (typeof intlWithZones.supportedValuesOf === "function") {
    try {
      return intlWithZones.supportedValuesOf("timeZone");
    } catch {
      // fall through to the fallback list
    }
  }
  return FALLBACK_ZONES;
}

type Props = {
  value: string;
  onChange: (timezone: string) => void;
};

export function TimezoneField({ value, onChange }: Props) {
  const { t } = useLocale();
  const [zones, setZones] = useState<string[]>(FALLBACK_ZONES);

  useEffect(() => {
    // Intl's resolved timezone is only knowable in the browser — this
    // one-time correction after mount is the only place it can happen.
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const all = listTimezones();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setZones(all.includes(detected) ? all : [detected, ...all]);
    onChange(detected);
    // Runs once on mount to auto-detect; onChange is a setState-style setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {t("create.timezoneLabel")}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "6px 8px",
          borderRadius: 6,
          border: "1px solid #cfcbbf",
          fontSize: 13,
        }}
      >
        {zones.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </select>
      <p style={{ color: "#7a7a6e", fontSize: 12, marginTop: 6 }}>
        {t("create.timezoneHint")}
      </p>
    </div>
  );
}
