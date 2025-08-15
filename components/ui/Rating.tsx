import React, { useState, useRef } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  showNumber?: boolean;
  className?: string;
  isEditable?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  showNumber = true,
  className = "",
  isEditable = false,
  onRatingChange,
}) => {
  const starColor = "#DB253A";
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayRating = Math.round(rating * 10) / 10; // 소숫점 1자리까지 반올림
  const currentRating = hoverRating !== null ? hoverRating : rating;

  // 마우스 위치를 기반으로 별점 계산 (0.5 단위)
  const calculateRating = (clientX: number): number => {
    if (!containerRef.current) return rating;

    const rect = containerRef.current.getBoundingClientRect();
    const starWidth = rect.width / 5;
    const relativeX = clientX - rect.left;
    const starIndex = Math.floor(relativeX / starWidth);
    const starProgress = (relativeX % starWidth) / starWidth;

    let newRating = starIndex + 1;
    if (starProgress < 0.5) {
      newRating -= 0.5;
    }

    return Math.max(0.5, Math.min(5, newRating));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isEditable) return;

    const newRating = calculateRating(e.clientX);
    setHoverRating(newRating);

    if (isDragging && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;

    setIsDragging(true);
    const newRating = calculateRating(e.clientX);
    onRatingChange?.(newRating);
  };

  const handleMouseUp = () => {
    if (!isEditable) return;
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (!isEditable) return;
    setHoverRating(null);
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditable) return;

    const newRating = calculateRating(e.clientX);
    onRatingChange?.(newRating);
  };

  // 별의 채우기 상태 계산 (전체, 반, 빈 별)
  const getStarFill = (starIndex: number): "full" | "half" | "empty" => {
    const starValue = starIndex + 1;
    if (currentRating >= starValue) {
      return "full";
    } else if (currentRating >= starValue - 0.5) {
      return "half";
    } else {
      return "empty";
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showNumber && (
        <span className="text-xl font-bold text-black">{displayRating}</span>
      )}
      <div
        ref={containerRef}
        className={`flex items-center gap-1 ${isEditable ? "cursor-pointer" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ userSelect: "none" }}
      >
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fillType = getStarFill(starIndex);

          return (
            <div key={starIndex} className="relative w-8 h-8">
              {/* 배경 별 (빈 별) */}
              <Star
                className="absolute inset-0 w-8 h-8"
                style={{
                  color: starColor,
                  fill: "transparent",
                }}
              />

              {/* 채워진 별 */}
              {fillType === "full" && (
                <Star
                  className="absolute inset-0 w-8 h-8"
                  style={{
                    color: starColor,
                    fill: starColor,
                  }}
                />
              )}

              {/* 반 별 */}
              {fillType === "half" && (
                <div className="absolute inset-0 w-8 h-8 overflow-hidden">
                  <Star
                    className="absolute inset-0 w-8 h-8"
                    style={{
                      color: starColor,
                      fill: starColor,
                      clipPath: "inset(0 50% 0 0)",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
