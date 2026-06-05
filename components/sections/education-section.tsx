"use client";

import { Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
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
          title="Academic Foundation."
          description="Formal computer systems training paired with a decade of production software delivery."
        />

        <Reveal>
          <Card className="mx-auto max-w-4xl overflow-hidden p-0">
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <div className="relative min-h-72 overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/25 to-accent/20">
                <motion.div
                  className="absolute -inset-4"
                  animate={{ scale: [1, 1.06, 1], x: [0, -10, 0], y: [0, 8, 0] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/assets/ipn-campus.png"
                    alt="Instituto Politecnico Nacional campus"
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover object-center"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-background/5 to-transparent" />
              </div>

              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 text-accent">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.22em]">{education.period}</span>
                </div>
                <h3 className="mt-5 font-sora text-3xl font-semibold">{education.institution}</h3>
                <a
                  href={education.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-accent"
                >
                  Official university website
                  <ExternalLink className="h-4 w-4" />
                </a>
                <div className="mt-8 space-y-3">
                  <p className="text-xl font-semibold text-foreground">{education.degree}</p>
                  <p className="text-lg leading-7 text-muted-foreground">{education.field}</p>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
