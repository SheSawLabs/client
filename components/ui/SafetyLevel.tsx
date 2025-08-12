import React from "react";
import { SAFETY_LABELS, SAFETY_COLORS } from "@/constants";
import { SafetyGrade } from "@/types/safety";

interface SafetyLevelProps {
  className?: string;
}

export const SafetyLevel: React.FC<SafetyLevelProps> = ({ className }) => {
  return (
    <div
      className={`flex justify-between items-center w-full overflow-hidden ${className}`}
    >
      {Object.entries(SAFETY_LABELS).map(([grade, info]) => (
        <div key={grade} className="flex flex-col items-center flex-1 min-w-0">
          <div className="text-xs font-medium mb-1 break-words text-center">
            {grade}
          </div>
          <div
            className="w-12 h-2 rounded-full"
            style={{ backgroundColor: SAFETY_COLORS[grade as SafetyGrade] }}
          />
          <div className="text-xs text-gray-600 mt-1 break-words text-center px-1">
            {info.LABEL}
          </div>
        </div>
      ))}
    </div>
  );
};
