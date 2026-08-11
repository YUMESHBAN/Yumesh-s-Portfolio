"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";
type InquiryType = "job_opportunity" | "freelance_project" | "collaboration_other";

const inquiryPaths: Array<{ value: InquiryType; label: string; description: string; messagePlaceholder: string }> = [
  {
    value: "job_opportunity",
    label: "Job opportunity",
    description: "Share the role, team, and what you need help building.",
    messagePlaceholder: "Tell me about the role, team, product, and the next step.",
  },
  {
    value: "freelance_project",
    label: "Freelance / project",
    description: "Outline the product, problem, or build you have in mind.",
    messagePlaceholder: "Tell me about the product, goals, and the technical work you need.",
  },
  {
    value: "collaboration_other",
    label: "Collaboration / other",
    description: "For open source, technical ideas, or anything else.",
    messagePlaceholder: "Share the idea, relevant links, and how you would like to collaborate.",
  },
];

export function ContactForm() {
  const statusId = useId();
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType>("job_opportunity");
  const selectedPath = inquiryPaths.find((path) => path.value === inquiryType) ?? inquiryPaths[0];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setState("error");
        setMessage(payload.message || "Please check the form and try again.");
        return;
      }

      setState("success");
      setMessage(payload.message || "Thanks. Your message is ready for Yumesh.");
      form.reset();
      setInquiryType("job_opportunity");
    } catch {
      setState("error");
      setMessage("The message could not be sent right now. Please email me directly.");
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-describedby={message ? statusId : undefined} className="site-panel grid gap-4 p-5 sm:p-6">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="inquiryType" value={inquiryType} />

      <fieldset>
        <legend className="text-sm font-semibold text-white">What brings you here?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {inquiryPaths.map((path) => {
            const isSelected = path.value === inquiryType;

            return (
              <button
                key={path.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setInquiryType(path.value)}
                className={`rounded-md border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 ${
                  isSelected
                    ? "border-blue-400 bg-blue-400/10 text-white"
                    : "border-white/10 bg-white/[0.035] text-white/70 hover:border-white/25 hover:text-white"
                }`}
              >
                <span className="block text-sm font-semibold">{path.label}</span>
                <span className="mt-1 block text-xs leading-5 text-white/55">{path.description}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="grid gap-2 text-sm font-semibold text-white">
        Name
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className="rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 font-normal text-white outline-none transition placeholder:text-white/30 focus:border-blue-400 focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-blue-400/40"
          placeholder="Your name"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-white">
        Email
        <input
          name="email"
          type="email"
          required
          maxLength={120}
          autoComplete="email"
          className="rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 font-normal text-white outline-none transition placeholder:text-white/30 focus:border-blue-400 focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-blue-400/40"
          placeholder="you@example.com"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-white">
        Company or project <span className="font-normal text-white/50">(optional)</span>
        <input
          name="organizationOrProject"
          maxLength={120}
          className="rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 font-normal text-white outline-none transition placeholder:text-white/30 focus:border-blue-400 focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-blue-400/40"
          placeholder="Company, product, repository, or team"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-white">
        Subject
        <input
          name="subject"
          required
          minLength={4}
          maxLength={120}
          className="rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 font-normal text-white outline-none transition placeholder:text-white/30 focus:border-blue-400 focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-blue-400/40"
          placeholder="Project, job, collaboration..."
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-white">
        Message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={6}
          className="resize-y rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 font-normal text-white outline-none transition placeholder:text-white/30 focus:border-blue-400 focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-blue-400/40"
          placeholder={selectedPath.messagePlaceholder}
        />
      </label>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="site-button-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={17} />
        {state === "submitting" ? "Sending..." : "Send message"}
      </button>

      <p className="text-xs leading-5 text-white/60">
        By sending this form, you agree that your message can be used to respond to your inquiry. Read the{" "}
        <Link href="/privacy" className="site-link text-blue-200">Privacy Policy</Link>.
      </p>

      {message ? (
        <p
          id={statusId}
          role={state === "error" ? "alert" : "status"}
          aria-live="polite"
          className={state === "error" ? "text-sm font-semibold text-red-300" : "text-sm font-semibold text-blue-300"}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
