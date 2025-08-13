import React from "react";
import { COLORS } from "@/constants";

interface BadgeProps {
  label: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  count,
  isActive = false,
  onClick,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer";

  const activeStyles = isActive
    ? "text-white shadow-md"
    : "text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white/90";

  return (
    <div
      className={`${baseStyles} ${activeStyles} ${className}`}
      onClick={onClick}
      style={
        isActive
          ? {
              backgroundColor: COLORS.PRIMARY,
              color: "white",
            }
          : {}
      }
    >
      <span>{label}</span>
      <span className="font-semibold">{count}</span>
      <span>곳</span>
    </div>
  );
};
