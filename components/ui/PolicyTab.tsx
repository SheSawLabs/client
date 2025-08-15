"use client";

import { cn } from "@/utils/cn";

export type PolicyCategory = "all" | "housing" | "women" | "etc";

interface PolicyTabProps {
  activeCategory: PolicyCategory;
  onCategoryChange: (category: PolicyCategory) => void;
  className?: string;
}

const tabs = [
  { key: "all" as const, label: "전체" },
  { key: "housing" as const, label: "주거" },
  { key: "women" as const, label: "여성" },
  { key: "etc" as const, label: "기타" },
];

export default function PolicyTab({
  activeCategory,
  onCategoryChange,
  className,
}: PolicyTabProps) {
  return (
    <div className={cn("flex bg-gray-100 rounded-xl p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onCategoryChange(tab.key)}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200",
            activeCategory === tab.key
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
