import React, { useRef } from "react";
import { Policy } from "@/types/policy";
import { PolicyCard } from "./PolicyCard";

interface PolicyCardSliderProps {
  policies: Policy[];
  onHeartClick?: (policyId: string) => void;
  likedPolicies?: Set<string>;
  className?: string;
}

export const PolicyCardSlider: React.FC<PolicyCardSliderProps> = ({
  policies,
  onHeartClick,
  likedPolicies = new Set(),
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 왼쪽 패딩 */}
        <div className="flex-shrink-0 w-8" />

        {policies.map((policy) => (
          <div
            key={policy.id}
            className="flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <PolicyCard
              policy={policy}
              onHeartClick={onHeartClick}
              isLiked={likedPolicies.has(policy.id)}
            />
          </div>
        ))}

        {/* 오른쪽 패딩 */}
        <div className="flex-shrink-0 w-8" />
      </div>
    </div>
  );
};
