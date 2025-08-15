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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const { setSelectedPersona } = usePersona();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getpersonas(userEmail);
        setPersonas(data);
      } catch (error) {
        console.error("Error loading personas:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session]);

  const handleChat = (persona: Persona) => {
    setSelectedPersona(persona);
    router.push("/chat");
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-24 rounded-md" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4 w-64">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-background to-muted/20">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary">
          Choose Your AI Persona
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggleButton />
          <Profile />
        </div>
      </header>

      {personas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 h-[60vh]">
          <Image
            src="/empty-state.svg"
            width={200}
            height={200}
            alt="No personas"
            className="opacity-70"
          />
          <h2 className="text-xl font-semibold text-muted-foreground">
            No personas available
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            You don't have any AI personas yet. Create one to start chatting.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className={cn(
                "flex flex-col items-center bg-card text-card-foreground p-6 rounded-xl shadow-sm",
                "border border-border hover:border-primary/50 transition-all",
                "hover:shadow-md w-full max-w-xs transform hover:-translate-y-1",
                "group cursor-pointer"
              )}
              onClick={() => handleChat(persona)}
            >
              <div className="relative">
                <Image
                  src={persona.avatarUrl || "/default-avatar.png"}
                  width={96}
                  height={96}
                  alt={persona.name}
                  className="rounded-full border-4 border-muted group-hover:border-primary/50 transition-colors"
                  priority
                />
                <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5">
                  <div className="bg-primary-foreground rounded-full p-1">
                    <div className="h-3 w-3 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-center">
                {persona.name}
              </h2>
              <p className="text-sm text-muted-foreground text-center mt-1">
                {persona.description || "AI Assistant"}
              </p>
              <button
                className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg w-full hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChat(persona);
                }}
              >
                💬Start Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
