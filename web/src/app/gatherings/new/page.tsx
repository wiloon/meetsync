"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import { quickTopics } from "@/i18n/quickTopics";
import { DateRangeCalendar } from "@/components/DateRangeCalendar";
import { TimezoneField } from "@/components/TimezoneField";
import { createGathering, type Gathering } from "@/lib/api";

export default function NewGatheringPage() {
  const { locale, t } = useLocale();

  const [title, setTitle] = useState("");
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [timezone, setTimezone] = useState("UTC");
  const [topics, setTopics] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Gathering | null>(null);
  const [copied, setCopied] = useState(false);

  const availableChips = quickTopics[locale].filter((name) => !topics.includes(name));

  function addTopicRow(prefill: string) {
    setTopics((prev) => [...prev, prefill]);
  }

  function updateTopicRow(index: number, value: string) {
    setTopics((prev) => prev.map((t, i) => (i === index ? value : t)));
  }

  function removeTopicRow(index: number) {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const gathering = await createGathering({
        title: title.trim(),
        dates: Array.from(selectedDates).sort(),
        timezone,
        topics: topics.map((name) => name.trim()).filter(Boolean),
      });
      setCreated(gathering);
    } catch {
      setError(t("create.genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    const shareLink =
      typeof window !== "undefined"
        ? `${window.location.origin}/g/${created.slug}`
        : `/g/${created.slug}`;

    function copyLink() {
      navigator.clipboard.writeText(shareLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }

    return (
      <main style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 560 }}>
        <h1>{created.title}</h1>
        <p>
          {created.topics.length === 0
            ? t("done.subNone")
            : created.topics.length === 1
              ? t("done.subWithOne", { list: created.topics.join("、") })
              : t("done.subWithMany", {
                  n: created.topics.length,
                  list: created.topics.join("、"),
                })}
        </p>

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginTop: 18 }}>
          {t("done.shareLinkLabel")}
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input
            type="text"
            readOnly
            value={shareLink}
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid #d8d4c8",
              borderRadius: 8,
              fontSize: 14,
              background: "#f4f3ee",
              color: "#7a7a6e",
            }}
          />
          <button
            type="button"
            onClick={copyLink}
            style={{
              background: "none",
              color: "#2f6f4f",
              border: "1.5px solid #2f6f4f",
              borderRadius: 9,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? t("done.copied") : t("done.copy")}
          </button>
        </div>

        <p style={{ color: "#7a7a6e", fontSize: 12, marginTop: 12 }}>{t("done.nextHint")}</p>

        <Link href="/" style={{ display: "inline-block", marginTop: 20, color: "#2f6f4f" }}>
          {t("done.backHome")}
        </Link>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 620 }}>
      <h1>{t("create.title")}</h1>
      <p style={{ color: "#7a7a6e" }}>{t("create.subtitle")}</p>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          {t("create.nameLabel")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("create.namePlaceholder")}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d8d4c8",
            borderRadius: 8,
            fontSize: 14,
          }}
        />

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginTop: 18, marginBottom: 6 }}>
          {t("create.dateSectionLabel")}
        </label>
        <p style={{ color: "#7a7a6e", fontSize: 12, marginTop: -4, marginBottom: 10 }}>
          {t("create.dateHint")}
        </p>
        <DateRangeCalendar selectedDates={selectedDates} onChange={setSelectedDates} />

        <div style={{ marginTop: 18 }}>
          <TimezoneField value={timezone} onChange={setTimezone} />
        </div>

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginTop: 18, marginBottom: 6 }}>
          {t("create.topicsLabel")}{" "}
          <span style={{ fontWeight: 400, color: "#7a7a6e" }}>{t("create.topicsOptional")}</span>
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "10px 0 4px" }}>
          {availableChips.map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => addTopicRow(name)}
              style={{
                background: "#eaf3ee",
                color: "#2f6f4f",
                border: "1px solid #cfe4d7",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              + {name}
            </button>
          ))}
        </div>
        {topics.map((value, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input
              type="text"
              value={value}
              placeholder={t("create.topicPlaceholder")}
              onChange={(e) => updateTopicRow(i, e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #d8d4c8",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
            <button
              type="button"
              onClick={() => removeTopicRow(i)}
              style={{ background: "none", border: "none", color: "#a44", fontSize: 18, cursor: "pointer" }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addTopicRow("")}
          style={{
            background: "none",
            color: "#2f6f4f",
            border: "1.5px solid #2f6f4f",
            borderRadius: 9,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            marginTop: 6,
          }}
        >
          {t("create.addCustomTopic")}
        </button>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting || selectedDates.size === 0}
          style={{
            display: "block",
            background: "#2f6f4f",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "12px 22px",
            fontSize: 15,
            fontWeight: 600,
            cursor: submitting || selectedDates.size === 0 ? "default" : "pointer",
            opacity: submitting || selectedDates.size === 0 ? 0.6 : 1,
            width: "100%",
            marginTop: 28,
          }}
        >
          {submitting ? t("create.submitting") : t("create.submit")}
        </button>
      </form>
    </main>
  );
}
