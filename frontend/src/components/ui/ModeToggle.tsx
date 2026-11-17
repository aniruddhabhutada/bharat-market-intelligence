"use client";

import React from "react";
import { useExperienceMode } from "@/context/ExperienceModeContext";

/**
 * ModeToggle — switches between "beginner" and "advanced" experience modes.
 * Intended for placement in the Header (desktop) and optionally in the Sidebar.
 */
export const ModeToggle: React.FC = () => {
  const { mode, setMode, isBeginner } = useExperienceMode();

  return (
    <button
      onClick={() => setMode(isBeginner ? "advanced" : "beginner")}
      title={isBeginner ? "Switch to Advanced View" : "Switch to Simple View"}
      aria-label="Toggle experience mode"
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all active:scale-95 ${
        isBeginner
          ? "border-emerald-700/60 bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900/80"
          : "border-blue-700/60 bg-blue-950/80 text-blue-300 hover:bg-blue-900/80"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isBeginner ? "bg-emerald-400" : "bg-blue-400"}`} />
      {isBeginner ? "Simple" : "Advanced"}
    </button>
  );
};

export default ModeToggle;
