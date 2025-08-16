import React from "react";
import { MapPin } from "lucide-react";
import { DongSafetyInfo } from "./DongSafetyInfo";
import { ButtonWithArrow } from "./ButtonWithArrow";
import { Dong } from "@/types/map";

interface HomeLocationBannerProps {
  dongInfo: Dong | null;
  onNavigateToMap?: () => void;
  className?: string;
}

export const HomeLocationBanner: React.FC<HomeLocationBannerProps> = ({
  dongInfo,
  onNavigateToMap,
  className = "",
}) => {
  return (
    <div className={`bg-gray-50 rounded-2xl p-4 ${className}`}>
      {/* 현재 위치 정보 */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-gray-900">
          {dongInfo?.dong} 은 ...
        </span>
      </div>

      {/* 동네 안전도 정보 */}
      <DongSafetyInfo dongInfo={dongInfo} className="mb-4" />

      {/* 우리 동네 안전도 보러가기 버튼 */}
      <ButtonWithArrow onClick={onNavigateToMap}>
        우리 동네 안전도 보러가기
      </ButtonWithArrow>
    </div>
  );
};
