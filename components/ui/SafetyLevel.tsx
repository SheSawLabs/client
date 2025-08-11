import React from "react";

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

export type SafetyGrade = keyof typeof SAFETY_LABELS;

// 안전등급별 색상
const SAFETY_COLORS = {
  A: "#4CAF50", // 초록
  B: "#8BC34A", // 연한 초록
  C: "#FFC107", // 노랑
  D: "#FF9800", // 주황
  E: "#F44336", // 빨강
} as const;

interface SafetyLevelProps {
  className?: string;
}

export const SafetyLevel: React.FC<SafetyLevelProps> = ({ className }) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      {Object.entries(SAFETY_LABELS).map(([grade, info]) => (
        <div key={grade} className="flex flex-col items-center">
          <div className="text-xs font-medium mb-1">{grade}</div>
          <div
            className="w-12 h-2 rounded-full"
            style={{ backgroundColor: SAFETY_COLORS[grade as SafetyGrade] }}
          />
          <div className="text-xs text-gray-600 mt-1">{info.LABEL}</div>
        </div>
      ))}
    </div>
  );
};
