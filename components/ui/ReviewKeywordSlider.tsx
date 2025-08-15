import React, { useCallback } from "react";
import { ReviewKeywordChip } from "./ReviewKeywordChip";
import { COLORS } from "@/constants";
import { KeywordCategory } from "@/queries/reviewForm";

interface SelectedKeyword {
  category: string;
  keyword: string;
}

interface ReviewKeywordSliderProps {
  keywordsData: KeywordCategory;
  selectedKeywords: SelectedKeyword[];
  onKeywordSelect: (category: string, keyword: string) => void;
  className?: string;
}

export const ReviewKeywordSlider: React.FC<ReviewKeywordSliderProps> = ({
  keywordsData,
  selectedKeywords,
  onKeywordSelect,
  className = "",
}) => {
  const isKeywordSelected = useCallback(
    (category: string, keyword: string) => {
      return selectedKeywords.some(
        (selected) =>
          selected.category === category && selected.keyword === keyword,
      );
    },
    [selectedKeywords],
  );

  return (
    <div className={`${className}`}>
      {/* 전체 카테고리가 가로로 스크롤되는 슬라이더 */}
      <div className="overflow-x-auto pb-4 min-w-max">
        <div className="flex gap-6">
          {Object.entries(keywordsData).map(([category, keywords]) => (
            <div
              key={category}
              className="flex flex-col space-y-3 min-w-[200px]"
            >
              {/* 카테고리 제목 */}
              <h3
                className="text-sm font-medium whitespace-nowrap"
                style={{ color: COLORS.GRAY_800 }}
              >
                {category}
              </h3>

              {/* 키워드 칩들 - 세로로 배치 */}
              <div className="flex flex-col gap-2">
                {keywords.map((keyword) => (
                  <ReviewKeywordChip
                    key={keyword}
                    keyword={keyword}
                    isSelected={isKeywordSelected(category, keyword)}
                    onClick={() => onKeywordSelect(category, keyword)}
                    className="w-full justify-start"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
