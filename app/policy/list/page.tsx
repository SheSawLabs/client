"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TopNav } from "@/components/ui/TopNav";
import PolicyTab, { PolicyCategory } from "@/components/ui/PolicyTab";
import { RoundChip } from "@/components/ui/RoundChip";
import { PolicyCard } from "@/components/ui/PolicyCard";
import { usePolicyListQuery } from "@/queries/policy";
import { COLORS } from "@/constants";
import { Policy } from "@/types/policy";
import { hexToRgba } from "@/utils/policy";
import { FilterTags } from "@/components/ui/FilterTags";
import { SortOrder } from "@/types/review";

export default function PolicyListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as PolicyCategory;
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");
  const [activeCategory, setActiveCategory] = useState<PolicyCategory>(
    categoryParam || "all",
  );

  const categoryMap = {
    all: undefined,
    housing: "주거",
    women: "여성",
    etc: "기타",
  };

  const {
    data: policiesData = [],
    isSuccess: policiesIsSuccess,
    isLoading: policiesIsLoading,
    isError: policiesIsError,
  } = usePolicyListQuery(categoryMap[activeCategory]);

  const handleCategoryChange = (category: PolicyCategory) => {
    setActiveCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/policy/list?${params.toString()}`);
  };

  const handlePolicyClick = (policyId: string) => {
    router.push(`/policy/${policyId}`);
  };

  // 하트 아이콘 SVG
  const HeartIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 12.25L6.125 11.4375C3.0625 8.6875 1 6.8125 1 4.5C1 2.625 2.5 1.125 4.375 1.125C5.4375 1.125 6.4375 1.6875 7 2.5C7.5625 1.6875 8.5625 1.125 9.625 1.125C11.5 1.125 13 2.625 13 4.5C13 6.8125 10.9375 8.6875 7.875 11.4375L7 12.25Z"
        fill="currentColor"
      />
    </svg>
  );

  // 사람 아이콘 SVG
  const PersonIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 7C8.65625 7 10 5.65625 10 4C10 2.34375 8.65625 1 7 1C5.34375 1 4 2.34375 4 4C4 5.65625 5.34375 7 7 7ZM7 8.25C5.03125 8.25 1 9.25 1 11.25V12.25C1 12.6875 1.3125 13 1.75 13H12.25C12.6875 13 13 12.6875 13 12.25V11.25C13 9.25 8.96875 8.25 7 8.25Z"
        fill="currentColor"
      />
    </svg>
  );

  if (policiesIsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <TopNav title="정책 정보" />
        <div className="px-7 pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (policiesIsError) {
    return (
      <div className="min-h-screen bg-white">
        <TopNav title="정책 정보" />
        <div className="px-7 pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">정책을 불러오는데 실패했습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNav title="정책 정보" />

      <div className="px-7 pt-6">
        {/* 카테고리 탭 */}
        <PolicyTab
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          className="mb-6"
        />

        {/* 관심 정책, 맞춤 정책 칩들과 FilterTags */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <RoundChip
              label="관심 정책"
              backgroundColor={hexToRgba(COLORS.GRAY_600, 0.1)}
              borderColor={COLORS.GRAY_600}
              textColor={COLORS.GRAY_600}
              icon={<HeartIcon />}
            />
            <RoundChip
              label="맞춤 정책"
              backgroundColor={hexToRgba(COLORS.GRAY_600, 0.1)}
              borderColor={COLORS.GRAY_600}
              textColor={COLORS.GRAY_600}
              icon={<PersonIcon />}
            />
          </div>
          <FilterTags sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>

        {/* 정책 리스트 */}
        <div className="space-y-4 pb-8">
          {policiesIsSuccess && policiesData.length > 0 ? (
            policiesData.map((policy: Policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onClick={handlePolicyClick}
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">표시할 정책이 없습니다.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
