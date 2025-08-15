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
      className={`flex items-center gap-1 py-1 text-sm font-medium rounded-full transition-colors ${className}`}
      style={{
        backgroundColor: "transparent",
        color: COLORS.PRIMARY,
        border: "none",
      }}
    >
      {isActive && (
        <div
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: COLORS.PRIMARY }}
        />
      )}
      {label}
    </button>
  );
};
