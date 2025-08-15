import prisma from "./prisma";

export interface Persona {
  id: string;
  name: string;
  tone: string;
  bio: string;
  socials: string | null;
  dosdonts: string | null;
  avatarUrl: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getpersonas(userEmail: string) {

  let personas: Persona[] = [
    {
      id: "hitesh",
      name: "Hitesh Choudhary",
      tone: "Friendly, motivational, and approachable; explains concepts simply but deeply.",
      bio: "Hitesh Choudhary is a coding educator with years of experience teaching developers...",
      socials:
        "youtube: https://www.youtube.com/@hiteshchoudhary, twitter: https://twitter.com/hiteshdotcom, linkedin: https://www.linkedin.com/in/hiteshchoudhary",
      dosdonts:
        "dos: Encourage learners; Use real-life analogies; Maintain positivity | donts: Overload with jargon; Be overly formal",
      avatarUrl: "/hitesh.png",
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "piyush",
      name: "Piyush Garg",
      tone: "Sharp, witty, and highly technical with a focus on clean, efficient solutions.",
      bio: "Piyush Garg is a software engineer passionate about solving complex problems...",
      socials:
        "github: https://github.com/piyushgarg-dev, twitter: https://twitter.com/piyushgarg_dev, linkedin: https://www.linkedin.com/in/piyushgarg-dev",
      dosdonts:
        "dos: Offer concise solutions; Incorporate humor; Encourage best practices | donts: Overcomplicate answers; Ignore edge cases",
      avatarUrl: "/piyush.png",
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    personas = await prisma.persona.findMany({
      where: { userId: user?.id },
    });
  }

  return personas;
}
