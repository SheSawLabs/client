import React, { useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ReviewKeywordChip } from "./ReviewKeywordChip";
import { COLORS } from "@/constants";
import { KeywordCategory } from "@/queries/reviewForm";
import { useSwiper } from "@/hooks/useSwiper";

// Swiper 스타일 import
import "swiper/css";

interface SelectedKeyword {
  category: string;
  keyword: string;
}

interface ReviewKeywordSwiperProps {
  keywordsData: KeywordCategory;
  selectedKeywords: SelectedKeyword[];
  onKeywordSelect: (category: string, keyword: string) => void;
  className?: string;
}

export const ReviewKeywordSwiper: React.FC<ReviewKeywordSwiperProps> = ({
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

  // Swiper 설정 - 가로 스크롤, 자동재생 없음, bullet 없음, loop 없음
  const swiperConfig = useSwiper({
    slidesPerView: "auto",
    spaceBetween: 24,
    freeMode: true,
    loop: false,
    autoplay: false,
    pagination: false,
    navigation: false,
  });

  return (
    <div className={`${className}`}>
      <Swiper {...swiperConfig} className="pb-4">
        {Object.entries(keywordsData).map(([category, keywords]) => (
          <SwiperSlide key={category} className="!w-auto">
            <div className="flex flex-col space-y-3 min-w-[200px]">
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
