"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { PersonaProvider } from "@/context/PersonaContext";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PersonaProvider>
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
    </PersonaProvider>
  );
}
