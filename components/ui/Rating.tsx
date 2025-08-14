import React from "react";
import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  showNumber?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  showNumber = true,
  className = "",
}) => {
  const starColor = "#DB253A";
  const roundedRating = Math.round(rating);
  const displayRating = Math.round(rating * 10) / 10; // 소숫점 1자리까지 반올림

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showNumber && (
        <span className="text-xl font-bold text-black">{displayRating}</span>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-5 h-5"
            style={{
              color: starColor,
              fill: star <= roundedRating ? starColor : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
};
