import React from "react";
import { SAFETY_LABELS, SAFETY_COLORS, COLORS } from "@/constants";
import { RoundChip } from "./RoundChip";
import { Dong } from "@/types/map";

interface DongSafetyInfoProps {
  dongInfo: Dong | null;
  className?: string;
}

export const DongSafetyInfo: React.FC<DongSafetyInfoProps> = ({
  dongInfo,
  className = "",
}) => {
  const gradeColor = dongInfo?.grade
    ? SAFETY_COLORS[dongInfo.grade]
    : COLORS.PRIMARY;
  const safetyInfo = dongInfo?.grade
    ? SAFETY_LABELS[dongInfo.grade]
    : {
        LABEL: "",
        DESCRIPTION: "",
      };

  // 헥스 컬러를 RGBA로 변환하는 함수
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const chipBackgroundColor = hexToRgba(gradeColor, 0.2);

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: gradeColor, fontSize: "1.6rem" }}
        >
          {dongInfo?.grade}
        </div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-gray-100 rounded-full border-1 border-gray-200"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <RoundChip
            label={safetyInfo.LABEL}
            backgroundColor={chipBackgroundColor}
            borderColor={gradeColor}
            textColor={gradeColor}
          />
        </div>
        <div className="text-sm text-gray-600 leading-relaxed">
          {safetyInfo.DESCRIPTION}
        </div>
      </div>
    </div>
  );
};
