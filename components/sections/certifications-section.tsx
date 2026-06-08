"use client";

import { Award, ExternalLink, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { certifications } from "@/lib/portfolio-data";

export function CertificationsSection() {
  return (
    <section id="certifications" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Certifications"
          title="Verified engineering credentials."
          description="HackerRank certifications across frontend engineering, software engineering fundamentals, JavaScript, SQL, Node.js, algorithms, and problem solving."
        />

        <div className="mx-auto grid max-w-6xl gap-6">
          {certifications.map((certification, index) => (
            <Reveal key={certification.href} delay={index * 0.06}>
              <Card className="group overflow-hidden p-0">
                <div className="grid md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-white light:border-slate-200 md:border-b-0 md:border-r">
                    <Image
                      src={certification.imageUrl}
                      alt={`${certification.title} certificate`}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover object-center transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="flex flex-col justify-between p-6 md:p-8">
                    <div>
                      <div className="flex items-center gap-2 text-accent">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em]">{certification.provider}</span>
                      </div>
                      <h3 className="mt-4 font-sora text-2xl font-semibold text-foreground">{certification.title}</h3>
                      <p className="mt-3 text-sm font-semibold text-primary">{certification.category}</p>
                      <p className="mt-5 text-sm leading-7 text-muted-foreground">
                        Verified HackerRank credential awarded to Hector Rosales Ortiz.
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-200 light:text-amber-700">
                        <Award className="h-3.5 w-3.5" />
                        Verified certificate
                      </div>
                      <a
                        href={certification.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground light:border-slate-200 light:bg-white"
                        aria-label={`Verify ${certification.title}`}
                      >
                        Verify
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
