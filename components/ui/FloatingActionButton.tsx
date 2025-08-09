"use client";

import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

interface FloatingActionButtonProps {
  onClick?: () => void;
  href?: string;
  className?: string;
  "aria-label"?: string;
}

export function FloatingActionButton({
  onClick,
  href = "/community/groups/create",
  className,
  "aria-label": ariaLabel = "글쓰기",
}: FloatingActionButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "absolute bottom-20 right-4 z-30",
        "flex items-center justify-center w-14 h-14",
        "bg-[#2ECC71] hover:bg-[#27AE60] active:bg-[#229954]",
        "text-white rounded-full shadow-lg hover:shadow-xl",
        "transition-all duration-200 ease-out",
        "transform hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:ring-offset-2 focus:ring-offset-white",
        className,
      )}
      aria-label={ariaLabel}
    >
      <Pen size={20} className="stroke-2" />
    </button>
  );
}
