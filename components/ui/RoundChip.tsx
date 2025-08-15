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
      className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${className}`}
      style={{
        backgroundColor,
        borderColor,
        color: textColor,
      }}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </div>
  );
};
