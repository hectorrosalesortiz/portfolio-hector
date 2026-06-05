import type { LucideIcon } from "lucide-react";

export type Stat = {
  value: string;
  label: string;
};

export type TimelineItem = {
  company: string;
  role: string;
  location: string;
  period: string;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
};

export type SkillCategory = {
  title: string;
  description: string;
  level: number;
  skills: string[];
  icon: LucideIcon;
};

export type Project = {
  title: string;
  description: string;
  stack: string[];
  impact: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
};

export type ContactMethod = {
  label: string;
  value: string;
  href?: string;
  icon: LucideIcon;
};
