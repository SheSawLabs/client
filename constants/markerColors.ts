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

export const SAFETY_LEVEL_BG_CLASSES = {
  1: "bg-red-500", // 매우 위험
  2: "bg-amber-500", // 위험
  3: "bg-amber-500", // 보통
  4: "bg-emerald-500", // 안전
  5: "bg-blue-500", // 매우 안전
} as const;

export type SafetyLevel = 1 | 2 | 3 | 4 | 5;
