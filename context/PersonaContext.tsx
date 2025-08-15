"use client";
import { createContext, useState, ReactNode, useContext } from "react";

const PersonaContext = createContext<any>(null);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [selectedPersona, setSelectedPersona] = useState({});

  return (
    <PersonaContext.Provider value={{ selectedPersona, setSelectedPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
