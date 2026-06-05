import { profile, projects, skillCategories } from "@/lib/portfolio-data";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.subtitle,
    email: profile.email,
    telephone: profile.whatsapp,
    address: {
      "@type": "PostalAddress",
      addressCountry: profile.country,
    },
    sameAs: [profile.linkedin],
    knowsAbout: skillCategories.flatMap((category) => category.skills),
    hasOccupation: {
      "@type": "Occupation",
      name: profile.title,
      skills: skillCategories.flatMap((category) => category.skills).join(", "),
    },
    workExample: projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url: project.demoUrl,
    })),
  };
}
