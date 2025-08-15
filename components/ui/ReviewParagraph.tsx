import React, { useState, useCallback } from "react";
import { Edit } from "lucide-react";
import { COLORS } from "@/constants";
import { Typography } from "./Typography";

interface ReviewParagraphProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ReviewParagraph: React.FC<ReviewParagraphProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 500;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (newValue.length <= maxLength) {
        onChange(newValue);
      }
    },
    [onChange, maxLength],
  );

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const showPlaceholder = !value && !isFocused;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 섹션 제목 */}
      <Typography variant="label">
        동네에 대한 인상을 작성해주세요. (선택)
      </Typography>

      {/* 텍스트 영역 */}
      <div
        className="relative border rounded-lg p-4 min-h-[120px] bg-white"
        style={{ borderColor: COLORS.GRAY_200 }}
      >
        {showPlaceholder && (
          <div className="absolute inset-4 pointer-events-none space-y-2">
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4" style={{ color: COLORS.GRAY_400 }} />
              <span className="text-sm" style={{ color: COLORS.GRAY_400 }}>
                리뷰를 작성해주세요
              </span>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: COLORS.GRAY_400 }}
            >
              동네 리뷰 작성 시 유의사항 한 번 확인하기! 욕설, 비방, 사실이 아닌
              동네리뷰는 다른 이웃에게 불편함을 줄 수 있어요.
            </p>
          </div>
        )}

        <textarea
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full h-full min-h-[80px] resize-none border-none outline-none bg-transparent text-sm"
          style={{ color: COLORS.GRAY_800 }}
          placeholder=""
        />

        {/* 글자수 카운터 */}
        <div className="absolute bottom-3 right-3">
          <span className="text-xs" style={{ color: COLORS.GRAY_400 }}>
            {value.length}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
};
