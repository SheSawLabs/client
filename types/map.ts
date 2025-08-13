import { SAFETY_COLORS } from "@/constants";

export interface DongFeature {
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

export interface ProcessedDong {
  name: string;
  dongName: string; // 동 이름만 (예: "사직동")
  coordinates: number[][];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  center: { x: number; y: number };
}

export interface CanvasBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  padding: number;
}

export interface Dong {
  dong_code: string;
  district: string;
  dong: string;
  grade: keyof typeof SAFETY_COLORS;
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

export interface District {
  district: string;
  data: Dong[];
  count: number;
}

export interface Streetlight {
  id: number;
  management_number: string;
  district: string;
  dong: string;
  latitude: number;
  longitude: number;
}

export interface StreetlightData {
  count: number;
  district: string;
  dong: string;
  streetlights: Streetlight[];
}
