import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Policy } from "@/types/policy";
import { PolicyCard } from "./PolicyCard";
import { useSwiper } from "@/hooks/useSwiper";

// Swiper 스타일 import
import "swiper/css";

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
  // Swiper 설정 - 가로 스크롤, 자동재생 없음, bullet 없음, loop 없음
  const swiperConfig = useSwiper({
    slidesPerView: 1,
    spaceBetween: 16,
    freeMode: false,
    loop: false,
    autoplay: false,
    pagination: false,
    navigation: false,
  });

  return (
    <div className={className}>
      <Swiper {...swiperConfig} className="pb-4 !px-8">
        {policies.map((policy) => (
          <SwiperSlide key={policy.id} className="!w-full">
            <PolicyCard
              policy={policy}
              onHeartClick={onHeartClick}
              isLiked={likedPolicies.has(policy.id)}
              onClick={onPolicyClick}
              className="w-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
