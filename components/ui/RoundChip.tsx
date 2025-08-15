import React from "react";

interface RoundChipProps {
  label: string;
  backgroundColor: string;
  borderColor: string;
  textColor?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const RoundChip: React.FC<RoundChipProps> = ({
  label,
  backgroundColor,
  borderColor,
  textColor = "#FFFFFF",
  className = "",
  icon,
}) => {
  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border font-medium ${className}`}
      style={{
        backgroundColor,
        borderColor,
        color: textColor,
        fontSize: "0.81rem", // text-sm의 90% (0.875rem * 0.9)
      }}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </div>
  );
};
