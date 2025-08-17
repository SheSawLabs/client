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
  const [activeFilters, setActiveFilters] = useState<Set<FacilityType>>(
    new Set(),
  );

  const toggleFilter = useCallback((facilityType: FacilityType) => {
    setActiveFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(facilityType)) {
        newSet.delete(facilityType);
      } else {
        newSet.add(facilityType);
      }
      return newSet;
    });
  }, []);

  const isFilterActive = useCallback(
    (facilityType: FacilityType): boolean => {
      return activeFilters.has(facilityType);
    },
    [activeFilters],
  );

  const clearAllFilters = useCallback(() => {
    setActiveFilters(new Set());
  }, []);

  const getActiveFilters = useCallback((): FacilityType[] => {
    return Array.from(activeFilters);
  }, [activeFilters]);

  return {
    toggleFilter,
    isFilterActive,
    clearAllFilters,
    getActiveFilters,
    activeFiltersCount: activeFilters.size,
  };
};
