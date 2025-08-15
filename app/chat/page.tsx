"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { usePersona } from "@/context/PersonaContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getpersonas, Persona } from "@/lib/personas";

export default function ChatPage() {
  const { selectedPersona, setSelectedPersona } = usePersona();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const userProfileImage = session?.user?.image;

  useEffect(() => {
    async function load() {
      try {
        const data = await getpersonas(userEmail);
        setPersonas(data);
      } catch (error) {}
    }
    load();
  }, [session]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/40 p-4 hidden md:block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Persona-Verse</h2>
          <ThemeToggleButton />
        </div>
        {personas.map((persona) => (
          <div key={persona.id} className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setSelectedPersona(persona)}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={persona.avatarUrl || ""} />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              {persona.name}
            </Button>
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="border-b bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={selectedPersona.avatarUrl} />
                <AvatarFallback>{selectedPersona.name}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold">{selectedPersona.name}</h1>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="md:hidden">
              <ThemeToggleButton />
            </div>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* AI Message */}
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={selectedPersona.avatarUrl} />
                <AvatarFallback>{selectedPersona.name}</AvatarFallback>
              </Avatar>
              <Card className="px-4 py-3 max-w-[80%] bg-primary/5">
                <p className="text-primary-foreground">
                  Hello! How can I assist you today?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>
            </div>

            {/* User Message */}
            <div className="flex items-start gap-3 justify-end">
              <Card className="px-4 py-3 max-w-[80%] bg-primary text-primary-foreground">
                <p>Tell me about Persona-Verse!</p>
                <p className="text-xs text-primary-foreground/70 mt-1 text-right">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>
              <Avatar>
                <AvatarImage src={userProfileImage ?? "/user.png"} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-muted/40 p-4">
          <form className="flex gap-2">
            <Input placeholder="Type your message..." className="flex-1" />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
