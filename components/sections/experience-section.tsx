"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, ChevronDown, Code2, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { timeline } from "@/lib/portfolio-data";

export function ExperienceSection() {
  const [openItem, setOpenItem] = useState("experience-0");

  return (
    <section id="experience" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Experience"
          title="Professional experience across web, mobile, SaaS, and AI."
          description="A career path from full-stack web foundations to enterprise mobile platforms, freelance product delivery, and production AI systems."
        />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-primary via-secondary to-accent md:left-8"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="space-y-10">
            {timeline.map((item, index) => (
              <Reveal key={`${item.company}-${item.period}`} delay={index * 0.08} direction="right">
                <div className="relative pl-12 md:pl-20">
                  <span className="absolute left-4 top-8 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-background bg-accent shadow-cyan-glow md:left-8" />
                  <div>
                    <Card className="relative overflow-hidden p-7">
                      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-secondary/20 blur-3xl" />
                      <div className="relative">
                        <button
                          type="button"
                          className="flex w-full flex-col gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-expanded={openItem === `experience-${index}`}
                          aria-controls={`experience-panel-${index}`}
                          onClick={() =>
                            setOpenItem((current) => (current === `experience-${index}` ? "" : `experience-${index}`))
                          }
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-sora text-2xl font-semibold">{item.role}</h3>
                              <p className="mt-2 text-primary">{item.company}</p>
                              {item.project ? (
                                <p className="mt-2 text-sm font-semibold text-foreground">Project: {item.project}</p>
                              ) : null}
                              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-accent" />
                                {item.location}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-muted-foreground light:border-slate-200 light:bg-slate-900/5">
                                <CalendarDays className="h-4 w-4 text-accent" />
                                {item.period}
                              </div>
                              <motion.span
                                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground light:border-slate-200 light:bg-slate-900/5"
                                animate={{ rotate: openItem === `experience-${index}` ? 180 : 0 }}
                                transition={{ duration: 0.25 }}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </motion.span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                              <Code2 className="h-4 w-4" />
                              Technologies
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item.technologies.slice(0, openItem === `experience-${index}` ? item.technologies.length : 6).map((technology) => (
                                <Badge key={technology} className="normal-case tracking-normal">
                                  {technology}
                                </Badge>
                              ))}
                              {openItem !== `experience-${index}` && item.technologies.length > 6 ? (
                                <Badge className="normal-case tracking-normal">+{item.technologies.length - 6} more</Badge>
                              ) : null}
                            </div>
                          </div>
                        </button>

                        {item.companyUrl || item.links?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.companyUrl ? (
                              <a
                                href={item.companyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground light:border-slate-200 light:bg-slate-900/5"
                              >
                                Company
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            ) : null}
                            {item.links?.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground light:border-slate-200 light:bg-slate-900/5"
                              >
                                {link.label}
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            ))}
                          </div>
                        ) : null}

                        <AnimatePresence initial={false}>
                          {openItem === `experience-${index}` ? (
                            <motion.div
                              id={`experience-panel-${index}`}
                              className="mt-7 grid gap-6 overflow-hidden"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <div>
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                                  Responsibilities
                                </h4>
                                <ul className="space-y-3">
                                  {item.responsibilities.map((responsibility) => (
                                    <li key={responsibility} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                      <span>{responsibility}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                                  <Sparkles className="h-5 w-5 shrink-0 text-accent" />
                                  Achievements
                                </h4>
                                <ul className="space-y-3">
                                  {item.achievements.map((achievement) => (
                                    <li key={achievement} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                                      <span>{achievement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </Card>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
