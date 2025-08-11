"use client";

import React, { useState, useRef, useEffect } from "react";

interface BottomSheetProps {
  children: React.ReactNode;
  defaultHeight?: string; // 기본 높이 (예: "30%")
  minHeight?: string; // 최소 높이
  maxHeight?: string; // 최대 높이
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  defaultHeight = "30%",
  minHeight = "15%",
  maxHeight = "90%",
  className = "",
}) => {
  const [currentHeight, setCurrentHeight] = useState(defaultHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const convertPercentToPixels = (percent: string): number => {
    const value = parseFloat(percent);
    return (value / 100) * window.innerHeight;
  };

  const convertPixelsToPercent = (pixels: number): string => {
    return `${(pixels / window.innerHeight) * 100}%`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
    setInitialHeight(convertPercentToPixels(currentHeight));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
    setInitialHeight(convertPercentToPixels(currentHeight));
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = dragStartY - clientY;
    const newHeightPixels = initialHeight + deltaY;

    const minHeightPixels = convertPercentToPixels(minHeight);
    const maxHeightPixels = convertPercentToPixels(maxHeight);

    const clampedHeight = Math.max(
      minHeightPixels,
      Math.min(maxHeightPixels, newHeightPixels),
    );

    setCurrentHeight(convertPixelsToPercent(clampedHeight));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
      };
    }
  }, [isDragging, dragStartY, initialHeight]);

  return (
    <div
      ref={sheetRef}
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-50 transition-all duration-200 ${className}`}
      style={{ height: currentHeight }}
    >
      {/* 드래그 핸들 */}
      <div
        className="flex justify-center pt-2 pb-2 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="px-6 pt-8 pb-6 h-full overflow-y-auto">{children}</div>
    </div>
  );
};
