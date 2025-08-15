import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/utils/cn";

export interface TopNavProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showNotification?: boolean;
  onNotificationClick?: () => void;
  className?: string;
}

const TopNav = React.forwardRef<HTMLDivElement, TopNavProps>(
  (
    {
      title = "마이페이지",
      showBackButton = true,
      onBackClick,
      showNotification = true,
      onNotificationClick,
      className,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white flex items-center justify-between p-4 w-full h-12",
          className,
        )}
      >
        {/* Left side - Back button */}
        <div className="flex items-center">
          {showBackButton ? (
            <button
              onClick={onBackClick}
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="뒤로가기"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>

        {/* Center - Title */}
        <h1 className="text-lg font-semibold text-gray-900 text-center flex-1">
          {title}
        </h1>

        {/* Right side - Notification */}
        <div className="flex items-center">
          {showNotification ? (
            <button
              onClick={onNotificationClick}
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="알림"
            >
              <img src="/icons/bell.svg" alt="알림" className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>
      </div>
    );
  },
);

TopNav.displayName = "TopNav";

export { TopNav };
