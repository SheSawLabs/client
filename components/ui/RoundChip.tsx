import React from "react";

interface RoundChipProps {
  label: string;
  backgroundColor: string;
  borderColor: string;
  textColor?: string;
  className?: string;
}

export const RoundChip: React.FC<RoundChipProps> = ({
  label,
  backgroundColor,
  borderColor,
  textColor = "#FFFFFF",
  className = "",
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
      {label}
    </div>
  );
};
