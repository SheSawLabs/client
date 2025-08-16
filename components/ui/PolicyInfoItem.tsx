import React from "react";

interface PolicyInfoItemProps {
  icon: React.ReactNode;
  label: string;
  content: string;
  className?: string;
}

export const PolicyInfoItem: React.FC<PolicyInfoItemProps> = ({
  icon,
  label,
  content,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* 아이콘 + 라벨 */}
      <div className="flex items-center gap-2">
        <span className="text-gray-600">{icon}</span>
        <span className="text-gray-900 font-medium text-base">{label}</span>
      </div>

      {/* 데이터 */}
      <div className="text-gray-700 text-sm leading-relaxed pl-6">
        {content}
      </div>
    </div>
  );
};
