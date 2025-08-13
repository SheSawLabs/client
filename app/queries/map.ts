import { API_BASE_URL } from "@/constants";
import { District, Dong, StreetlightData } from "@/types/map";
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

interface HangjeongDongFeature {
  type: "Feature";
  properties: {
    adm_nm: string; // 행정구역명 (예: "서울특별시 종로구 사직동")
    sggnm: string; // 시군구명 (예: "종로구")
    sidonm: string; // 시도명 (예: "서울특별시")
    [key: string]: unknown;
  };
  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
}

export interface GeoJSONData {
  type: "FeatureCollection";
  features: DistrictFeature[];
}

export interface DongGeoJSON {
  type: "FeatureCollection";
  features: HangjeongDongFeature[];
}

const DISTRICT_JSON_URL =
  "https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json";

const HANGJEONG_DONG_JSON_URL = "/data/hangjeongdong_ver250401.geojson";

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

// 행정동 GeoJSON 데이터를 가져오는 쿼리
export const useDongGeoJSONDQuery = () => {
  return useQuery({
    queryKey: ["hangjeong-dong"],
    queryFn: async (): Promise<DongGeoJSON> => {
      const response = await fetch(HANGJEONG_DONG_JSON_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    select: (data: DongGeoJSON) => ({
      ...data,
      features: data.features.filter(
        (feature) => feature.properties.sidonm === "서울특별시",
      ),
    }),
    staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
    gcTime: 1000 * 60 * 60, // 1시간간 가비지 컬렉션 방지
  });
};

export const useSafetyMapQuery = () => {
  return useQuery({
    queryKey: ["/safety/map"],
    queryFn: async (): Promise<Dong[]> => {
      const response = await fetch(`${API_BASE_URL}/api/safety/map`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  });
};

export const useDistrictByDistrictNameQuery = (disctrictName: string) => {
  return useQuery({
    queryKey: ["/safety/district/:disctrictName", disctrictName],
    queryFn: async (): Promise<District> => {
      const url = encodeURI(
        `${API_BASE_URL}/api/safety/district/${disctrictName}`,
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!disctrictName,
  });
};

export const useDongByDongNameQuery = (dongName: string) => {
  return useQuery({
    queryKey: ["/safety/district/:dongName", dongName],
    queryFn: async (): Promise<Dong> => {
      const url = encodeURI(`${API_BASE_URL}/api/safety/district/${dongName}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!dongName,
  });
};

export const useStreetlightByDongNameQuery = (dongName: string) => {
  return useQuery({
    queryKey: ["/streetlight/dong/:dongName", dongName],
    queryFn: async (): Promise<StreetlightData[]> => {
      const url = encodeURI(`${API_BASE_URL}/api/streetlight/dong/${dongName}`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!dongName,
  });
};

export const useStreetlightByDistrictNameQuery = (districtName: string) => {
  return useQuery({
    queryKey: ["/streetlight/district/:districtName", districtName],
    queryFn: async (): Promise<StreetlightData[]> => {
      const url = encodeURI(
        `${API_BASE_URL}/api/streetlight/district/${districtName}`,
      );
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!districtName,
  });
};
