import React, { useState, useCallback, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { Typography } from "./Typography";
import { ReviewKeywordSlider } from "./ReviewKeywordSlider";
import { ReviewParagraph } from "./ReviewParagraph";
import { Button } from "./Button";
import { Rating } from "./Rating";
import { COLORS } from "@/constants";
import {
  useReviewKeywordsQuery,
  useReviewSubmitMutation,
} from "@/queries/reviewForm";

interface SelectedKeyword {
  category: string;
  keyword: string;
}

interface ReviewFormProps {
  dongName: string;
  districtName?: string;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  dongName,
  districtName,
  onClose,
  onSuccess,
  className = "",
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState<SelectedKeyword[]>(
    [],
  );
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number>(4); // 기본값 4점

  const { data: keywordsData, isLoading: keywordsLoading } =
    useReviewKeywordsQuery();
  const submitMutation = useReviewSubmitMutation(districtName, dongName);

  // 키워드 선택/해제 핸들러
  const handleKeywordSelect = useCallback(
    (category: string, keyword: string) => {
      setSelectedKeywords((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.category === category && item.keyword === keyword,
        );

        if (existingIndex >= 0) {
          // 이미 선택된 키워드면 제거
          return prev.filter((_, index) => index !== existingIndex);
        } else {
          // 새로운 키워드 추가 (최대 5개까지)
          if (prev.length >= 5) {
            return prev;
          }
          return [...prev, { category, keyword }];
        }
      });
    },
    [],
  );

  // 별점 변경 핸들러
  const handleRatingChange = useCallback((newRating: number) => {
    setRating(newRating);
  }, []);

  // 폼 초기화
  const handleReset = useCallback(() => {
    setSelectedKeywords([]);
    setReviewText("");
    setRating(4);
  }, []);

  // 리뷰 등록
  const handleSubmit = useCallback(async () => {
    if (selectedKeywords.length === 0) {
      alert("키워드를 최소 1개 선택해주세요.");
      return;
    }

    const location = districtName ? `${districtName} ${dongName}` : dongName;

    try {
      await submitMutation.mutateAsync({
        reviewText,
        selectedKeywords,
        rating,
        location,
        timeOfDay: "밤", // 기본값 - 추후 사용자 입력으로 변경 가능
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
    }
  }, [
    selectedKeywords,
    reviewText,
    rating,
    dongName,
    districtName,
    submitMutation,
    onSuccess,
    onClose,
  ]);

  // 등록 버튼 활성화 조건
  const isSubmitDisabled = useMemo(() => {
    return selectedKeywords.length === 0 || submitMutation.isPending;
  }, [selectedKeywords.length, submitMutation.isPending]);

  if (keywordsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p style={{ color: COLORS.GRAY_400 }}>키워드를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 제목 */}
      <div className="space-y-3">
        <Typography variant="h1">
          <span style={{ color: COLORS.PRIMARY }}>{dongName}</span>
          은
          <br />
          어떤 동네같나요?
        </Typography>

        <Typography variant="label">
          동네에 해당하는 키워드를 골라주세요. (1~5개)
        </Typography>
      </div>

      {/* 별점 입력 */}
      <div className="space-y-3">
        <Typography variant="label">
          이 동네의 안전도를 별점으로 평가해주세요.
        </Typography>
        <div className="flex items-center justify-start py-4">
          <Rating
            rating={rating}
            isEditable={true}
            onRatingChange={handleRatingChange}
            showNumber={true}
            className="justify-center"
          />
        </div>
      </div>

      {/* 키워드 슬라이더 */}
      {keywordsData?.data?.availableKeywords && (
        <div className="-mx-6">
          {/* 모달 패딩을 벗어나도록 음수 마진 */}
          <div className="px-6">
            <ReviewKeywordSlider
              keywordsData={keywordsData.data.availableKeywords}
              selectedKeywords={selectedKeywords}
              onKeywordSelect={handleKeywordSelect}
            />
          </div>
        </div>
      )}

      {/* 리뷰 작성 */}
      <ReviewParagraph value={reviewText} onChange={setReviewText} />

      {/* 버튼들 */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2"
          style={{
            borderColor: COLORS.GRAY_200,
            backgroundColor: "transparent",
            color: COLORS.GRAY_800,
          }}
        >
          <RotateCcw className="w-4 h-4" />
          초기화
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="flex-1"
          style={{
            backgroundColor: isSubmitDisabled
              ? COLORS.GRAY_200
              : COLORS.PRIMARY,
            color: isSubmitDisabled ? COLORS.GRAY_400 : "white",
          }}
        >
          {submitMutation.isPending ? "등록 중..." : "리뷰 등록"}
        </Button>
      </div>
    </div>
  );
};
