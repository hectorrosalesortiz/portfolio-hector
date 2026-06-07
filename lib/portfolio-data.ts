import {
  BrainCircuit,
  BriefcaseBusiness,
  CloudCog,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  Rocket,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { SiFlutter, SiKubernetes, SiNodedotjs, SiOpenai, SiReact } from "react-icons/si";
import capabilityAiProductEngineering from "@/data/portfolio/capabilities/01-ai-product-engineering.json";
import capabilityTechnicalLeadership from "@/data/portfolio/capabilities/02-technical-leadership.json";
import capabilityCloudArchitecture from "@/data/portfolio/capabilities/03-cloud-architecture.json";
import capabilityEndToEndPlatforms from "@/data/portfolio/capabilities/04-end-to-end-platforms.json";
import contactEmail from "@/data/portfolio/contact/01-email.json";
import contactTelegram from "@/data/portfolio/contact/02-telegram.json";
import contactWhatsapp from "@/data/portfolio/contact/03-whatsapp.json";
import contactLinkedin from "@/data/portfolio/contact/04-linkedin.json";
import contactCountry from "@/data/portfolio/contact/05-country.json";
import educationJson from "@/data/portfolio/education.json";
import profileJson from "@/data/portfolio/profile.json";
import projectGlobant from "@/data/portfolio/projects/01-globant-enterprise-ai.json";
import projectFoodDelivery from "@/data/portfolio/projects/02-food-delivery-super-app.json";
import projectRappi from "@/data/portfolio/projects/03-rappi-consumer-platform.json";
import projectWizeline from "@/data/portfolio/projects/04-wizeline-enterprise-saas.json";
import projectSofttek from "@/data/portfolio/projects/05-softtek-enterprise-solutions.json";
import skillAiLlm from "@/data/portfolio/skills/01-ai-llm.json";
import skillFrontend from "@/data/portfolio/skills/02-frontend.json";
import skillBackend from "@/data/portfolio/skills/03-backend.json";
import skillMobile from "@/data/portfolio/skills/04-mobile.json";
import skillCloudDevops from "@/data/portfolio/skills/05-cloud-devops.json";
import socialLinkedin from "@/data/portfolio/social/01-linkedin.json";
import socialGithub from "@/data/portfolio/social/02-github.json";
import socialProjects from "@/data/portfolio/social/03-projects.json";
import statYearsExperience from "@/data/portfolio/stats/01-years-experience.json";
import statProjects from "@/data/portfolio/stats/02-projects.json";
import statAiSpecialist from "@/data/portfolio/stats/03-ai-specialist.json";
import statFullStack from "@/data/portfolio/stats/04-full-stack.json";
import timelineSeniorAi from "@/data/portfolio/timeline/01-senior-ai-full-stack-engineer.json";
import timelineSeniorFullStack from "@/data/portfolio/timeline/02-senior-full-stack-developer.json";
import timelineFullStackMobile from "@/data/portfolio/timeline/03-full-stack-mobile-developer.json";
import timelineJuniorWeb from "@/data/portfolio/timeline/04-junior-web-developer.json";
import type {
  Capability,
  ContactMethod,
  Education,
  PortfolioIcon,
  Profile,
  Project,
  SkillCategory,
  SocialLink,
  Stat,
  TimelineItem,
} from "@/types/portfolio";
import { formatWhatsappLink } from "@/lib/utils";

type IconKey = keyof typeof iconMap;
type ProfileField = keyof typeof profileJson;

type RawIconItem = {
  icon: IconKey;
};

type RawContactMethod = RawIconItem & {
  label: string;
  value?: string;
  valueFromProfile?: ProfileField;
  href?: string;
  hrefFromProfile?: ProfileField;
};

type RawSocialLink = RawIconItem & {
  label: string;
  href?: string;
  hrefFromProfile?: ProfileField;
};

const iconMap = {
  BrainCircuit,
  BriefcaseBusiness,
  CloudCog,
  FaGithub,
  FaLinkedin,
  FaTelegramPlane,
  FaWhatsapp,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  Rocket,
  SiFlutter,
  SiKubernetes,
  SiNodedotjs,
  SiOpenai,
  SiReact,
} satisfies Record<string, PortfolioIcon>;

function hydrateIcon<T extends RawIconItem>(item: T): Omit<T, "icon"> & { icon: PortfolioIcon } {
  const { icon: iconKey, ...itemData } = item;

  return {
    ...itemData,
    icon: iconMap[iconKey],
  };
}

function resolveProfileValue(field: ProfileField) {
  return profile[field];
}

function resolveProfileHref(field: ProfileField) {
  if (field === "email") {
    return `mailto:${profile.email}`;
  }

  if (field === "whatsapp") {
    return formatWhatsappLink(profile.whatsapp);
  }

  return resolveProfileValue(field);
}

function hydrateContactMethod(item: RawContactMethod): ContactMethod {
  return {
    label: item.label,
    value: item.value ?? (item.valueFromProfile ? resolveProfileValue(item.valueFromProfile) : ""),
    href: item.href ?? (item.hrefFromProfile ? resolveProfileHref(item.hrefFromProfile) : undefined),
    icon: iconMap[item.icon],
  };
}

function hydrateSocialLink(item: RawSocialLink): SocialLink {
  return {
    label: item.label,
    href: item.href ?? (item.hrefFromProfile ? resolveProfileHref(item.hrefFromProfile) : "#"),
    icon: iconMap[item.icon],
  };
}

export const profile: Profile = profileJson;

export const stats: Stat[] = [statYearsExperience, statProjects, statAiSpecialist, statFullStack];

export const capabilities: Capability[] = [
  capabilityAiProductEngineering,
  capabilityTechnicalLeadership,
  capabilityCloudArchitecture,
  capabilityEndToEndPlatforms,
].map((item) => hydrateIcon(item as RawIconItem & Omit<Capability, "icon">));

export const skillCategories: SkillCategory[] = [skillAiLlm, skillFrontend, skillBackend, skillMobile, skillCloudDevops].map(
  (item) => hydrateIcon(item as RawIconItem & Omit<SkillCategory, "icon">),
);

export const timeline: TimelineItem[] = [
  timelineSeniorAi,
  timelineSeniorFullStack,
  timelineFullStackMobile,
  timelineJuniorWeb,
] as TimelineItem[];

export const projects: Project[] = [projectGlobant, projectFoodDelivery, projectRappi, projectWizeline, projectSofttek] as Project[];

export const contactMethods: ContactMethod[] = [
  contactEmail,
  contactTelegram,
  contactWhatsapp,
  contactLinkedin,
  contactCountry,
].map((item) => hydrateContactMethod(item as RawContactMethod));

export const socialLinks: SocialLink[] = [socialLinkedin, socialGithub, socialProjects].map((item) =>
  hydrateSocialLink(item as RawSocialLink),
);

export const education: Education = hydrateIcon(educationJson as RawIconItem & Omit<Education, "icon">);
