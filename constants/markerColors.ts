export const MARKER_COLORS = {
  DEFAULT: "#1F2937", // gray-800
  PRIMARY: "#3B82F6", // blue-500
  SUCCESS: "#10B981", // emerald-500
  WARNING: "#F59E0B", // amber-500
  DANGER: "#EF4444", // red-500
} as const;

export type MarkerColorType = keyof typeof MARKER_COLORS;
