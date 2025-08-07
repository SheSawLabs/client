"use client";

import { cn } from "@/utils/cn";
import { PropsWithChildren } from "react";

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
}

interface NavigationBarProps {
  items: NavigationItem[];
  activeItem: string;
  onItemClick?: (item: NavigationItem) => void;
  className?: string;
}

export function NavigationBar({
  items,
  activeItem,
  onItemClick,
  className,
  children,
}: PropsWithChildren<NavigationBarProps>) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50",
        className,
      )}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {items?.map((item) => {
          const isActive = item.id === activeItem;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="flex flex-col items-center gap-1 min-w-0 flex-1"
            >
              <div
                className={cn(
                  "w-6 h-6 transition-colors duration-200",
                  isActive ? "text-gray-800" : "text-gray-400",
                )}
              >
                <svg
                  width="24"
                  height="24"
                  className="w-full h-full"
                  style={{
                    filter: isActive
                      ? "none"
                      : "brightness(0) saturate(100%) invert(71%) sepia(8%) saturate(290%) hue-rotate(202deg) brightness(93%) contrast(87%)",
                  }}
                >
                  <use href={`${item.icon}#main`} />
                </svg>
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-gray-800" : "text-gray-400",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      {children}
    </nav>
  );
}
