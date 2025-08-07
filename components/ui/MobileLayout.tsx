import { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { NavigationBar } from "./NavigationBar";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-500/20 flex items-center justify-center p-4">
      <div className="w-full max-w-[393px] h-[852px] bg-white shadow-2xl rounded-3xl overflow-hidden relative">
        <div className={cn("flex flex-col h-full overflow-y-auto", className)}>
          {children}
          <NavigationBar />
        </div>
      </div>
    </div>
  );
}
