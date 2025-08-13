export const MARKER_COLORS = {
  DEFAULT: "#1F2937", // gray-800
  PRIMARY: "#3B82F6", // blue-500
  SUCCESS: "#10B981", // emerald-500
  WARNING: "#F59E0B", // amber-500
  DANGER: "#EF4444", // red-500
} as const;

export type MarkerColorType = keyof typeof MARKER_COLORS;

// 안전도(level)별 색상 매핑
export const SAFETY_LEVEL_COLORS = {
  1: "#EF4444", // red-500 - 매우 위험
  2: "#F59E0B", // amber-500 - 위험
  3: "#F59E0B", // amber-500 - 보통
  4: "#10B981", // emerald-500 - 안전
  5: "#3B82F6", // blue-500 - 매우 안전
} as const;

// TODO: SAFETY_COLORS 와 역할겹침. 정리필요
export const SAFETY_LEVEL_BG_CLASSES = {
  1: "bg-red-500", // 매우 위험
  2: "bg-amber-500", // 위험
  3: "bg-amber-500", // 보통
  4: "bg-emerald-500", // 안전
  5: "bg-blue-500", // 매우 안전
} as const;

export type SafetyLevel = 1 | 2 | 3 | 4 | 5;

// 안전등급 상수
export const SAFETY_LABELS = {
  A: {
    LABEL: "매우 좋음",
    DESCRIPTION: "매우 안전한 지역으로 언제든 편안하게 이동하실 수 있어요.",
  },
  B: {
    LABEL: "좋음",
    DESCRIPTION:
      "비교적 안전한 지역이지만 야간에는 주변을 살펴가며 이동해주세요.",
  },
  C: {
    LABEL: "양호",
    DESCRIPTION:
      "일반적인 안전 수준이므로 평소보다 조금 더 주의해서 이동해주세요.",
  },
  D: {
    LABEL: "관심 필요",
    DESCRIPTION: "주의가 필요한 지역이므로 가급적 동반자와 함께 이동해주세요.",
  },
  E: {
    LABEL: "주의 필요",
    DESCRIPTION: "혼자 이동 시 주변을 꼭 살펴주세요.",
  },
} as const;

// 안전등급별 색상
export const SAFETY_COLORS = {
  A: "#00C5BE",
  B: "#1CCF63",
  C: "#89BE00",
  D: "#CBBC15",
  E: "#F48661",
} as const;

export const API_BASE_URL = "http://localhost:3001";

export const COLORS = {
  PRIMARY: "#0f5fda", // blue-500
};
