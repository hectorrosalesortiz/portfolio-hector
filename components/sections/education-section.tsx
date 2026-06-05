"use client";

import { Award, Network } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { education } from "@/lib/portfolio-data";

export function EducationSection() {
  return (
    <section id="education" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Education"
          title="Computer systems foundation with enterprise engineering depth."
          description="Formal systems training paired with a decade of production software delivery across AI, web, mobile, and cloud platforms."
        />

        <Reveal>
          <Card className="mx-auto max-w-4xl overflow-hidden p-0">
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <div className="relative grid min-h-72 place-items-center overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/25 to-accent/20 p-10">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:220%_220%] animate-shimmer" />
                <div className="relative grid h-32 w-32 place-items-center rounded-[2rem] border border-white/20 bg-background/40 text-white backdrop-blur-xl">
                  <education.icon className="h-14 w-14" />
                </div>
              </div>

              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 text-accent">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.22em]">{education.period}</span>
                </div>
                <h3 className="mt-5 font-sora text-3xl font-semibold">{education.institution}</h3>
                <p className="mt-2 text-lg text-primary">{education.campus}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 light:border-slate-200 light:bg-slate-900/5">
                    <p className="text-sm text-muted-foreground">Degree</p>
                    <p className="mt-2 font-semibold">{education.degree}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 light:border-slate-200 light:bg-slate-900/5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Network className="h-4 w-4" />
                      Field
                    </div>
                    <p className="mt-2 font-semibold">{education.field}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
