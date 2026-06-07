import type { ComponentType } from "react";

export type PortfolioIcon = ComponentType<{ className?: string }>;

export type Stat = {
  value: string;
  label: string;
};

export type TimelineItem = {
  company: string;
  role: string;
  location: string;
  period: string;
  companyUrl?: string;
  project?: string;
  links?: {
    label: string;
    href: string;
    type?: "web" | "ios" | "android" | "company" | "reference";
  }[];
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
};

export type SkillCategory = {
  title: string;
  description: string;
  level: number;
  skills: string[];
  icon: PortfolioIcon;
};

export type Project = {
  title: string;
  description: string;
  stack: string[];
  impact: string;
  role?: string;
  company?: string;
  location?: string;
  period?: string;
  companyUrl?: string;
  links?: {
    label: string;
    href: string;
    type?: "web" | "ios" | "android" | "company" | "reference";
  }[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  imageUrls?: string[];
  responsibilities?: string[];
  achievements?: string[];
};

export type ContactMethod = {
  label: string;
  value: string;
  href?: string;
  icon: PortfolioIcon;
};
