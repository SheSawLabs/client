import { API_BASE_URL } from "@/constants";
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

interface Dong {
  dong_code: string;
  district: string;
  dong: string;
  grade: string;
  score: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: {
    cctv: number;
    streetlight: number;
    police_station: number;
    safety_house: number;
    delivery_box: number;
  };
  risk_factors: {
    sexual_offender: number;
  };
}

interface District {
  district: string;
  data: Dong[];
  count: number;
}

interface Streetlight {
  id: number;
  management_number: string;
  district: string;
  dong: string;
  latitude: number;
  longitude: number;
}

interface StreetlightData {
  count: number;
  district: string;
  dong: string;
  streetlights: Streetlight[];
}

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
