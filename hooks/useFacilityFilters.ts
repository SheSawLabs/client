import { useState, useCallback } from "react";

export type FacilityType =
  | "all"
  | "cctv"
  | "streetlight"
  | "police_station"
  | "safety_house"
  | "delivery_box"
  | "sexual_offender";

export interface FacilityFilter {
  type: FacilityType;
  isActive: boolean;
}

export const useFacilityFilters = () => {
  const [selectedFilter, setSelectedFilter] = useState<FacilityType>("all");

  const selectFilter = useCallback((facilityType: FacilityType) => {
    setSelectedFilter(facilityType);
  }, []);

  const isFilterActive = useCallback(
    (facilityType: FacilityType): boolean => {
      return selectedFilter === facilityType;
    },
    [selectedFilter],
  );

  const clearAllFilters = useCallback(() => {
    setSelectedFilter("all");
  }, []);

  const getActiveFilters = useCallback((): FacilityType[] => {
    return selectedFilter === "all" ? [] : [selectedFilter];
  }, [selectedFilter]);

  return {
    toggleFilter: selectFilter, // 기존 API 호환성을 위해 유지
    selectFilter,
    isFilterActive,
    clearAllFilters,
    getActiveFilters,
    selectedFilter,
  };
};
