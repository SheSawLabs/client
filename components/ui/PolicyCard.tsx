import React from "react";
import { Calendar, Heart } from "lucide-react";
import { Policy } from "@/types/policy";
import { PolicyWithStatus } from "@/queries/policy";
import { RoundChip } from "./RoundChip";
import { Tag } from "./Tag";
import { COLORS } from "@/constants";
import { formatDateRange, hexToRgba } from "@/utils/policy";

interface PolicyCardProps {
  policy: Policy | PolicyWithStatus;
  onHeartClick?: (policyId: string) => void;
  isLiked?: boolean;
  className?: string;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({
  policy,
  onHeartClick,
  isLiked = false,
  className = "",
}) => {
  // PolicyWithStatus 타입인지 확인
  const isEnded = "isEnded" in policy ? policy.isEnded : false;
  const dDay = "dDay" in policy ? policy.dDay : null;

  const redBackgroundColor = hexToRgba(COLORS.RED_500, 0.2);
  const grayBackgroundColor = hexToRgba(COLORS.GRAY_400, 0.2);

  // 종료된 정책의 스타일
  const cardOpacity = isEnded ? "opacity-60" : "";
  const chipColor = isEnded ? COLORS.GRAY_400 : COLORS.RED_500;
  const chipBgColor = isEnded ? grayBackgroundColor : redBackgroundColor;

  return (
    <div
      className={`p-4 border rounded-lg space-y-3 bg-white min-w-[280px] max-w-[280px] ${cardOpacity} ${className}`}
      style={{ borderColor: COLORS.GRAY_200 }}
    >
      {/* 상단 행: D-Day와 하트 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {dDay !== null && (
            <RoundChip
              label={isEnded ? "마감" : `D-${Math.abs(dDay)}`}
              backgroundColor={chipBgColor}
              borderColor={chipColor}
              textColor={chipColor}
            />
          )}
          <Tag label={policy.category} />
        </div>
        <button
          onClick={() => onHeartClick?.(policy.id)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Heart
            className="w-5 h-5"
            style={{
              color: isLiked ? COLORS.RED_500 : COLORS.GRAY_400,
              fill: isLiked ? COLORS.RED_500 : "transparent",
            }}
          />
        </button>
      </div>

      {/* 정책명 */}
      <h3
        className="font-semibold text-base line-clamp-1"
        style={{ color: COLORS.GRAY_900 }}
      >
        {policy.title}
      </h3>

      {/* 정책내용 */}
      <p className="text-sm line-clamp-1" style={{ color: COLORS.GRAY_800 }}>
        {policy.description}
      </p>

      {/* 날짜 */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" style={{ color: COLORS.GRAY_400 }} />
        <span className="text-sm" style={{ color: COLORS.GRAY_400 }}>
          {formatDateRange(policy.application_period)}
        </span>
      </div>
    </div>
  );
};
