"use client";

import React, { useState, useMemo } from "react";
import { CommunityHeader } from "@/components/ui/CommunityHeader";
import { CommunityFilters } from "@/components/ui/CommunityFilters";
import { PostCard } from "@/components/ui/PostCard";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { mockPosts } from "@/data/mockPosts";
import { Post, CategoryTab, SortOption, PostState } from "@/types/community";

export default function GroupsPage() {
  const [activeCategory, setActiveCategory] =
    useState<CategoryTab["key"]>("소분 모임");
  const [isInterestOnly, setIsInterestOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption["value"]>("등록순");
  const [postState] = useState<PostState>("loaded");

  // 필터링된 포스트 목록
  const filteredPosts = useMemo(() => {
    let filtered = [...mockPosts];

    // 카테고리 필터링
    if (activeCategory !== "전체") {
      filtered = filtered.filter((post) => {
        if (activeCategory === "안전 수리") {
          return (
            post.title.includes("CCTV") ||
            post.title.includes("가로등") ||
            post.title.includes("수리")
          );
        }
        if (activeCategory === "소분 모임") {
          return post.badge?.label === "소분 모임";
        }
        if (activeCategory === "취미·기타") {
          return (
            !post.badge ||
            (post.badge.label !== "소분 모임" &&
              !post.title.includes("CCTV") &&
              !post.title.includes("가로등"))
          );
        }
        return true;
      });
    }

    // 관심글 필터링 (임시로 좋아요 15개 이상으로 필터)
    if (isInterestOnly) {
      filtered = filtered.filter((post) => post.stats.likes >= 15);
    }

    // 정렬
    if (sortBy === "최신순") {
      filtered = filtered.sort((a, b) => {
        const getTimeValue = (timeStr: string) => {
          if (timeStr.includes("시간전")) return parseInt(timeStr) / 24;
          if (timeStr.includes("일전")) return parseInt(timeStr);
          if (timeStr.includes("주전")) return parseInt(timeStr) * 7;
          return 0;
        };
        return getTimeValue(a.createdAgo) - getTimeValue(b.createdAgo);
      });
    }

    return filtered;
  }, [activeCategory, isInterestOnly, sortBy]);

  const handlePostClick = (post: Post) => {
    console.log("게시글 클릭:", post.title);
    // TODO: 게시글 상세 페이지로 이동
  };

  const handleMenuAction = (
    action: "create_group" | "create_post",
    post: Post,
  ) => {
    console.log(`${action} 선택:`, post.title);
    // TODO: 모임 개설 또는 일반 게시글 작성 페이지로 이동
  };

  const handleNotificationClick = () => {
    console.log("알림 클릭");
    // TODO: 알림 페이지로 이동
  };

  if (postState === "loading") {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <CommunityHeader title="모임" />
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="flex gap-3">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (postState === "empty") {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <CommunityHeader
          title="모임"
          onNotificationClick={handleNotificationClick}
        />
        <CommunityFilters
          activeCategory={activeCategory}
          isInterestOnly={isInterestOnly}
          sortBy={sortBy}
          onCategoryChange={setActiveCategory}
          onInterestToggle={() => setIsInterestOnly(!isInterestOnly)}
          onSortChange={setSortBy}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            아직 등록된 모임이 없어요
          </h3>
          <p className="text-gray-500 mb-6">
            우리 동네 첫 번째 모임을 만들어보세요!
          </p>
          <button className="px-6 py-3 bg-[#2ECC71] text-white font-semibold rounded-full hover:bg-[#27AE60] transition-colors">
            모임 개설하기
          </button>
        </div>
        <FloatingActionButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* 헤더 */}
      <CommunityHeader
        title="모임"
        onNotificationClick={handleNotificationClick}
      />

      {/* 필터 */}
      <CommunityFilters
        activeCategory={activeCategory}
        isInterestOnly={isInterestOnly}
        sortBy={sortBy}
        onCategoryChange={setActiveCategory}
        onInterestToggle={() => setIsInterestOnly(!isInterestOnly)}
        onSortChange={setSortBy}
      />

      {/* 피드 */}
      <div id="main-content" className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 pb-24">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={handlePostClick}
              onMenuAction={handleMenuAction}
            />
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">해당 조건의 모임이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButton />
    </div>
  );
}
