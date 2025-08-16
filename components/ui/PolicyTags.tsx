import React from "react";
import { RoundChip } from "./RoundChip";
import { Tag } from "./Tag";
import { COLORS } from "@/constants";
import { hexToRgba } from "@/utils/policy";
import { Policy } from "@/types/policy";
import { PolicyWithStatus } from "@/queries/policy";

interface PolicyTagsProps {
  policy: Policy | PolicyWithStatus;
  className?: string;
}

export const PolicyTags: React.FC<PolicyTagsProps> = ({
  policy,
  className = "",
}) => {
  // PolicyWithStatus 타입인지 확인
  const isEnded = "isEnded" in policy ? policy.isEnded : false;
  const dDay = "dDay" in policy ? policy.dDay : null;

  const primaryBackgroundColor = hexToRgba(COLORS.PRIMARY, 0.2);
  const redBackgroundColor = hexToRgba(COLORS.RED_500, 0.2);
  const grayBackgroundColor = hexToRgba(COLORS.GRAY_400, 0.2);

  const isUpcoming = dDay !== null && dDay <= 5 && !isEnded;

  const chipColor = isUpcoming
    ? COLORS.RED_500
    : isEnded
      ? COLORS.GRAY_400
      : COLORS.PRIMARY;
  const chipBgColor = isUpcoming
    ? redBackgroundColor
    : isEnded
      ? grayBackgroundColor
      : primaryBackgroundColor;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
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
  );
};
