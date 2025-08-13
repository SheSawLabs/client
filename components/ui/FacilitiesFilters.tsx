import React, { useRef, useEffect, useState } from "react";
import { Badge } from "./Badge";
import { FACILITIES_LABELS } from "@/constants";
import { Dong } from "@/types/map";
import { FacilityType, useFacilityFilters } from "@/hooks/useFacilityFilters";

interface FacilitiesFiltersProps {
  dongInfo: Dong | null;
  onFilterChange?: (activeFilters: FacilityType[]) => void;
  className?: string;
}

export const FacilitiesFilters: React.FC<FacilitiesFiltersProps> = ({
  dongInfo,
  onFilterChange,
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { toggleFilter, isFilterActive, getActiveFilters } =
    useFacilityFilters();

  // 필터 변경 시 콜백 실행을 위한 ref
  const prevActiveFiltersRef = useRef<string>("");

  // 필터 변경 시 콜백 실행
  useEffect(() => {
    const currentFilters = getActiveFilters();
    const currentFiltersString = JSON.stringify(currentFilters.sort());

    // 이전 필터와 다를 때만 콜백 실행
    if (
      currentFiltersString !== prevActiveFiltersRef.current &&
      onFilterChange
    ) {
      prevActiveFiltersRef.current = currentFiltersString;
      onFilterChange(currentFilters);
    }
  });

  // 스크롤 상태 업데이트
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      const resizeObserver = new ResizeObserver(updateScrollButtons);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        resizeObserver.disconnect();
      };
    }
  }, [dongInfo]);

  if (!dongInfo) return null;

  // 시설 데이터와 위험 요소 데이터를 합쳐서 태그 데이터 생성
  const facilitiesData = [
    ...Object.entries(dongInfo.facilities).map(([key, value]) => ({
      type: key as FacilityType,
      label: FACILITIES_LABELS[key as keyof typeof FACILITIES_LABELS],
      count: value,
    })),
    ...Object.entries(dongInfo.risk_factors).map(([key, value]) => ({
      type: key as FacilityType,
      label: FACILITIES_LABELS[key as keyof typeof FACILITIES_LABELS],
      count: value,
    })),
  ].filter((item) => item.count > 0); // 0개인 항목은 제외

  const handleTagClick = (facilityType: FacilityType) => {
    toggleFilter(facilityType);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* 좌측 그라디언트 오버레이 */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-black/10 to-transparent z-10 pointer-events-none" />
        )}

        {/* 우측 그라디언트 오버레이 */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-transparent via-black/10 to-transparent z-10 pointer-events-none" />
        )}

        {/* 스크롤 가능한 태그 컨테이너 */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {facilitiesData.map((item) => (
            <Badge
              key={item.type}
              label={item.label}
              count={item.count}
              isActive={isFilterActive(item.type)}
              onClick={() => handleTagClick(item.type)}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
