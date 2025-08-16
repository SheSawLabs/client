"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/ui/TopNav";
import { PolicyUpcomingBanner } from "@/components/ui/PolicyUpcomingBanner";
import { PolicyCardSwiper } from "@/components/ui/PolicyCardSwiper";
import { ButtonWithArrow } from "@/components/ui/ButtonWithArrow";
import { usePolicyListQuery, PolicyWithStatus } from "@/queries/policy";
import { COLORS } from "@/constants";
import { isValidDate } from "@/utils/policy";

export default function PolicyHome() {
  const router = useRouter();
  const [likedPolicies, setLikedPolicies] = useState<Set<string>>(new Set());
  const { data: policyData, isLoading, isError } = usePolicyListQuery();

  // 사용자 이름 (추후 실제 사용자 데이터와 연동)
  const userName = ""; // 임시로 빈 문자열

  // 유효한 날짜가 있는 정책들만 필터링 (쿼리에서 이미 정렬됨)
  const validPolicies = useMemo(() => {
    console.log("PolicyHome - policyData:", policyData);

    if (!policyData?.length || !Array.isArray(policyData)) {
      console.log("PolicyHome - No valid data array");
      return [];
    }

    // 이미 select에서 dDay와 isEnded가 계산되어 있음
    const filtered = (policyData as PolicyWithStatus[]).filter((policy) => {
      const isValid = isValidDate(policy.application_period);
      console.log(
        `PolicyHome - Policy "${policy.title}" period "${policy.application_period}" isValid:`,
        isValid,
        "dDay:",
        policy.dDay,
        "isEnded:",
        policy.isEnded,
      );
      return isValid && policy.dDay !== null;
    });

    console.log("PolicyHome - Final valid policies:", filtered);
    return filtered;
  }, [policyData]);

  // 가장 임박한 정책 (만료되지 않은 것 중 D-Day가 가장 적은)
  const upcomingPolicy =
    validPolicies.find((policy) => !policy.isEnded) || null;

  const handleNotificationClick = () => {
    // 알림 기능 구현
    console.log("알림 클릭");
  };

  const handleHeartClick = (policyId: string) => {
    setLikedPolicies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(policyId)) {
        newSet.delete(policyId);
      } else {
        newSet.add(policyId);
      }
      return newSet;
    });
  };

  const handleViewAllPolicies = () => {
    router.push("/policy/list?category=all");
  };

  const handlePolicyClick = (policyId: string) => {
    router.push(`/policy/${policyId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <TopNav
          title="정책 정보"
          showBackButton={false}
          onNotificationClick={handleNotificationClick}
        />
        <div className="flex items-center justify-center py-20 px-7">
          <p style={{ color: COLORS.GRAY_400 }}>정책 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !validPolicies.length) {
    return (
      <div className="min-h-screen bg-white">
        <TopNav
          title="정책 정보"
          showBackButton={false}
          onNotificationClick={handleNotificationClick}
        />
        <div className="flex items-center justify-center py-20 px-7">
          <p style={{ color: COLORS.GRAY_400 }}>
            {isError
              ? "정책 정보를 불러올 수 없습니다."
              : "표시할 정책이 없습니다."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* TopNav */}
      <TopNav
        title="정책 정보"
        showBackButton={false}
        onNotificationClick={handleNotificationClick}
      />

      <div className="space-y-6 pb-20">
        {/* PolicyUpcomingBanner */}
        {upcomingPolicy && (
          <div className="px-7 pt-4">
            <PolicyUpcomingBanner policy={upcomingPolicy} />
          </div>
        )}

        {/* 사용자 인사말 */}
        <div className="px-7">
          <h2
            className="text-lg font-semibold"
            style={{ color: COLORS.GRAY_900 }}
          >
            {userName ? `${userName}님께 ` : ""}꼭 필요한 정책을 모았어요.
          </h2>
        </div>

        {/* PolicyCardSwiper */}
        <PolicyCardSwiper
          policies={validPolicies}
          onHeartClick={handleHeartClick}
          likedPolicies={likedPolicies}
          onPolicyClick={handlePolicyClick}
        />

        {/* 전체 정책 보러가기 버튼 */}
        <div className="px-7">
          <ButtonWithArrow onClick={handleViewAllPolicies}>
            전체 정책 보러가기
          </ButtonWithArrow>
        </div>
      </div>
    </div>
  );
}
