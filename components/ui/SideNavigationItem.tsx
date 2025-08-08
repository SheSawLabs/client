import * as React from "react";
import { cn } from "@/utils/cn";

const heartIcon =
  "http://localhost:3845/assets/004a2bb81cd82f7e81c75b0440075756eb6a4d04.svg";
const chevronIcon =
  "http://localhost:3845/assets/e787681bfe8ba0d95f637d6ca3e454441ddd9b8a.svg";

export interface SideNavigationItemProps {
  text?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const SideNavigationItem = React.forwardRef<
  HTMLButtonElement,
  SideNavigationItemProps
>(({ text = "관심 목록", icon, onClick, className, children }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "relative w-full h-14 bg-white border-b border-gray-100 flex items-center px-4 hover:bg-gray-50 transition-colors duration-200",
        className,
      )}
    >
      {/* Left Icon */}
      <div className="flex items-center justify-center w-6 h-6 mr-4 flex-shrink-0">
        {children || icon || (
          <img
            src={heartIcon}
            alt=""
            className="w-full h-full"
            style={{
              filter:
                "invert(71%) sepia(8%) saturate(290%) hue-rotate(202deg) brightness(93%) contrast(87%)",
            }}
          />
        )}
      </div>

      {/* Text */}
      <span className="flex-1 text-left text-base font-normal text-gray-800 tracking-tight">
        {text}
      </span>

      {/* Right Chevron */}
      <div className="flex items-center justify-center w-5 h-5 ml-2 flex-shrink-0">
        <img
          src={chevronIcon}
          alt=""
          className="w-3.5 h-[7px] -rotate-90"
          style={{
            filter:
              "invert(71%) sepia(8%) saturate(290%) hue-rotate(202deg) brightness(93%) contrast(87%)",
          }}
        />
      </div>
    </button>
  );
});

SideNavigationItem.displayName = "SideNavigationItem";

export { SideNavigationItem };
