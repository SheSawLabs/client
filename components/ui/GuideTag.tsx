import React from "react";

interface GuideTagProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  className?: string;
}

export const GuideTag: React.FC<GuideTagProps> = ({
  icon,
  text,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors ${className}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};
