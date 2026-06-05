"use client";

import { motion } from "framer-motion";
import { capabilities } from "@/lib/portfolio-data";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card } from "@/components/ui/card";

const storyPoints = [
  "Senior engineer with 10+ years building web, mobile, AI, and cloud systems for high-growth and enterprise teams.",
  "Specialized in translating complex business goals into scalable architectures, premium interfaces, and reliable delivery plans.",
  "Focused on AI assistants, retrieval augmented generation, production integrations, and developer platforms that improve real workflows.",
];

export function AboutSection() {
  return (
    <section id="about" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="About Me"
          title="A product-minded engineer for AI-era platforms."
          description="I combine deep full stack delivery with AI architecture, cloud systems, and technical leadership for teams that need polished products and durable engineering."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal direction="right">
            <Card className="relative overflow-hidden p-8">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative mx-auto grid aspect-square max-w-sm place-items-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 p-8 light:border-slate-200">
                <div className="grid h-full w-full place-items-center rounded-[1.5rem] border border-white/20 bg-background/40 text-center backdrop-blur-xl">
                  <div>
                    <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent font-space text-3xl font-black text-white shadow-glow">
                      HR
                    </div>
                    <p className="mt-6 font-sora text-2xl font-semibold">Profile Photo</p>
                    <p className="mt-2 text-sm text-muted-foreground">Premium placeholder ready for a portrait.</p>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>

          <div className="space-y-6">
            <Reveal>
              <Card className="p-8">
                <h3 className="font-sora text-2xl font-semibold">Engineering leadership with product taste.</h3>
                <div className="mt-6 space-y-4">
                  {storyPoints.map((point) => (
                    <p key={point} className="leading-8 text-muted-foreground">
                      {point}
                    </p>
                  ))}
                </div>
              </Card>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08}>
                  <Card className="group h-full p-5">
                    <motion.div
                      className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"
                      whileHover={{ rotate: 8, scale: 1.06 }}
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.div>
                    <h4 className="font-sora text-lg font-semibold">{item.title}</h4>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="mt-12">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-secondary to-accent sm:left-1/2" />
            {["Discovery", "Architecture", "Delivery", "Optimization"].map((item, index) => (
              <div key={item} className="relative mb-8 grid gap-6 sm:grid-cols-2">
                <div className={index % 2 === 0 ? "sm:text-right" : "sm:col-start-2"}>
                  <Card className="rounded-3xl p-5">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">0{index + 1}</span>
                    <h4 className="mt-2 font-sora text-xl font-semibold">{item}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {index === 0 && "Clarify outcomes, users, constraints, and the business value behind the work."}
                      {index === 1 && "Design scalable foundations across UI, API, data, AI, and cloud infrastructure."}
                      {index === 2 && "Ship maintainable products with strong code quality and high-performance UX."}
                      {index === 3 && "Measure, refine, automate, and improve reliability after launch."}
                    </p>
                  </Card>
                </div>
                <span className="absolute left-4 top-7 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-accent shadow-cyan-glow sm:left-1/2" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
