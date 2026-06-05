"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { timeline } from "@/lib/portfolio-data";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Experience"
          title="A decade of enterprise, mobile, SaaS, and AI delivery."
          description="A career path across high-scale consumer platforms, cloud-native SaaS, banking systems, and modern enterprise AI products."
        />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-primary via-secondary to-accent md:left-1/2"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="space-y-10">
            {timeline.map((item, index) => (
              <Reveal key={item.company} delay={index * 0.08} direction={index % 2 === 0 ? "right" : "left"}>
                <div className="relative grid gap-8 pl-12 md:grid-cols-2 md:pl-0">
                  <span className="absolute left-4 top-8 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-background bg-accent shadow-cyan-glow md:left-1/2" />
                  <div className={index % 2 === 0 ? "md:pr-12" : "md:col-start-2 md:pl-12"}>
                    <Card className="relative overflow-hidden p-7">
                      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-secondary/20 blur-3xl" />
                      <div className="relative">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-sora text-2xl font-semibold">{item.company}</h3>
                            <p className="mt-2 text-primary">{item.role}</p>
                          </div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-muted-foreground light:border-slate-200 light:bg-slate-900/5">
                            <CalendarDays className="h-4 w-4 text-accent" />
                            {item.period}
                          </div>
                        </div>
                        <ul className="mt-6 space-y-3">
                          {item.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
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
