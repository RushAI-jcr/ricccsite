"use client";

import { useState, type FormEvent } from "react";

const PARTNERSHIP_TRACKS = [
  "Academic Research Partnership",
  "Industry Collaboration",
  "Press / Media / Podcasts / Webinars Inquiry",
  "Fellowship / Trainee Program",
  "Clinical Site Collaboration",
] as const;

type Track = (typeof PARTNERSHIP_TRACKS)[number];

interface FormState {
  name: string;
  email: string;
  track: Track;
  proposal: string;
}

export function InquiryForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    track: PARTNERSHIP_TRACKS[0],
    proposal: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setErrorMsg("Network error. Please try again or email us directly.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-2xl font-bold text-rush-dark-green">Inquiry sent</p>
        <p className="text-rush-on-surface-variant">
          We will respond within three to five business days.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-rush-surface-container-high border-none focus:ring-2 focus:ring-rush-teal rounded-sm p-4 text-rush-on-surface placeholder:text-rush-on-surface-variant/50 transition-all outline-none";

  const labelClass =
    "font-mono text-[0.7rem] uppercase tracking-widest text-rush-on-surface-variant block mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Collaboration inquiry form">
      {/* Honeypot — hidden from humans, bots fill it in */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="inquiry-website">Website</label>
        <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="inquiry-name" className={labelClass}>
            Full Name
          </label>
          <input
            id="inquiry-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Dr. Jane Smith"
            maxLength={200}
            className={inputClass}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="inquiry-email" className={labelClass}>
            Institutional Email
          </label>
          <input
            id="inquiry-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="jsmith@university.edu"
            maxLength={254}
            className={inputClass}
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="inquiry-track" className={labelClass}>
          Partnership Track
        </label>
        <select
          id="inquiry-track"
          name="track"
          value={form.track}
          onChange={handleChange}
          className={inputClass}
        >
          {PARTNERSHIP_TRACKS.map((track) => (
            <option key={track} value={track}>
              {track}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="inquiry-proposal" className={labelClass}>
          Proposal Overview
        </label>
        <textarea
          id="inquiry-proposal"
          name="proposal"
          required
          value={form.proposal}
          onChange={handleChange}
          rows={5}
          placeholder="Briefly describe the clinical or research goal..."
          maxLength={2000}
          className={inputClass}
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-rush-dark-green text-white py-4 rounded-sm font-bold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Submit Inquiry"}
      </button>

      <p className="text-[0.7rem] font-mono text-center text-rush-on-surface-variant uppercase tracking-widest">
        Typical response time: three to five business days
      </p>
    </form>
  );
}
