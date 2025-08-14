import React from "react";
import { ChevronRight } from "lucide-react";

interface ButtonWithArrowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ButtonWithArrow: React.FC<ButtonWithArrowProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 transition-colors ${className}`}
    >
      <span className="text-sm font-medium text-gray-900">{children}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  );
};
