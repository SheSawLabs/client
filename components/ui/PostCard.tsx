"use client";

import { Eye, MessageCircle, Heart, Users } from "lucide-react";
import { cn } from "@/utils/cn";
import { Post } from "@/types/community";

interface PostCardProps {
  post: Post;
  onClick?: (post: Post) => void;
  className?: string;
}

export function PostCard({ post, onClick, className }: PostCardProps) {
  const handleCardClick = () => {
    onClick?.(post);
  };

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
        return "bg-[#E3F2FD] text-[#1976D2] border border-[#1976D2] hover:bg-[#BBDEFB]";
      case "소분":
        return "bg-[#F3E5F5] text-[#BC76CE] border border-[#BC76CE] hover:bg-[#E1BEE7]";
      case "취미":
        return "bg-[#FFF3E0] text-[#FF7E00] border border-[#FF7E00] hover:bg-[#FFE0B2]";
      case "일반":
      default:
        return "bg-[#F2F4F6] text-[#374151] border border-[#374151] hover:bg-[#E5E7EB]";
    }
  };

  const getAuthorInitial = (name: string) => {
    return name.charAt(0);
  };

  return (
    <article
      className={cn(
        "bg-[#F8F8F8] rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]",
        className,
      )}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick(e as React.MouseEvent);
        }
      }}
      aria-label={`게시글: ${post.title}`}
    >
      {/* 상단 메타 라인 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{post.createdAgo}</span>
          {post.category !== "일반" && (
            <>
              <span>·</span>
              <span>{post.region}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* 모집 인원 (일반 제외 모든 카테고리) */}
          {post.participants && post.category !== "일반" && (
            <div className="flex items-center gap-1">
              <Users size={12} className="text-gray-500" />
              <span className="text-[11px] text-gray-600">
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
      <h3 className="text-base font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">
        {post.title}
      </h3>

      {/* 본문 프리뷰 */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
        {post.excerpt}
      </p>

      {/* 하단 라인 */}
      <div className="flex items-center justify-between">
        {/* 작성자 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">by</span>
          <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full text-[10px] font-medium text-gray-600">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getAuthorInitial(post.author.name)
            )}
          </div>
          <span className="text-xs text-gray-500">{post.author.name}</span>
        </div>

        {/* 지표 아이콘 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Eye size={12} className="text-gray-400" />
            <span className="text-[11px] text-gray-500">
              {post.stats.views}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={12} className="text-gray-400" />
            <span className="text-[11px] text-gray-500">
              {post.stats.comments}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={12} className="text-gray-400" />
            <span className="text-[11px] text-gray-500">
              {post.stats.likes}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
