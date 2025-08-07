"use client";

import { cn } from "@/utils/cn";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

interface NavigationBarProps {
  className?: string;
}

const navigationItems: NavigationItem[] = [
  { id: "home", label: "홈", icon: "/icons/home.svg", href: "/" },
  { id: "map", label: "동네 안전", icon: "/icons/map.svg", href: "/map" },
  { id: "info", label: "정책 정보", icon: "/icons/paper.svg", href: "/info" },
  {
    id: "community",
    label: "커뮤니티",
    icon: "/icons/people.svg",
    href: "/community",
  },
];

export function NavigationBar({ className }: NavigationBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleItemClick = (item: NavigationItem) => {
    router.push(item.href);
  };

  return (
    <nav
      className={cn(
        "absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50",
        className,
      )}
    >
      <div className="flex justify-around items-center">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="flex flex-col items-center gap-1 min-w-0 flex-1"
            >
              <div className="w-6 h-6 relative">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className={cn(
                    "w-full h-full transition-all duration-200",
                    isActive ? "opacity-100" : "opacity-40",
                  )}
                  style={{
                    filter: isActive
                      ? "brightness(0) saturate(100%) invert(31%) sepia(11%) saturate(297%) hue-rotate(167deg) brightness(92%) contrast(96%)" // 진회색 (#4A4A4A)
                      : "brightness(0) saturate(100%) invert(71%) sepia(8%) saturate(290%) hue-rotate(202deg) brightness(93%) contrast(87%)", // 밝은회색 (#9CA3AF)
                  }}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-gray-700" : "text-gray-400",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
