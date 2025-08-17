"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/ui/TopNav";
import { HomeLocationBanner } from "@/components/ui/HomeLocationBanner";
import { ButtonWithArrow } from "@/components/ui/ButtonWithArrow";
import { PolicyCardSwiper } from "@/components/ui/PolicyCardSwiper";
import { PostCard } from "@/components/ui/PostCard";
import { usePolicyListQuery, PolicyWithStatus } from "@/queries/policy";
import { usePostsQuery } from "@/app/queries/community";
import { isValidDate } from "@/utils/policy";
import { Post } from "@/types/community";
import { Dong } from "@/types/map";

export default function Home() {
  const router = useRouter();
  const [likedPolicies, setLikedPolicies] = useState<Set<string>>(new Set());

  // 임시 사용자 정보 (추후 실제 데이터와 연동)
  const userName = "도윤"; // 임시 사용자명
  const mockDongInfo: Dong | null = {
    dong_code: "54208",
    district: "관악구",
    dong: "낙성대동",
    grade: "C",
    score: 61.2,
    coordinates: {
      lat: 37.467231,
      lng: 126.960046,
    },
    facilities: {
      cctv: 215,
      streetlight: 0,
      police_station: 1,
      safety_house: 3,
      delivery_box: 0,
    },
    risk_factors: {
      sexual_offender: 0,
    },
  };

  // 정책 데이터 가져오기
  const { data: policyData, isLoading: policyLoading } = usePolicyListQuery();

  // 커뮤니티 데이터 가져오기
  const { data: communityData, isLoading: communityLoading } = usePostsQuery();

  // 유효한 정책들 필터링
  const validPolicies = useMemo(() => {
    if (!policyData?.length || !Array.isArray(policyData)) {
      return [];
    }

    const filtered = (policyData as PolicyWithStatus[]).filter((policy) => {
      const isValid = isValidDate(policy.application_period);
      return isValid && policy.dDay !== null;
    });

    return filtered.slice(0, 5); // 홈에서는 최대 5개만 표시
  }, [policyData]);

  // 추천 커뮤니티 포스트 (최신 3개)
  const recommendedPosts = useMemo(() => {
    if (!communityData?.posts) return [];
    return communityData.posts.slice(0, 3);
  }, [communityData]);

  const handleNotificationClick = () => {
    console.log("알림 클릭");
  };

  const handleNavigateToMap = () => {
    if (mockDongInfo) {
      const params = new URLSearchParams({
        step: "interactive-map",
        district: mockDongInfo.district,
        dong: mockDongInfo.dong,
      });
      router.push(`/map?${params.toString()}`);
    } else {
      router.push("/map");
    }
  };

  const handleViewAllCommunity = () => {
    router.push("/community/groups");
  };

  const handleViewAllPolicies = () => {
    router.push("/policy");
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

  const handlePolicyClick = (policyId: string) => {
    router.push(`/policy/${policyId}`);
  };

  const handlePostClick = (post: Post) => {
    router.push(`/community/post?id=${post.id}`);
  };

  return (
    <div className="bg-white">
      {/* TopNav with Logo */}
      <TopNav
        title=""
        showBackButton={false}
        hasLogo={true}
        onNotificationClick={handleNotificationClick}
      />

      <div className="space-y-6 pb-20">
        {/* 인사말 */}
        <div className="px-7 pt-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {userName ? `${userName} 님,` : ""} 오늘도 안전한 하루 되세요!
          </h1>
        </div>

        {/* 현재 위치 안전도 배너 */}
        <div className="px-7">
          <HomeLocationBanner
            dongInfo={mockDongInfo}
            onNavigateToMap={handleNavigateToMap}
          />
        </div>

        {/* 오늘의 추천 커뮤니티 */}
        <div className="space-y-4">
          <div className="px-7 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              오늘의 추천 커뮤니티
            </h2>
            <ButtonWithArrow type="short" onClick={handleViewAllCommunity}>
              더보기
            </ButtonWithArrow>
          </div>

          {communityLoading ? (
            <div className="px-7">
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-lg h-20 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="px-7 space-y-3">
              {recommendedPosts.map((post) => (
                <PostCard key={post.id} post={post} onClick={handlePostClick} />
              ))}
              {recommendedPosts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">추천 커뮤니티가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 맞춤 정책 */}
        <div className="space-y-4">
          <div className="px-7 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">맞춤 정책</h2>
            <ButtonWithArrow type="short" onClick={handleViewAllPolicies}>
              더보기
            </ButtonWithArrow>
          </div>

          {policyLoading ? (
            <div className="px-7">
              <div className="flex gap-4 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-lg h-40 min-w-[280px] animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : validPolicies.length > 0 ? (
            <PolicyCardSwiper
              policies={validPolicies}
              onHeartClick={handleHeartClick}
              likedPolicies={likedPolicies}
              onPolicyClick={handlePolicyClick}
            />
          ) : (
            <div className="px-7 text-center py-8">
              <p className="text-gray-500">추천 정책이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
