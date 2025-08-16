"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  usePostQuery,
  useCommentsQuery,
  useCreateCommentMutation,
  useParticipantStatusQuery,
  useToggleLikeMutation,
  useLikeStatusQuery,
} from "@/app/queries/community";
import { usePostSettlementQuery } from "@/app/queries/settlement";

export default function PostDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [commentInput, setCommentInput] = useState("");
  const [isParticipating, setIsParticipating] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "안전":
      case "수리":
        return "안전 수리";
      case "소분":
        return "소분 모임";
      case "취미":
        return "취미·기타";
      case "일반":
        return "일반";
      default:
        return category;
    }
  };

  const getBadgeStyles = (category: string) => {
    switch (category) {
      case "안전":
      case "수리":
        return "bg-[#F0F8E8] text-[#519913] border border-[#519913] hover:bg-[#E8F5E8]";
      case "소분":
        return "bg-[#F3E5F5] text-[#BC76CE] border border-[#BC76CE] hover:bg-[#E1BEE7]";
      case "취미":
        return "bg-[#FFF3E0] text-[#FF7E00] border border-[#FF7E00] hover:bg-[#FFE0B2]";
      case "일반":
      default:
        return "bg-[#F2F4F6] text-[#374151] border border-[#374151] hover:bg-[#E5E7EB]";
    }
  };

  const postId = searchParams.get("id");
  const { data: post, isLoading, error } = usePostQuery(postId || "");
  const { data: participantStatus } = useParticipantStatusQuery(postId || "");
  const { data: likeStatus, error: likeError } = useLikeStatusQuery(
    postId || "",
  );
  const { data: settlementData } = usePostSettlementQuery(postId || "");

  // 디버깅용 로그
  if (likeError) {
    console.error("Like status error:", likeError);
  }
  const toggleLikeMutation = useToggleLikeMutation();

  // 일반 게시글이거나 작성자이거나 참가자인 경우에만 댓글 조회
  const canViewComments =
    !post ||
    post.category === "일반" ||
    participantStatus?.isAuthor ||
    participantStatus?.isParticipant;

  const { data: comments = [], isLoading: commentsLoading } = useCommentsQuery(
    postId || "",
    {
      enabled: canViewComments,
    },
  );

  const createCommentMutation = useCreateCommentMutation();

  const handleBack = () => {
    router.back();
  };

  const handleLikePost = () => {
    if (!postId) return;
    console.log("Attempting to like post:", postId);
    toggleLikeMutation.mutate(postId, {
      onSuccess: (data) => {
        console.log("Like success:", data);
      },
      onError: (error) => {
        console.error("Like error:", error);
      },
    });
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !postId) return;

    createCommentMutation.mutate(
      { postId, content: commentInput.trim() },
      {
        onSuccess: () => {
          setCommentInput("");
        },
        onError: (error) => {
          console.error("댓글 작성 실패:", error);
          alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  const handleParticipationToggle = () => {
    setIsParticipating(!isParticipating);
  };

  // 날짜 포맷팅 함수 (예: "8월 15일")
  const formatMeetingDate = (dateString?: string) => {
    if (!dateString) return "날짜 미정";

    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}월 ${day}일`;
    } catch {
      return "날짜 미정";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white">
          <button onClick={handleBack} aria-label="뒤로가기">
            <ChevronLeft size={20} className="text-gray-900" />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white">
          <button onClick={handleBack} aria-label="뒤로가기">
            <ChevronLeft size={20} className="text-gray-900" />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between h-14 px-6 bg-white">
        <button
          onClick={handleBack}
          className="flex items-center justify-center"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={20} className="text-gray-900" />
        </button>
        <div className="flex-1" />
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 게시글 정보 영역 */}
        <div className="px-6 pt-4">
          {/* 작성자 정보 행 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {post.author.name.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {post.author.name}
                </span>
                <span className="text-xs text-gray-500">
                  {post.createdAgo} · {post.region}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* 모집 인원 (일반 제외 모든 카테고리) */}
              {post.participants && post.category !== "일반" && (
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-gray-500" />
                  <span className="text-xs text-gray-600">
                    {post.participants.current}/{post.participants.max}
                  </span>
                </div>
              )}

              {/* 카테고리 배지 */}
              <span
                className={cn(
                  "px-2 py-0.5 text-[11px] font-medium rounded-lg transition-colors duration-200",
                  getBadgeStyles(post.category),
                )}
              >
                {getCategoryLabel(post.category)}
              </span>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-lg font-bold text-gray-900 mt-4 mb-2">
            {post.title}
          </h1>

          {/* 본문 */}
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mb-12">
            {post.excerpt}
          </div>

          {/* 모임 정보 (일반 게시글이 아닌 경우) */}
          {post.category !== "일반" && (
            <div className="mb-12 space-y-2">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {formatMeetingDate(post.date)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{post.region}</span>
              </div>
            </div>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye size={16} className="text-gray-500" />
                <span className="text-sm text-gray-500">
                  {post.stats.views}
                </span>
              </div>
              <button
                onClick={() => {
                  console.log("Heart button clicked!");
                  handleLikePost();
                }}
                className="flex items-center gap-1"
                disabled={toggleLikeMutation.isPending}
              >
                <Heart
                  size={16}
                  className={cn(
                    "text-gray-500",
                    likeStatus?.liked && "text-red-500 fill-red-500",
                  )}
                />
                <span className="text-sm text-gray-500">
                  {likeStatus?.like_count ?? post.stats.likes ?? 0}
                </span>
              </button>
            </div>

            {/* 참여하기/나가기 버튼 또는 모임 관리 버튼 (모임 게시글인 경우) */}
            {post.category !== "일반" && (
              <>
                {participantStatus?.isAuthor ? (
                  // 본인이 만든 모임인 경우
                  <div className="flex gap-2">
                    {settlementData?.hasSettlement ? (
                      // 정산 요청이 있는 경우
                      <button
                        onClick={() =>
                          router.push(
                            `/community/settlement-history?title=${encodeURIComponent(post.title)}&postId=${postId}`,
                          )
                        }
                        className="px-2.5 py-1 bg-[#EEF4FF] text-[#017BFF] border border-[#017BFF] text-xs font-medium rounded hover:bg-blue-50"
                      >
                        1/N 정산 내역
                      </button>
                    ) : (
                      // 정산 요청이 없는 경우
                      <button
                        onClick={() =>
                          router.push(
                            `/community/settlement-request?title=${encodeURIComponent(post.title)}&postId=${postId}`,
                          )
                        }
                        className="px-2.5 py-1 bg-[#EEF4FF] text-[#017BFF] border border-[#017BFF] text-xs font-medium rounded hover:bg-blue-50"
                      >
                        1/N 요청하기
                      </button>
                    )}
                    <button className="px-2.5 py-1 bg-[#017BFF] text-white text-xs font-medium rounded hover:bg-[#0056CC]">
                      모임 닫기
                    </button>
                  </div>
                ) : (
                  // 다른 사람이 만든 모임인 경우
                  <button
                    onClick={handleParticipationToggle}
                    className="px-2.5 py-1 bg-[#017BFF] text-white text-xs font-medium rounded hover:bg-[#0056CC]"
                  >
                    {isParticipating ? "모임 나가기" : "참여하기"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t-4 border-gray-200 mt-6"></div>

        {/* 댓글 섹션 */}
        <div className="px-6">
          {canViewComments ? (
            <>
              {/* 댓글 헤더 */}
              <div className="flex items-center justify-between py-6">
                <span className="text-sm font-medium text-gray-900">
                  댓글 {comments.length}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSortOrder("oldest")}
                    className={cn(
                      "text-xs",
                      sortOrder === "oldest"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-500",
                    )}
                  >
                    {sortOrder === "oldest" && (
                      <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mr-1" />
                    )}
                    등록순
                  </button>
                  <button
                    onClick={() => setSortOrder("newest")}
                    className={cn(
                      "text-xs",
                      sortOrder === "newest"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-500",
                    )}
                  >
                    {sortOrder === "newest" && (
                      <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mr-1" />
                    )}
                    최신순
                  </button>
                </div>
              </div>

              {/* 댓글 리스트 */}
              <div className="space-y-4">
                {commentsLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    댓글을 불러오는 중...
                  </div>
                ) : comments.length > 0 ? (
                  [...comments]
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at).getTime();
                      const dateB = new Date(b.created_at).getTime();
                      return sortOrder === "oldest"
                        ? dateA - dateB
                        : dateB - dateA;
                    })
                    .map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        {/* 댓글 작성자 정보 */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              익
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">
                              익명
                            </span>
                            <span className="text-xs text-gray-500">
                              {(() => {
                                const date = new Date(comment.created_at);
                                const now = new Date();
                                const diffInHours = Math.floor(
                                  (now.getTime() - date.getTime()) /
                                    (1000 * 60 * 60),
                                );

                                if (diffInHours < 1) return "방금 전";
                                if (diffInHours < 24)
                                  return `${diffInHours}시간 전`;

                                const diffInDays = Math.floor(diffInHours / 24);
                                if (diffInDays < 7) return `${diffInDays}일 전`;

                                return date.toLocaleDateString();
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* 댓글 내용 */}
                        <div className="text-sm text-gray-600 leading-relaxed pl-11">
                          {comment.content}
                        </div>

                        {/* 댓글 메타 정보 */}
                        <div className="flex items-center gap-4 pl-11">
                          <button className="flex items-center gap-1">
                            <Heart size={12} className="text-gray-500" />
                            <span className="text-xs text-gray-500">0</span>
                          </button>
                          <button className="flex items-center gap-1">
                            <MessageCircle
                              size={12}
                              className="text-gray-500"
                            />
                            <span className="text-xs text-gray-500">0</span>
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div>댓글이 없습니다.</div>
                    <div>첫 댓글을 작성해보세요!</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm text-gray-500">
                모임에 참여하시면 댓글을 보실 수 있습니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 댓글 입력창 */}
      {canViewComments && (
        <div className="px-6 py-6 flex-shrink-0">
          <form onSubmit={handleSubmitComment}>
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={
                createCommentMutation.isPending
                  ? "댓글 작성 중..."
                  : "댓글 쓰기…"
              }
              disabled={createCommentMutation.isPending}
              className="w-full h-12 px-6 text-sm bg-gray-200 rounded-full border-none outline-none placeholder-gray-600 text-gray-800 disabled:opacity-50"
            />
          </form>
        </div>
      )}
    </div>
  );
}
