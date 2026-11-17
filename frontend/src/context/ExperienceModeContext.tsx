"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type ExperienceMode = "beginner" | "advanced";

interface ExperienceModeContextType {
  mode: ExperienceMode;
  setMode: (m: ExperienceMode) => void;
  isBeginner: boolean;
  isAdvanced: boolean;
}

const ExperienceModeContext = createContext<ExperienceModeContextType>({
  mode: "beginner",
  setMode: () => {},
  isBeginner: true,
  isAdvanced: false,
});

export const ExperienceModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ExperienceMode>("beginner");

  useEffect(() => {
    const saved = localStorage.getItem("bmi_experience_mode") as ExperienceMode;
    if (saved === "advanced" || saved === "beginner") setModeState(saved);
  }, []);

  const setMode = (m: ExperienceMode) => {
    setModeState(m);
    localStorage.setItem("bmi_experience_mode", m);
  };

  return (
    <ExperienceModeContext.Provider value={{ mode, setMode, isBeginner: mode === "beginner", isAdvanced: mode === "advanced" }}>
      {children}
    </ExperienceModeContext.Provider>
  );
};

export const useExperienceMode = () => useContext(ExperienceModeContext);
