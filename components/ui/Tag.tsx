import React from "react";

interface TagProps {
  label: string;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded ${className}`}
      style={{
        color: "#1F2937",
      }}
    >
      {label}
    </span>
  );
};
