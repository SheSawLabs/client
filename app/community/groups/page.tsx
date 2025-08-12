"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CommunityHeader } from "@/components/ui/CommunityHeader";
import { CommunityFilters } from "@/components/ui/CommunityFilters";
import { PostCard } from "@/components/ui/PostCard";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { usePostsQuery } from "@/app/queries/community";
import { Post, CategoryTab, SortOption } from "@/types/community";

export default function GroupsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] =
    useState<CategoryTab["key"]>("전체");
  const [isInterestOnly, setIsInterestOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption["value"]>("등록순");

  // 서버에서 데이터 가져오기
  const { data, isLoading, error } = usePostsQuery(
    activeCategory === "전체" ? undefined : activeCategory,
  );

  // URL 쿼리에서 정렬 상태 초기화
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam === "recent") {
      setSortBy("최신순");
    } else {
      setSortBy("등록순");
    }
  }, [searchParams]);

  // 정렬 변경 시 URL 업데이트
  const handleSortChange = (newSort: SortOption["value"]) => {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams);
    if (newSort === "최신순") {
      params.set("sort", "recent");
    } else {
      params.set("sort", "created");
    }
    router.replace(`/community/groups?${params.toString()}`);
  };

  // 필터링된 포스트 목록
  const filteredPosts = useMemo(() => {
    if (!data?.posts) return [];

    let filtered = [...data.posts];

    // 관심글 필터링 (사용자가 좋아요한 게시글)
    if (isInterestOnly) {
      filtered = filtered.filter((post) => post.is_liked);
    }

    // 정렬 - 실제 생성 시간을 기준으로 정렬
    filtered = filtered.sort((a, b) => {
      // _createdAt 속성을 사용하여 정렬
      const postA = a as Post & { _createdAt?: string };
      const postB = b as Post & { _createdAt?: string };

      if (!postA._createdAt || !postB._createdAt) return 0;

      const timeA = new Date(postA._createdAt).getTime();
      const timeB = new Date(postB._createdAt).getTime();

      // 최신순: 최근 생성된 것이 먼저 (내림차순)
      // 등록순: 먼저 생성된 것이 먼저 (오름차순)
      if (sortBy === "최신순") {
        return timeB - timeA;
      } else {
        return timeA - timeB;
      }
    });

    return filtered;
  }, [data?.posts, isInterestOnly, sortBy]);

  const handlePostClick = (post: Post) => {
    console.log("게시글 클릭:", post.title);
    router.push(`/community/post?id=${post.id}`);
  };

  const handleNotificationClick = () => {
    console.log("알림 클릭");
    // TODO: 알림 페이지로 이동
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <CommunityHeader title="커뮤니티" />
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <CommunityHeader title="커뮤니티" />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            데이터를 불러올 수 없습니다
          </h3>
          <p className="text-gray-500 mb-6">
            서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  if (!data?.posts || data.posts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <CommunityHeader
          title="커뮤니티"
          onNotificationClick={handleNotificationClick}
        />
        <CommunityFilters
          activeCategory={activeCategory}
          isInterestOnly={isInterestOnly}
          sortBy={sortBy}
          onCategoryChange={setActiveCategory}
          onInterestToggle={() => setIsInterestOnly(!isInterestOnly)}
          onSortChange={handleSortChange}
        />
        <div className="flex flex-col items-center p-8 text-center mt-32">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            아직 등록된 모임이 없어요
          </h3>
          <p className="text-gray-500">
            우리 동네 첫 번째 모임을 만들어보세요!
          </p>
        </div>
        <FloatingActionButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* 헤더 */}
      <CommunityHeader
        title="커뮤니티"
        onNotificationClick={handleNotificationClick}
      />

      {/* 필터 */}
      <CommunityFilters
        activeCategory={activeCategory}
        isInterestOnly={isInterestOnly}
        sortBy={sortBy}
        onCategoryChange={setActiveCategory}
        onInterestToggle={() => setIsInterestOnly(!isInterestOnly)}
        onSortChange={handleSortChange}
      />

      {/* 피드 */}
      <div id="main-content" className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 pb-24">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onClick={handlePostClick} />
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
