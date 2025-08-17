import React from "react";

type RoundChipSize = "sm" | "md";

interface RoundChipProps {
  label: string;
  backgroundColor: string;
  borderColor: string;
  textColor?: string;
  size?: RoundChipSize;
  className?: string;
  icon?: React.ReactNode;
}

const sizeStyles = {
  sm: {
    padding: "px-2.5 py-0.5",
    fontSize: "0.81rem", // text-sm의 90%
  },
  md: {
    padding: "px-3 py-1",
    fontSize: "0.875rem", // text-sm
  },
} as const;

export const RoundChip: React.FC<RoundChipProps> = ({
  label,
  backgroundColor,
  borderColor,
  textColor = "#FFFFFF",
  size = "sm",
  className = "",
  icon,
}) => {
  const { padding, fontSize } = sizeStyles[size];

  return (
    <div
      className={`inline-flex items-center ${padding} rounded-full border font-medium ${className}`}
      style={{
        backgroundColor,
        borderColor,
        color: textColor,
        fontSize,
      }}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </div>
  );
};
