import { NextResponse } from "next/server";
import { profile, skillCategories, timeline } from "@/lib/portfolio-data";

export function GET() {
  const skills = skillCategories.map((category) => `${category.title}: ${category.skills.join(", ")}`).join("\n");
  const experience = timeline
    .map(
      (item) => `${item.role}
${item.company} | ${item.location} | ${item.period}
Technologies: ${item.technologies.join(", ")}

Responsibilities:
- ${item.responsibilities.join("\n- ")}

Achievements:
- ${item.achievements.join("\n- ")}`,
    )
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
Instituto Politecnico Nacional - UPIICSA
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
