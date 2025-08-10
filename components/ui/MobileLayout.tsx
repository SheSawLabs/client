"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { NavigationBar } from "./NavigationBar";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

// NavigationBar를 숨길 경로들
const hideNavBarPaths = ["/community/create"];

export function MobileLayout({ children, className }: MobileLayoutProps) {
  const pathname = usePathname();
  const shouldHideNavBar = hideNavBarPaths.some((path) =>
    pathname.startsWith(path),
  );

  return (
    <div className="min-h-screen bg-gray-500/20 flex items-center justify-center p-4">
      <div className="w-full max-w-[393px] h-[852px] bg-white shadow-2xl rounded-3xl overflow-hidden relative">
        <div
          className={cn("flex flex-col h-full overflow-y-auto pt-2", className)}
        >
          {children}
          {!shouldHideNavBar && <NavigationBar />}
        </div>
      </div>
    </div>
  );
}
