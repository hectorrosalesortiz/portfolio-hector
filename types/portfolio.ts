import type { ComponentType } from "react";

export type PortfolioIcon = ComponentType<{ className?: string }>;

export type Profile = {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  telegram: string;
  whatsapp: string;
  linkedin: string;
  country: string;
  address: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type Capability = {
  title: string;
  description: string;
  icon: PortfolioIcon;
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

export type SocialLink = {
  label: string;
  href: string;
  icon: PortfolioIcon;
};

export type Education = {
  institution: string;
  url: string;
  degree: string;
  field: string;
  period: string;
  icon: PortfolioIcon;
};
