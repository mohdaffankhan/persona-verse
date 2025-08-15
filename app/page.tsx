"use client";
import Profile from "@/components/Profile";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { getpersonas } from "@/lib/personas";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePersona } from "@/context/PersonaContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Persona } from "@/lib/generated/prisma";

export default function Home() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  useEffect(() => {
    async function load() {
      try {
        const data = await getpersonas(userEmail);
        setPersonas(data);
      } catch (error) {}
    }
    load();
  }, [session]);

  const { selectedPersona, setSelectedPersona } = usePersona();

  const handleChat = (persona: object) => {
    setSelectedPersona(persona);
    router.push("/chat");
    console.log(selectedPersona);
  };

  return (
    <>
      <ThemeToggleButton />
      <Profile />
      <div className="mb-4 flex justify-center items-center gap-10">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="flex flex-col items-center bg-slate-900 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-64"
          >
            <Image
              src={persona.avatarUrl || "/hitesh.png"}
              width={100}
              height={100}
              alt={persona.name}
              className="rounded-full border-4 border-slate-700"
            />
            <h1 className="mt-3 text-lg font-semibold">{persona.name}</h1>
            <p className="text-sm text-gray-400">AI Persona</p>

            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl w-full transition-colors"
              onClick={() => handleChat(persona)}
            >
              💬 Chat
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
