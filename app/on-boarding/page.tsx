"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

const onboardingData = [
  {
    image: "/assets/onboarding_image_1.png",
    title:
      '내 동네의 안전을<br /><span class="text-blue-500">1분</span> 만에 확인하세요',
    description:
      "실제 동네 이웃의 리뷰의 공공데이터로 만든\n나만의 맞춤형 안전지도에요.\n우리 동네 안전을 한눈에 확인해보세요.",
  },
  {
    image: "/assets/onboarding_image_2.png",
    title:
      '내게 맞는 정책,<br />알림 설정 <span class="text-blue-500">10초</span>면 끝!',
    description:
      "여성, 주거, 지원 등 여성 1인가구를 위한\n다양한 정책들, 알림 설정만 해둔다면\n시소가 놓치지 않고 챙겨 드릴게요!",
  },
  {
    image: "/assets/onboarding_image_3.png",
    title:
      '소분모임으로<br />식재료 값 <span class="text-blue-500">50%</span> 절약',
    description:
      "시소에는 소분모임, 취미공유, 안전수리 등\n다양한 여성 맞춤형 커뮤니티가 준비되어 있어요.\n지금 바로 새로운 이웃도 만나보세요",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === onboardingData.length - 1;

  const handleNextStep = () => {
    if (isLastStep) {
      router.push("/");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const currentData = onboardingData[currentStep];

  return (
    <div
      className="h-screen bg-white flex flex-col"
      onClick={!isLastStep ? handleNextStep : undefined}
    >
      {/* 페이지 인디케이터 */}
      <div className="flex justify-center gap-2 pt-16 mb-8">
        {onboardingData.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentStep ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-2 flex flex-col px-6">
        <OnboardingContent data={currentData} />
      </div>

      {/* 하단 버튼 영역 (마지막 단계에만 표시) */}
      {isLastStep && (
        <div className="p-6 pb-8">
          <Button
            size="wide"
            onClick={handleNextStep}
            className="text-white font-semibold"
          >
            시작하기
          </Button>
        </div>
      )}
    </div>
  );
}

interface OnboardingContentProps {
  data: {
    image: string;
    title: string;
    description: string;
  };
}

function OnboardingContent({ data }: OnboardingContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* 텍스트 영역 - 상단 */}
      <div className="flex-1 flex flex-col justify-center text-left space-y-6">
        {/* 제목 */}
        <h2
          className="text-2xl font-bold text-gray-900"
          dangerouslySetInnerHTML={{ __html: data.title }}
        />

        {/* 설명 */}
        <Typography
          variant="p"
          className="whitespace-pre-wrap text-gray-600 text-base leading-relaxed"
        >
          {data.description}
        </Typography>
      </div>

      {/* 이미지 - 하단 */}
      <div className="flex justify-center mt-12 mb-8">
        <Image
          src={data.image}
          alt="온보딩 이미지"
          width={280}
          height={280}
          className="w-70 h-70"
        />
      </div>
    </div>
  );
}
