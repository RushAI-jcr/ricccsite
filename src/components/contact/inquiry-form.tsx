"use client";

import { useState, type FormEvent } from "react";

const PARTNERSHIP_TRACKS = [
  "Academic Research Partnership",
  "Industry Collaboration",
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

const LAB_EMAIL = "info@riccc-lab.com";

export function InquiryForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    track: PARTNERSHIP_TRACKS[0],
    proposal: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const subject = encodeURIComponent(`RICCC Collaboration Inquiry - ${form.track}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPartnership Track: ${form.track}\n\nProposal Overview:\n${form.proposal}`
    );

    window.location.href = `mailto:${LAB_EMAIL}?subject=${subject}&body=${body}`;
  }

  const inputClass =
    "w-full bg-rush-surface-container-high border-none focus:ring-2 focus:ring-rush-teal rounded-sm p-4 text-rush-on-surface placeholder:text-rush-on-surface-variant/50 transition-all outline-none";

  const labelClass =
    "font-mono text-[0.7rem] uppercase tracking-widest text-rush-on-surface-variant block mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Collaboration inquiry form">
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

      <button
        type="submit"
        className="w-full bg-rush-dark-green text-white py-4 rounded-sm font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
      >
        Submit Inquiry
      </button>

      <p className="text-[0.7rem] font-mono text-center text-rush-on-surface-variant uppercase tracking-widest">
        Typical response time: three to five business days
      </p>
    </form>
  );
}
