import { useQuery } from "@tanstack/react-query";

interface DistrictFeature {
  type: "Feature";
  properties: {
    name: string;
    name_eng: string;
    [key: string]: unknown;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJSONData {
  type: "FeatureCollection";
  features: DistrictFeature[];
}

const DISTRICT_JSON_URL =
  "https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json";
const DONG_JSON_URL =
  "https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_submunicipalities_geo_simple.json";

// 서울시 구별 데이터를 가져오는 쿼리
export const useDistrictJsonQuery = () => {
  return useQuery({
    queryKey: ["district-json"],
    queryFn: async (): Promise<GeoJSONData> => {
      const response = await fetch(DISTRICT_JSON_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
    gcTime: 1000 * 60 * 60, // 1시간간 가비지 컬렉션 방지
  });
};

// 서울시 동별 데이터를 가져오는 쿼리
export const useDongJsonQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["dong-json"],
    queryFn: async (): Promise<GeoJSONData> => {
      const response = await fetch(DONG_JSON_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled,
    staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
    gcTime: 1000 * 60 * 60, // 1시간간 가비지 컬렉션 방지
  });
};
