"use client";

import React, { useState, useRef, useEffect } from "react";
import { useBottomSheet } from "@/components/providers/BottomSheetProvider";

export const GlobalBottomSheet: React.FC = () => {
  const { isOpen, content, config, closeBottomSheet } = useBottomSheet();
  const [currentHeight, setCurrentHeight] = useState(
    config.defaultHeight || "30%",
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Update height when config changes
  useEffect(() => {
    setCurrentHeight(config.defaultHeight || "30%");
  }, [config.defaultHeight]);

  const convertPercentToPixels = (percent: string): number => {
    const value = parseFloat(percent);
    // MobileLayout의 고정 높이 852px 기준으로 계산
    return (value / 100) * 852;
  };

  const convertPixelsToPercent = (pixels: number): string => {
    // MobileLayout의 고정 높이 852px 기준으로 계산
    return `${(pixels / 852) * 100}%`;
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

    const minHeightPixels = convertPercentToPixels(config.minHeight || "15%");
    const maxHeightPixels = convertPercentToPixels(config.maxHeight || "90%");

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

  const handleEnd = () => {
    setIsDragging(false);

    // Auto-close if dragged below minimum threshold
    const minThreshold = convertPercentToPixels("10%");
    const currentHeightPixels = convertPercentToPixels(currentHeight);

    if (currentHeightPixels < minThreshold) {
      closeBottomSheet();
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e: MouseEvent) => {
        e.preventDefault();
        handleMove(e.clientY);
      };

      const handleMouseUpGlobal = (e: MouseEvent) => {
        e.preventDefault();
        handleEnd();
      };

      // document가 아닌 window에 이벤트를 등록하여 화면 경계를 넘어서도 추적
      window.addEventListener("mousemove", handleMouseMoveGlobal, {
        capture: true,
      });
      window.addEventListener("mouseup", handleMouseUpGlobal, {
        capture: true,
      });
      // 마우스가 window를 벗어나거나 다시 들어와도 계속 추적
      window.addEventListener("mouseout", handleMouseMoveGlobal, {
        capture: true,
      });
      window.addEventListener("mouseover", handleMouseMoveGlobal, {
        capture: true,
      });

      return () => {
        window.removeEventListener("mousemove", handleMouseMoveGlobal, {
          capture: true,
        });
        window.removeEventListener("mouseup", handleMouseUpGlobal, {
          capture: true,
        });
        window.removeEventListener("mouseout", handleMouseMoveGlobal, {
          capture: true,
        });
        window.removeEventListener("mouseover", handleMouseMoveGlobal, {
          capture: true,
        });
      };
    }
  }, [isDragging, dragStartY, initialHeight]);

  // Handle overlay click to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeBottomSheet();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-50 bg-black/20 rounded-3xl overflow-hidden"
      onClick={handleOverlayClick}
    >
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg transition-all duration-200"
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
        <div className="px-6 pt-8 pb-20 h-full overflow-y-auto">{content}</div>
      </div>
    </div>
  );
};
