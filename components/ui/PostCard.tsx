"use client";

import { useState } from "react";
import { Eye, MessageCircle, Heart, MoreVertical } from "lucide-react";
import { cn } from "@/utils/cn";
import { Post } from "@/types/community";

interface PostCardProps {
  post: Post;
  onClick?: (post: Post) => void;
  onMenuAction?: (action: "create_group" | "create_post", post: Post) => void;
  className?: string;
}

export function PostCard({
  post,
  onClick,
  onMenuAction,
  className,
}: PostCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (e.target instanceof Element && e.target.closest("[data-menu]")) {
      return;
    }
    onClick?.(post);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuAction = (action: "create_group" | "create_post") => {
    setIsMenuOpen(false);
    onMenuAction?.(action, post);
  };

  const getBadgeStyles = (tone: Post["badge"]["tone"]) => {
    switch (tone) {
      case "success":
        return "bg-[#2ECC71]/10 text-[#2ECC71]";
      case "secondary":
        return "bg-blue-50 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getAuthorInitial = (name: string) => {
    return name.charAt(0);
  };

  return (
    <article
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer transition-all duration-200",
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
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span>{post.createdAgo}</span>
          <span>·</span>
          <span>{post.region}</span>
        </div>

        <div className="flex items-center gap-2">
          {post.badge && (
            <span
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                getBadgeStyles(post.badge.tone),
              )}
            >
              {post.badge.label}
            </span>
          )}

          {/* 메뉴 버튼 */}
          <div className="relative" data-menu>
            <button
              onClick={handleMenuClick}
              className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="게시글 메뉴"
              aria-expanded={isMenuOpen}
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
                  <button
                    onClick={() => handleMenuAction("create_group")}
                    className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    모임 개설
                  </button>
                  <button
                    onClick={() => handleMenuAction("create_post")}
                    className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    일반 게시글
                  </button>
                </div>
              </>
            )}
          </div>
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
          <span className="text-sm text-gray-500">by</span>
          <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
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
          <span className="text-sm text-gray-500">{post.author.name}</span>
        </div>

        {/* 지표 아이콘 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Eye size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">{post.stats.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">{post.stats.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">{post.stats.likes}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
