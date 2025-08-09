"use client";

import { useState } from "react";
import { Heart, ChevronDown } from "lucide-react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSortChange = (value: SortOption["value"]) => {
    onSortChange(value);
    setIsDropdownOpen(false);
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
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
        {/* 관심글 토글 */}
        <button
          onClick={onInterestToggle}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            isInterestOnly
              ? "bg-[#2ECC71]/10 text-[#2ECC71]"
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

        {/* 정렬 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="정렬 옵션 선택"
            aria-expanded={isDropdownOpen}
          >
            <span>{sortBy}</span>
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform duration-200",
                isDropdownOpen ? "rotate-180" : "",
              )}
            />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md py-1 z-20 min-w-[100px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors",
                      sortBy === option.value
                        ? "text-[#2ECC71] font-medium"
                        : "text-gray-700",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
