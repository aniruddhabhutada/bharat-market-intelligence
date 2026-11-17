"use client";

import React from "react";
import { BookOpen, BarChart2 } from "lucide-react";
import { useExperienceMode } from "@/context/ExperienceModeContext";

/**
 * ModeToggle — Segmented control switching between "Simple View" (Beginner)
 * and "Advanced View". Preserved in localStorage across all pages.
 */
export const ModeToggle: React.FC = () => {
  const { mode, setMode, isBeginner } = useExperienceMode();

  return (
    <div
      role="group"
      aria-label="Experience Mode Toggle"
      className="inline-flex items-center rounded-lg border border-[#E5EAF2] dark:border-[#1F2E47] bg-[#EEF3FC] dark:bg-[#0B111E] p-0.5 text-xs"
    >
      <button
        type="button"
        onClick={() => setMode("beginner")}
        aria-pressed={isBeginner}
        className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
          isBeginner
            ? "bg-white dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] shadow-sm"
            : "text-[#667085] hover:text-[#172B4D] dark:text-[#97A3B6] dark:hover:text-[#F4F6FB]"
        }`}
      >
        <BookOpen className="h-3.5 w-3.5" />
        <span>Simple View</span>
      </button>

      <button
        type="button"
        onClick={() => setMode("advanced")}
        aria-pressed={!isBeginner}
        className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
          !isBeginner
            ? "bg-white dark:bg-[#1A2844] text-[#315EFB] dark:text-[#4D74FB] shadow-sm"
            : "text-[#667085] hover:text-[#172B4D] dark:text-[#97A3B6] dark:hover:text-[#F4F6FB]"
        }`}
      >
        <BarChart2 className="h-3.5 w-3.5" />
        <span>Advanced View</span>
      </button>
    </div>
  );
};

export default ModeToggle;
