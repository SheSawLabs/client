"use client";

import { Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import { CategoryTab, SortOption } from "@/types/community";

interface CommunityFiltersProps {
  activeCategory: CategoryTab["key"];
  isInterestOnly: boolean;
  sortBy: SortOption["value"];
  onCategoryChange: (category: CategoryTab["key"]) => void;
  onInterestToggle: () => void;
  onSortChange: (sort: SortOption["value"]) => void;
  className?: string;
}

const categoryTabs: CategoryTab[] = [
  { id: "all", label: "전체", key: "전체" },
  { id: "safety", label: "안전 수리", key: "안전 수리" },
  { id: "small_group", label: "소분 모임", key: "소분 모임" },
  { id: "hobby", label: "취미·기타", key: "취미·기타" },
];

const sortOptions: SortOption[] = [
  { value: "등록순", label: "등록순" },
  { value: "최신순", label: "최신순" },
];

export function CommunityFilters({
  activeCategory,
  isInterestOnly,
  sortBy,
  onCategoryChange,
  onInterestToggle,
  onSortChange,
  className,
}: CommunityFiltersProps) {
  const handleSortKeyDown = (
    e: React.KeyboardEvent,
    value: SortOption["value"],
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSortChange(value);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const currentIndex = sortOptions.findIndex(
        (option) => option.value === sortBy,
      );
      const nextIndex =
        e.key === "ArrowRight"
          ? (currentIndex + 1) % sortOptions.length
          : (currentIndex - 1 + sortOptions.length) % sortOptions.length;
      onSortChange(sortOptions[nextIndex].value);
    }
  };

  return (
    <div className={cn("bg-white border-b border-gray-100", className)}>
      {/* 카테고리 탭 */}
      <div className="px-4 py-3">
        <div className="flex justify-center gap-2 overflow-x-auto scrollbar-hide">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onCategoryChange(tab.key)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeCategory === tab.key
                  ? "bg-[#2ECC71]/10 text-[#2ECC71] font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
              aria-label={`${tab.label} 카테고리 선택`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 보조 필터 */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-50">
        {/* 관심글 토글 */}
        <button
          onClick={onInterestToggle}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            isInterestOnly
              ? "bg-[#0f5fda]/10 text-[#0f5fda]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
          )}
          aria-label="관심글만 보기"
        >
          <Heart
            size={16}
            className={cn(isInterestOnly ? "fill-current" : "stroke-current")}
          />
          <span>관심글</span>
        </button>

        {/* 정렬 세그먼트 토글 */}
        <div
          className="flex items-center gap-5"
          role="tablist"
          aria-label="정렬 옵션"
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              onKeyDown={(e) => handleSortKeyDown(e, option.value)}
              className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
              role="tab"
              aria-selected={sortBy === option.value}
              tabIndex={sortBy === option.value ? 0 : -1}
            >
              {sortBy === option.value && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#0f5fda]" />
              )}
              <span
                className={cn(
                  sortBy === option.value
                    ? "text-[#0f5fda] font-semibold"
                    : "text-[#6B7280]",
                )}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
