import React from "react";
import { COLORS } from "@/constants";

interface FilterTagProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const FilterTag: React.FC<FilterTagProps> = ({
  label,
  isActive,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full transition-colors ${className}`}
      style={{
        backgroundColor: "transparent",
        color: COLORS.PRIMARY,
        border: "none",
      }}
    >
      {isActive && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: COLORS.PRIMARY }}
        />
      )}
      {label}
    </button>
  );
};
