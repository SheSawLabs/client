import React from "react";
import { Calendar } from "lucide-react";
import { Policy } from "@/types/policy";
import { COLORS } from "@/constants";
import { calculateDDay, formatDateRange } from "@/utils/policy";

interface PolicyUpcomingBannerProps {
  policy: Policy;
  className?: string;
}

export const PolicyUpcomingBanner: React.FC<PolicyUpcomingBannerProps> = ({
  policy,
  className = "",
}) => {
  const dDay = calculateDDay(policy.application_period);

  return (
    <div
      className={`p-4 rounded-lg ${className}`}
      style={{ backgroundColor: COLORS.GRAY_100 }}
    >
      {/* D-Day */}
      {dDay !== null && (
        <div className="text-3xl font-bold text-blue-600 mb-2">D-{dDay}</div>
      )}

      {/* 정책명 */}
      <h2 className="text-xl font-bold mb-3" style={{ color: COLORS.GRAY_900 }}>
        {policy.title}
      </h2>

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
