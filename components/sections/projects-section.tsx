"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, GitBranch, Layers3 } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { projects } from "@/lib/portfolio-data";

export function ProjectsSection() {
  return (
    <section id="projects" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Project work shaped for scale, polish, and business outcomes."
          description="Selected AI, SaaS, commerce, and mobile platform work with modern architectures and refined user experiences."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.08}>
              <Card className="group h-full overflow-hidden p-0">
                <div className="relative min-h-64 overflow-hidden rounded-t-[2rem] border-b border-white/10 bg-[#050816] light:border-slate-200">
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.55),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.48),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))]"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.55 }}
                  />
                  <div className="absolute inset-6 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-cyan-100">
                        <Layers3 className="h-6 w-6" />
                      </div>
                      {project.featured ? <Badge>Featured</Badge> : null}
                    </div>
                    <div className="mt-10 space-y-3">
                      <div className="h-3 w-2/3 rounded-full bg-white/25" />
                      <div className="h-3 w-1/2 rounded-full bg-white/20" />
                      <div className="grid grid-cols-3 gap-3 pt-3">
                        <div className="h-16 rounded-2xl bg-white/10" />
                        <div className="h-16 rounded-2xl bg-white/20" />
                        <div className="h-16 rounded-2xl bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="font-sora text-2xl font-semibold">{project.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.description}</p>
                  <p className="mt-4 text-sm font-semibold text-accent">{project.impact}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((technology) => (
                      <Badge key={technology} className="normal-case tracking-normal">
                        {technology}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button href={project.demoUrl ?? "#contact"} variant="primary" size="sm">
                      Live Demo
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button href={project.githubUrl ?? "https://github.com/"} variant="outline" size="sm">
                      GitHub
                      <GitBranch className="h-4 w-4" />
                    </Button>
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
