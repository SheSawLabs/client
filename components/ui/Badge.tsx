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
    "inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm";

  const activeStyles = isActive
    ? `border border-[${COLORS.PRIMARY}] text-[${COLORS.PRIMARY}] bg-blue-50`
    : "border border-transparent text-gray-600 bg-white hover:bg-gray-50";

  return (
    <div
      className={`${baseStyles} ${activeStyles} ${className}`}
      onClick={onClick}
      style={
        isActive
          ? {
              borderColor: COLORS.PRIMARY,
              color: COLORS.PRIMARY,
              backgroundColor: `${COLORS.PRIMARY}15`, // 15는 약 8% 투명도
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
