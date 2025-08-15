import React from "react";
import { MapPin } from "lucide-react";
import { SAFETY_LABELS, SAFETY_COLORS, COLORS } from "@/constants";

import { SafetyQuote } from "./SafetyQuote";
import { ReviewSummary } from "./ReviewSummary";
import { RoundChip } from "./RoundChip";
import { Dong } from "@/types/map";

interface DongSafetyDetailProps {
  dongInfo: Dong | null;
  className?: string;
}

export const DongSafetyDetail: React.FC<DongSafetyDetailProps> = ({
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
    <div className={`space-y-4 ${className}`}>
      {/* 동 이름 태그 */}
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
          <MapPin className="w-3 h-3 text-gray-800" />
          <span className="text-xs font-medium text-gray-800">
            {dongInfo?.dong}
          </span>
        </div>
      </div>

      {/* 동네 안전 등급 */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">동네 안전 등급</h3>

        <div className="flex items-start gap-3">
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
      </div>

      {/* 안전 주의사항 */}
      <SafetyQuote
        message="지도에 표시된 빨간 원은 유흥업소가 밀집된 지역이에요. 야간에는 주변 환경에 유의하며 이동해 주세요."
        className="mt-4"
      />

      {/* 동네 안전 리뷰 */}
      <ReviewSummary
        districtName={dongInfo?.district}
        dongName={dongInfo?.dong || ""}
        className="mt-6"
      />
    </div>
  );
};
