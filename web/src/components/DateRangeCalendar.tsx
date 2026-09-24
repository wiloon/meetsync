"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { calendarText } from "@/i18n/calendar";
import { applyDateRange, groupRuns, isoDate, parseIsoDate } from "@/lib/dateSet";

const MAX_MONTH_OFFSET = 10;

type Props = {
  selectedDates: Set<string>;
  onChange: (next: Set<string>) => void;
};

export function DateRangeCalendar({ selectedDates, onChange }: Props) {
  const { locale, t } = useLocale();
  const cal = calendarText[locale];
  const [monthOffset, setMonthOffset] = useState(0);
  const draggingRef = useRef<{ startIso: string; add: boolean } | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const left = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const right = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 1);

  function handlePointerDown(iso: string) {
    const add = !selectedDates.has(iso);
    draggingRef.current = { startIso: iso, add };
    onChange(applyDateRange(selectedDates, iso, iso, add));
  }

  function handlePointerEnter(iso: string) {
    const drag = draggingRef.current;
    if (!drag) return;
    onChange(applyDateRange(selectedDates, drag.startIso, iso, drag.add));
  }

  function handlePointerUp() {
    draggingRef.current = null;
  }

  function renderMonth(year: number, month: number) {
    const startWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: (number | null)[][] = [];
    let day = 1 - startWeekday;
    while (day <= daysInMonth) {
      const week: (number | null)[] = [];
      for (let col = 0; col < 7; col++, day++) {
        week.push(day >= 1 && day <= daysInMonth ? day : null);
      }
      weeks.push(week);
    }

    return (
      <div key={`${year}-${month}`} style={{ flex: 1, minWidth: 220 }}>
        <h3
          style={{
            fontSize: 13,
            textAlign: "center",
            margin: "0 0 8px",
            fontWeight: 600,
          }}
        >
          {cal.monthsLong[month]} {year}
        </h3>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {cal.weekdays.map((w, i) => (
                <th
                  key={i}
                  style={{
                    fontSize: 10,
                    color: "#7a7a6e",
                    fontWeight: 600,
                    padding: "3px 0",
                  }}
                >
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => {
                  if (day === null) return <td key={di} />;
                  const iso = isoDate(year, month, day);
                  const cellDate = new Date(year, month, day);
                  const isPast = cellDate < today;
                  const isToday = cellDate.getTime() === today.getTime();
                  const isSelected = selectedDates.has(iso);
                  return (
                    <td key={di} style={{ textAlign: "center", padding: 0 }}>
                      <div
                        onMouseDown={() => !isPast && handlePointerDown(iso)}
                        onMouseEnter={() => handlePointerEnter(iso)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
                          margin: "1px auto",
                          borderRadius: 7,
                          fontSize: 12,
                          userSelect: "none",
                          cursor: isPast ? "default" : "pointer",
                          color: isPast ? "#ccc9bd" : isSelected ? "#fff" : "inherit",
                          background: isSelected ? "#2f6f4f" : "transparent",
                          fontWeight: isSelected ? 700 : 400,
                          border: isToday
                            ? "1.5px solid #2f6f4f"
                            : "1.5px solid transparent",
                        }}
                      >
                        {day}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const sorted = Array.from(selectedDates).sort();
  const runs = groupRuns(sorted);

  return (
    <div onMouseUp={handlePointerUp} onMouseLeave={handlePointerUp}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
          disabled={monthOffset === 0}
          style={navButtonStyle(monthOffset === 0)}
        >
          ‹
        </button>
        <span style={{ fontSize: 12, color: "#7a7a6e" }}>
          {cal.formatRange(
            left.getFullYear(),
            left.getMonth(),
            right.getFullYear(),
            right.getMonth(),
          )}
        </span>
        <button
          type="button"
          onClick={() => setMonthOffset((o) => Math.min(MAX_MONTH_OFFSET, o + 1))}
          disabled={monthOffset === MAX_MONTH_OFFSET}
          style={navButtonStyle(monthOffset === MAX_MONTH_OFFSET)}
        >
          ›
        </button>
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {renderMonth(left.getFullYear(), left.getMonth())}
        {renderMonth(right.getFullYear(), right.getMonth())}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 12,
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {sorted.length === 0 && (
          <span style={{ color: "#7a7a6e", fontStyle: "italic" }}>
            {t("create.noDatesSelected")}
          </span>
        )}
        {runs.map((run) => {
          const start = parseIsoDate(run[0]);
          const end = parseIsoDate(run[run.length - 1]);
          const label =
            run.length === 1
              ? cal.formatChipDate(start.year, start.month, start.day)
              : `${cal.formatChipDate(start.year, start.month, start.day)} – ${cal.formatChipDate(end.year, end.month, end.day)}`;
          return (
            <span
              key={run[0]}
              style={{
                background: "#eaf3ee",
                color: "#2f6f4f",
                border: "1px solid #cfe4d7",
                borderRadius: 20,
                padding: "4px 10px",
              }}
            >
              {label}
              <button
                type="button"
                onClick={() =>
                  onChange(applyDateRange(selectedDates, run[0], run[run.length - 1], false))
                }
                style={{
                  marginLeft: 6,
                  border: "none",
                  background: "none",
                  color: "#a44",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function navButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    background: "#fff",
    border: "1px solid #cfcbbf",
    color: disabled ? "#ccc9bd" : "#2f6f4f",
    borderRadius: 6,
    width: 28,
    height: 28,
    fontSize: 14,
    cursor: disabled ? "default" : "pointer",
  };
}
