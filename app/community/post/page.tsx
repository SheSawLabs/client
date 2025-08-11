"use client";

import { useState, useEffect } from "react";
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
import { mockPosts } from "@/data/mockPosts";
import { mockComments } from "@/data/mockComments";

export default function PostDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [post, setPost] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [isParticipating, setIsParticipating] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const id = searchParams.get("id");
    const foundPost = mockPosts.find((p) => p.id === id);
    if (foundPost) {
      setPost({
        ...foundPost,
        content: foundPost.excerpt,
        liked: false,
      });

      // 더미 댓글 데이터 설정
      setComments(mockComments);
    }
  }, [searchParams]);

  const handleBack = () => {
    router.back();
  };

  const handleLikePost = () => {
    if (!post) return;
    setPost((prev) => ({
      ...prev,
      liked: !prev.liked,
      stats: {
        ...prev.stats,
        likes: prev.liked ? prev.stats.likes - 1 : prev.stats.likes + 1,
      },
    }));
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentInput("");
  };

  const handleParticipationToggle = () => {
    setIsParticipating(!isParticipating);
  };

  if (!post) {
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
      <header className="flex items-center justify-between h-14 px-8 bg-white">
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
        <div className="px-8 pt-4">
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
              {post.participants && (
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-gray-500" />
                  <span className="text-xs text-gray-600">
                    {post.participants.current}/{post.participants.max}
                  </span>
                </div>
              )}

              {/* 카테고리 배지 */}
              <div className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg">
                {post.category}
              </div>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-lg font-bold text-gray-900 mt-4 mb-2">
            {post.title}
          </h1>

          {/* 본문 */}
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mb-12">
            {post.content}
          </div>

          {/* 모임 정보 (일반 게시글이 아닌 경우) */}
          {post.category !== "일반" && (
            <div className="mb-12 space-y-2">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">8월 15일 오후 7시</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {post.region} 근처
                </span>
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
                onClick={handleLikePost}
                className="flex items-center gap-1"
              >
                <Heart
                  size={16}
                  className={cn(
                    "text-gray-500",
                    post.liked && "text-red-500 fill-red-500",
                  )}
                />
                <span className="text-sm text-gray-500">
                  {post.stats.likes}
                </span>
              </button>
            </div>

            {/* 참여하기/나가기 버튼 (모임 게시글인 경우) */}
            {post.category !== "일반" && (
              <button
                onClick={handleParticipationToggle}
                className="px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700"
              >
                {isParticipating ? "모임 나가기" : "참여하기"}
              </button>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t-4 border-gray-200 mt-6"></div>

        {/* 댓글 섹션 */}
        <div className="px-8">
          {/* 댓글 헤더 */}
          <div className="flex items-center justify-between py-6">
            <span className="text-sm font-medium text-gray-900">
              댓글 {post.stats.comments}
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
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  {/* 댓글 작성자 정보 */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {comment.author.nickname.charAt(0)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {comment.author.nickname}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment.createdAt} · {comment.author.location}
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
                      <Heart
                        size={12}
                        className={cn(
                          "text-gray-500",
                          comment.liked && "text-red-500 fill-red-500",
                        )}
                      />
                      <span className="text-xs text-gray-500">
                        {comment.likes}
                      </span>
                    </button>
                    <button className="flex items-center gap-1">
                      <MessageCircle size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {comment.repliesCount}
                      </span>
                    </button>
                  </div>

                  {/* 대댓글 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-11 mt-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="space-y-2">
                          {/* 대댓글 작성자 정보 */}
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {reply.author.nickname.charAt(0)}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-700">
                                {reply.author.nickname}
                              </span>
                              <span className="text-xs text-gray-500">
                                {reply.createdAt} · {reply.author.location}
                              </span>
                            </div>
                          </div>

                          {/* 대댓글 내용 */}
                          <div className="text-sm text-gray-600 leading-relaxed pl-10">
                            {reply.content}
                          </div>

                          {/* 대댓글 메타 정보 */}
                          <div className="flex items-center gap-4 pl-10">
                            <button className="flex items-center gap-1">
                              <Heart
                                size={10}
                                className={cn(
                                  "text-gray-500",
                                  reply.liked && "text-red-500 fill-red-500",
                                )}
                              />
                              <span className="text-xs text-gray-500">
                                {reply.likes}
                              </span>
                            </button>
                            <button className="flex items-center gap-1">
                              <MessageCircle
                                size={10}
                                className="text-gray-500"
                              />
                              <span className="text-xs text-gray-500">
                                {reply.repliesCount}
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                댓글이 없습니다. 첫 댓글을 작성해보세요!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 댓글 입력창 */}
      <div className="px-8 py-6 flex-shrink-0">
        <form onSubmit={handleSubmitComment}>
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글 쓰기…"
            className="w-full h-12 px-6 text-sm bg-gray-200 rounded-full border-none outline-none placeholder-gray-600 text-gray-800"
          />
        </form>
      </div>
    </div>
  );
}
