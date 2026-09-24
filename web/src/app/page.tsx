"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type HealthResponse = {
  status: string;
  time: string;
};

export default function Home() {
  const { t } = useLocale();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`API responded with ${res.status}`);
        return res.json();
      })
      .then(setHealth)
      .catch((err) => setError(String(err)));
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>meetsync</h1>
      <p>{t("home.tagline")}</p>
      <Link
        href="/gatherings/new"
        style={{
          display: "inline-block",
          background: "#2f6f4f",
          color: "#fff",
          borderRadius: 9,
          padding: "10px 18px",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          marginBottom: "1.5rem",
        }}
      >
        {t("nav.createGathering")}
      </Link>
      <p>Project skeleton — this page calls the Go API&apos;s live health endpoint.</p>
      {error && <p style={{ color: "crimson" }}>Error reaching API: {error}</p>}
      {!error && !health && <p>Loading…</p>}
      {health && (
        <ul>
          <li>status: {health.status}</li>
          <li>server time: {health.time}</li>
        </ul>
      )}
    </main>
  );
}
