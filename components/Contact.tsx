"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side validation (server is source of truth)
  const validateForm = (): boolean => {
    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();
    const messageTrimmed = message.trim();

    if (nameTrimmed.length < 1 || nameTrimmed.length > 80) {
      setError("Please enter a valid name");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed) || emailTrimmed.length > 254) {
      setError("Please enter a valid email address");
      return false;
    }

    if (messageTrimmed.length < 10 || messageTrimmed.length > 2000) {
      setError("Message must be between 10 and 2000 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website: website, // Honeypot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send message. Please try again.");
        return;
      }

      // Success
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 md:px-0 bg-paper">
      <div className="max-w-[560px] mx-auto w-full">
        <h2 className="text-4xl font-medium text-text-ink mb-4 text-center tracking-tight">
          Got a project in mind?
        </h2>
        <p className="text-lg text-text-subtle mb-12 text-center">
          Tell us what you're working on and we'll get back to you within a day.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-text-ink mb-2"
              >
                Name
              </label>
              <Input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-text-ink mb-2"
              >
                Email
              </label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-text-ink mb-2"
            >
              What are you working on?
            </label>
            <TextArea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your brand, your products, and what kind of imagery you're after..."
              required
              disabled={loading}
              rows={6}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-800">
                Message sent! We'll get back to you soon.
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-xl bg-text-ink text-white font-medium hover:bg-text-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-text-ink"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
