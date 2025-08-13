"use client";

import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface FloatingActionButtonProps {
  className?: string;
}

const menuItems = [
  { label: "모임 개설", href: "/community/create?type=group" },
  { label: "일반 게시글", href: "/community/create?type=post" },
];

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMenuOpen]);

  const handleButtonClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* FAB 버튼 */}
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={cn(
          "absolute bottom-20 right-4 z-30",
          "flex items-center justify-center w-14 h-14",
          "bg-[#0F5FDA1A] hover:bg-[#EEF4FF] active:bg-[#EEF4FF]",
          "text-[#0F5FDA] rounded-full shadow-lg hover:shadow-xl",
          "transition-all duration-200 ease-out",
          "transform hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-white",
          className,
        )}
        aria-label="글쓰기"
        aria-expanded={isMenuOpen}
      >
        <Pen size={20} className="stroke-2" />
      </button>

      {/* 팝오버 메뉴 */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className={cn(
            "absolute bottom-36 right-4 z-40 rounded-xl bg-white text-[#0F5FDA] shadow-md border border-gray-200",
            "animate-in fade-in-0 zoom-in-95 duration-150 ease-out",
          )}
          role="menu"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.href}
              onClick={() => handleMenuItemClick(item.href)}
              className={cn(
                "block w-full text-left px-4 py-3 min-h-[44px]",
                "text-sm font-normal text-[#0F5FDA]",
                "hover:bg-[#EEF4FF] hover:font-medium focus:bg-[#EEF4FF] focus:font-medium",
                "transition-all duration-200",
                "focus:outline-none",
                index === 0 ? "rounded-t-xl" : "",
                index === menuItems.length - 1 ? "rounded-b-xl" : "",
              )}
              role="menuitem"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
