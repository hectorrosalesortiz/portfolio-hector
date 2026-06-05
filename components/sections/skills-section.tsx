"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { skillCategories } from "@/lib/portfolio-data";

export function SkillsSection() {
  return (
    <section id="skills" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Skills"
          title="A modern stack for AI-powered digital products."
          description="Deep product engineering across LLM systems, frontend craft, backend services, mobile platforms, and cloud operations."
        />

        <div className="grid gap-5 lg:grid-cols-6">
          {skillCategories.map((category, index) => (
            <Reveal
              key={category.title}
              delay={index * 0.06}
              className={index < 2 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <Card className="group relative h-full overflow-hidden p-6">
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-accent/20" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-accent ring-1 ring-white/10 light:bg-slate-900/5">
                        <category.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 font-sora text-2xl font-semibold">{category.title}</h3>
                    </div>
                    <span className="font-space text-3xl font-bold text-primary">{category.level}%</span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{category.description}</p>

                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10 light:bg-slate-200">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${category.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge key={skill} className="normal-case tracking-normal">
                        {skill}
                      </Badge>
                    ))}
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
