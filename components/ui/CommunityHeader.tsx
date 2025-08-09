"use client";

import { ChevronLeft, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

interface CommunityHeaderProps {
  title: string;
  className?: string;
  onBackClick?: () => void;
  onNotificationClick?: () => void;
}

export function CommunityHeader({
  title,
  className,
  onBackClick,
  onNotificationClick,
}: CommunityHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-[#2ECC71] text-white px-4 py-2 rounded-md font-medium"
      >
        메인 콘텐츠로 건너뛰기
      </a>
      <header
        className={cn(
          "sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100",
          className,
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 h-14">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-50 transition-colors"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>

          <button
            onClick={handleNotificationClick}
            className="flex items-center justify-center w-10 h-10 -mr-2 rounded-full hover:bg-gray-50 transition-colors"
            aria-label="알림"
          >
            <Bell size={20} className="text-gray-700" />
          </button>
        </div>
      </header>
    </>
  );
}
