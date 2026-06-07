import { NextResponse } from "next/server";
import { profile, skillCategories, timeline } from "@/lib/portfolio-data";

export function GET() {
  const skills = skillCategories.map((category) => `${category.title}: ${category.skills.join(", ")}`).join("\n");
  const experience = timeline
    .map((item) => {
      const links = [
        item.companyUrl ? `Company: ${item.companyUrl}` : "",
        ...(item.links?.map((link) => `${link.label}: ${link.href}`) ?? []),
      ].filter(Boolean);

      return `${item.role}
${item.company} | ${item.location} | ${item.period}
${item.project ? `Project: ${item.project}\n` : ""}${links.length ? `${links.join("\n")}\n` : ""}Technologies: ${item.technologies.join(", ")}

Contributions:
- ${item.responsibilities.join("\n- ")}

Impact:
- ${item.achievements.join("\n- ")}`;
    })
    .join("\n\n");

  const resume = `${profile.name}
${profile.title}
${profile.subtitle}

Email: ${profile.email}
Telegram: ${profile.telegram}
WhatsApp: ${profile.whatsapp}
LinkedIn: ${profile.linkedin}
Country: ${profile.country}

Skills
${skills}

Experience
${experience}

Education
Instituto Politecnico Nacional
https://www.ipn.mx/
Bachelor's Degree, Networking of Computer Systems
2010 - 2015
`;

  return new NextResponse(resume, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Hector-Rosales-Ortiz-Resume.txt"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
