import React from "react";
import { ChevronRight } from "lucide-react";

interface ButtonWithArrowProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "wide" | "short";
  className?: string;
}

export const ButtonWithArrow: React.FC<ButtonWithArrowProps> = ({
  children,
  onClick,
  type = "wide",
  className = "",
}) => {
  const baseClasses =
    "flex items-center text-left hover:bg-gray-50 transition-colors";
  const typeClasses =
    type === "wide" ? "justify-between w-full py-3" : "gap-1 px-2 py-1";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${typeClasses} ${className}`}
    >
      <span
        className={`font-medium text-gray-900 ${type === "wide" ? "text-sm" : "text-xs"}`}
      >
        {children}
      </span>
      <ChevronRight
        className={`text-gray-400 ${type === "wide" ? "w-4 h-4" : "w-3 h-3"}`}
      />
    </button>
  );
};
