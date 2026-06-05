import {
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CloudCog,
  Code2,
  DatabaseZap,
  Github,
  Globe2,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Rocket,
  Smartphone,
} from "lucide-react";
import type { ContactMethod, Project, SkillCategory, Stat, TimelineItem } from "@/types/portfolio";
import { formatWhatsappLink } from "@/lib/utils";

export const profile = {
  name: "Hector Rosales Ortiz",
  title: "Senior AI & Full Stack Engineer",
  subtitle: "Building AI-Powered Products, Enterprise Platforms, and Scalable Digital Experiences.",
  email: "mern2025@outlook.com",
  telegram: "@yesteru",
  whatsapp: "+1 (856) 495-1739",
  linkedin: "https://www.linkedin.com/in/héctor-rosales-ortiz-69a9607a/",
  country: "Mexico",
};

export const stats: Stat[] = [
  { value: "10+", label: "Years Experience" },
  { value: "50+", label: "Projects" },
  { value: "AI", label: "Specialist" },
  { value: "Full Stack", label: "Expert" },
];

export const capabilities = [
  {
    title: "AI Product Engineering",
    description: "LLM-powered workflows, RAG platforms, agentic systems, prompt strategies, and production-grade AI assistants.",
    icon: BrainCircuit,
  },
  {
    title: "Technical Leadership",
    description: "Architecture decisions, mentoring, code quality, delivery strategy, and enterprise stakeholder alignment.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Cloud Architecture",
    description: "Scalable platforms across AWS, Azure, and GCP with containerized workloads and CI/CD automation.",
    icon: CloudCog,
  },
  {
    title: "End-to-End Platforms",
    description: "Modern web, mobile, backend, API, data, and DevOps delivery for high-growth digital products.",
    icon: Rocket,
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "AI & LLM",
    description: "Applied AI systems that combine model reasoning, retrieval, tools, and product UX.",
    level: 96,
    icon: Bot,
    skills: ["OpenAI", "LangChain", "RAG", "AI Agents", "Prompt Engineering", "Vector Databases", "LlamaIndex"],
  },
  {
    title: "Frontend",
    description: "Premium interfaces with strong accessibility, animation, and product polish.",
    level: 95,
    icon: Code2,
    skills: ["React", "Next.js", "TypeScript", "Angular", "Tailwind", "Material UI"],
  },
  {
    title: "Backend",
    description: "Secure, scalable APIs and services for enterprise-grade systems.",
    level: 92,
    icon: DatabaseZap,
    skills: ["Node.js", "Python", "FastAPI", "Spring Boot", "GraphQL", "REST APIs"],
  },
  {
    title: "Mobile",
    description: "High-performance mobile experiences and cross-platform product foundations.",
    level: 88,
    icon: Smartphone,
    skills: ["React Native", "Swift", "Kotlin"],
  },
  {
    title: "Cloud & DevOps",
    description: "Reliable delivery pipelines, observability-ready deployments, and cloud-native architecture.",
    level: 90,
    icon: CloudCog,
    skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD"],
  },
];

export const timeline: TimelineItem[] = [
  {
    company: "Globant",
    role: "Senior AI & Full Stack Engineer",
    period: "January 2024 - Present",
    highlights: ["Enterprise AI applications", "RAG systems", "AI assistants", "OpenAI integrations", "Cloud-native architecture"],
  },
  {
    company: "Rappi",
    role: "Senior Mobile & Full Stack Engineer",
    period: "April 2021 - December 2023",
    highlights: ["Millions of users", "React Native platform initiatives", "Logistics systems", "Performance optimization"],
  },
  {
    company: "Wizeline",
    role: "Senior Full Stack Engineer",
    period: "January 2019 - March 2021",
    highlights: ["SaaS platforms", "Cloud-native applications", "Microservices", "Mentorship"],
  },
  {
    company: "Softtek",
    role: "Full Stack Developer",
    period: "January 2016 - December 2018",
    highlights: ["Banking solutions", "Enterprise systems", "Spring Boot", "AngularJS"],
  },
];

export const projects: Project[] = [
  {
    title: "AI Enterprise Assistant",
    description: "A secure knowledge assistant for enterprise teams with retrieval, source grounding, tool orchestration, and measurable answer quality.",
    stack: ["RAG Architecture", "OpenAI", "LangChain", "Vector DB", "AWS"],
    impact: "Reduced support and discovery friction with reliable AI workflows.",
    featured: true,
  },
  {
    title: "Food Delivery Super App",
    description: "A modern delivery experience inspired by high-scale food commerce flows, optimized for conversion, performance, and brand storytelling.",
    stack: ["Next.js", "React", "Tailwind", "TypeScript", "Swiper", "Vercel"],
    impact: "Premium commerce UX with responsive campaigns and deploy-ready architecture.",
    demoUrl: "https://web.didiglobal.com/mx/food",
    featured: true,
  },
  {
    title: "Enterprise SaaS Platform",
    description: "Multi-tenant SaaS architecture with role-based experiences, graph APIs, resilient services, and cloud-native deployment.",
    stack: ["React", "GraphQL", "Kubernetes", "PostgreSQL"],
    impact: "Accelerated enterprise workflows with scalable platform foundations.",
  },
  {
    title: "Mobile Commerce Platform",
    description: "Cross-platform commerce product with native-quality interactions, secure payments, and API-driven personalization.",
    stack: ["React Native", "AWS", "Node.js"],
    impact: "Improved mobile retention through faster checkout and fluid product discovery.",
  },
];

export const contactMethods: ContactMethod[] = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
  },
  {
    label: "Telegram",
    value: profile.telegram,
    href: "https://t.me/yesteru",
    icon: MessageCircle,
  },
  {
    label: "WhatsApp",
    value: profile.whatsapp,
    href: formatWhatsappLink(profile.whatsapp),
    icon: MessageCircle,
  },
  {
    label: "LinkedIn",
    value: "Hector Rosales Ortiz",
    href: profile.linkedin,
    icon: Linkedin,
  },
  {
    label: "Country",
    value: profile.country,
    icon: MapPin,
  },
];

export const socialLinks = [
  { label: "LinkedIn", href: profile.linkedin, icon: Linkedin },
  { label: "GitHub", href: "https://github.com/", icon: Github },
  { label: "Global", href: "#projects", icon: Globe2 },
];

export const education = {
  institution: "Instituto Politecnico Nacional",
  campus: "UPIICSA",
  degree: "Bachelor's Degree",
  field: "Networking of Computer Systems",
  period: "2010 - 2015",
  icon: GraduationCap,
};
