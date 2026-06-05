"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, TextareaField } from "@/components/ui/field";
import { contactMethods } from "@/lib/portfolio-data";

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof ContactForm, string>>;

const initialForm: ContactForm = {
  name: "",
  email: "",
  message: "",
};

export function ContactSection() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || "a potential client"}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`);
    return `mailto:mern2025@outlook.com?subject=${subject}&body=${body}`;
  }, [form.email, form.message, form.name]);

  function validate() {
    const nextErrors: FormErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = "Please enter your name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email.";
    }
    if (form.message.trim().length < 12) {
      nextErrors.message = "Please share a few details about your project.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setSent(true);
    window.location.href = mailtoHref;
  }

  return (
    <section id="contact" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Contact"
          title="Let’s build an AI-powered product that feels exceptional."
          description="Available for senior engineering, AI product architecture, full stack delivery, and enterprise platform initiatives."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal direction="right">
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.label}
                  href={method.href}
                  target={method.href?.startsWith("http") ? "_blank" : undefined}
                  rel={method.href?.startsWith("http") ? "noreferrer" : undefined}
                  className="glass-panel flex items-center gap-4 rounded-3xl p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.55 }}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <method.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted-foreground">{method.label}</span>
                    <span className="block font-semibold">{method.value}</span>
                  </span>
                </motion.a>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <Card className="p-7 md:p-8">
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <InputField
                  label="Your name"
                  name="name"
                  value={form.name}
                  error={errors.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
                <InputField
                  label="Email address"
                  name="email"
                  type="email"
                  value={form.email}
                  error={errors.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
                <TextareaField
                  label="Project details"
                  name="message"
                  value={form.message}
                  error={errors.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                />
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Button type="submit" size="lg">
                    Send Message
                    <Send className="h-5 w-5" />
                  </Button>
                  {sent ? <span className="text-sm text-accent">Opening your email client...</span> : null}
                </div>
              </form>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
