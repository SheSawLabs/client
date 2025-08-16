import React, { useRef } from "react";
import { Policy } from "@/types/policy";
import { PolicyCard } from "./PolicyCard";

interface PolicyCardSwiperProps {
  policies: Policy[];
  onHeartClick?: (policyId: string) => void;
  likedPolicies?: Set<string>;
  className?: string;
  onPolicyClick?: (policyId: string) => void;
}

export const PolicyCardSwiper: React.FC<PolicyCardSwiperProps> = ({
  policies,
  onHeartClick,
  likedPolicies = new Set(),
  className = "",
  onPolicyClick,
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
              onClick={onPolicyClick}
            />
          </div>
        ))}

        {/* 오른쪽 패딩 */}
        <div className="flex-shrink-0 w-8" />
      </div>
    </div>
  );
};
