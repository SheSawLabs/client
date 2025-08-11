import React from "react";
import { MapPin } from "lucide-react";
import { SAFETY_LABELS, SAFETY_COLORS } from "@/constants";
import { SafetyGrade } from "@/types/safety";
import { SafetyQuote } from "./SafetyQuote";

interface DistrictSafetyDetailProps {
  districtName: string;
  grade: SafetyGrade;
  className?: string;
}

export const DistrictSafetyDetail: React.FC<DistrictSafetyDetailProps> = ({
  districtName,
  grade,
  className = "",
}) => {
  const safetyInfo = SAFETY_LABELS[grade];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 동 이름 태그 */}
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
          <MapPin className="w-3 h-3 text-blue-600" />
          <span className="text-xs font-medium text-blue-800">
            {districtName}
          </span>
        </div>
      </div>

      {/* 동네 안전 등급 */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">동네 안전 등급</h3>

        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: SAFETY_COLORS[grade] }}
          >
            {grade}
          </div>
          <div>
            <div className="font-medium text-gray-900">{safetyInfo.LABEL}</div>
            <div className="text-sm text-gray-600 mt-1">
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
    </div>
  );
};
