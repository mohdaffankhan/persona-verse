"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { usePersona } from "@/context/PersonaContext";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { getpersonas, Persona } from "@/lib/personas";
import axios from "axios";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ChatPage() {
  const { selectedPersona, setSelectedPersona } = usePersona();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [messages, setMessages] = useState<Array<{
    content: string;
    isUser: boolean;
    time: string;
  }>>([]);
  const [inputValue, setInputValue] = useState("");
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const userProfileImage = session?.user?.image;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getpersonas(userEmail);
        setPersonas(data);
        if (data.length > 0 && !selectedPersona.id) {
          setSelectedPersona(data[0]);
        }
      } catch (error) {
        console.error("Error loading personas:", error);
      }
    }
    load();
  }, [session]);

  useEffect(() => {
    setInputValue("");
    setMessages([]);
  }, [selectedPersona]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      content: inputValue,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const res = await axios.post("/api/chat", {
        message: inputValue,
        selectedPersona,
      });

      const aiMessage = {
        content: res.data.content,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        content: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/40 p-4 hidden md:flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold"><Link href="/">Persona-Verse</Link></h2>
          <ThemeToggleButton />
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {personas.map((persona) => (
              <Button
                key={persona.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-colors",
                  selectedPersona.id === persona.id
                    ? "bg-accent hover:bg-accent/90"
                    : "hover:bg-muted/50"
                )}
                onClick={() => setSelectedPersona(persona)}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={persona.avatarUrl || ""} />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <span className="truncate">{persona.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
        {session?.user && (
          <div className="mt-auto pt-4 border-t flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfileImage || ""} />
              <AvatarFallback>
                {session.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="border-b bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={selectedPersona.avatarUrl} />
                <AvatarFallback>{selectedPersona.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold">{selectedPersona.name}</h1>
                <p className="text-xs text-muted-foreground">
                  {selectedPersona.description || "AI Assistant"}
                </p>
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
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
                <Avatar className="h-16 w-16 mb-4">
                  <AvatarImage src={selectedPersona.avatarUrl} />
                  <AvatarFallback>{selectedPersona.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1">Chat with {selectedPersona.name}</h2>
                <p className="max-w-md">
                  {selectedPersona.welcomeMessage || "How can I help you today?"}
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                {!message.isUser && (
                  <Avatar>
                    <AvatarImage src={selectedPersona.avatarUrl} />
                    <AvatarFallback>{selectedPersona.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <Card
                  className={cn(
                    "px-4 py-3 max-w-[80%]",
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.isUser
                        ? "text-primary-foreground/70 text-right"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.time}
                  </p>
                </Card>
                {message.isUser && (
                  <Avatar>
                    <AvatarImage src={userProfileImage || "/user.png"} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-muted/40 p-4">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <Input
              name="message"
              placeholder={`Message ${selectedPersona.name}...`}
              className="flex-1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
            />
            <Button type="submit" disabled={!inputValue.trim()}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}