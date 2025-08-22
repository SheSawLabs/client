"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TopNav } from "@/components/ui/TopNav";
import { SafetyLevel } from "@/components/ui/SafetyLevel";
import { GuideTag } from "@/components/ui/GuideTag";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import { useModal } from "@/hooks/useModal";
import { DongSafetyDetail } from "@/components/ui/DongSafetyDetail";
import { DongPolygons } from "@/components/ui/DongPolygons";
import { HelpCircle } from "lucide-react";
import { SafetyGuideDetail } from "@/components/ui/SafetyGuideDetail";
import { DistrictPolygons } from "@/components/ui/DistrictPolygons";
import { InteractiveMap } from "@/components/ui/InteractiveMap";
import { useDistrictByDistrictNameQuery } from "../queries/map";
import { Dong } from "@/types/map";

// 각 단계를 감싸는 Wrapper 컴포넌트
interface StepWrapperProps {
  children: React.ReactNode;
  hasButton?: boolean;
  buttonContent?: React.ReactNode;
}

const StepWrapper = ({
  children,
  hasButton,
  buttonContent,
}: StepWrapperProps) => {
  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">{children}</div>
      {hasButton && buttonContent && (
        <div className="absolute bottom-20 left-4 right-4 bg-white/95 backdrop-blur-sm pb-4 pt-2 rounded-t-lg z-10">
          {buttonContent}
        </div>
      )}
    </div>
  );
};

export default function MapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const { openModal } = useModal();

  // URL 파라미터에서 상태 읽기
  const selectedDistrict = searchParams.get("district");
  const selectedDong = searchParams.get("dong");
  const step = searchParams.get("step") as
    | "gu-selection"
    | "dong-selection"
    | "interactive-map"
    | null;

  // currentStep 결정 로직
  const getCurrentStep = ():
    | "gu-selection"
    | "dong-selection"
    | "interactive-map" => {
    if (step) return step;
    if (selectedDistrict && selectedDong) return "interactive-map";
    if (selectedDistrict) return "dong-selection";
    return "gu-selection";
  };

  const currentStep = getCurrentStep();
  const [dongInfo, setDongInfo] = useState<Dong | null>(null);

  const { data: districtData, isSuccess: districtIsSuccess } =
    useDistrictByDistrictNameQuery(selectedDistrict || "");

  // 데이터 로딩 및 관리
  useEffect(() => {
    if (!districtIsSuccess || !districtData) return;

    const dongData = districtData.data?.find(
      (dong) => dong.dong === selectedDong,
    );

    setDongInfo(dongData || null);
  }, [districtData, selectedDong, districtIsSuccess]);

  // URL 업데이트 헬퍼 함수
  const updateUrl = (params: {
    district?: string | null;
    dong?: string | null;
    step?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    router.push(`/map?${newParams.toString()}`, { scroll: false });
  };

  // 구 선택 핸들러
  const handleDistrictSelect = (district: string | null) => {
    updateUrl({
      district,
      dong: null,
      step: district ? "gu-selection" : undefined,
    });
  };

  // 동 선택 핸들러
  const handleDongClick = (dong: string) => {
    updateUrl({
      dong,
      step: "dong-selection",
    });
  };

  // 구 선택에서 다음 단계로 이동
  const handleGuSelection = () => {
    if (!selectedDistrict) return;
    updateUrl({ step: "dong-selection" });
  };

  // 동 선택에서 다음 단계로 이동
  const handleDongSelection = () => {
    if (!selectedDong) return;
    updateUrl({ step: "interactive-map" });
  };

  // 다음 버튼 핸들러
  const handleNext = () => {
    if (currentStep === "gu-selection") {
      handleGuSelection();
    } else if (currentStep === "dong-selection") {
      handleDongSelection();
    }
  };

  const onBackClick = () => {
    if (currentStep === "dong-selection") {
      updateUrl({ dong: null, step: "gu-selection" });
    } else if (currentStep === "interactive-map") {
      updateUrl({ dong: null, step: "dong-selection" });
    } else {
      router.replace("/");
    }
  };

  const openDongDetailBottomSheet = () => {
    openBottomSheet(<DongSafetyDetail dongInfo={dongInfo} />, {
      defaultHeight: "40%",
      minHeight: "15%",
      maxHeight: "70%",
    });
  };

  useEffect(() => {
    if (currentStep === "interactive-map" && dongInfo) {
      openDongDetailBottomSheet();
    } else if (currentStep !== "interactive-map") {
      closeBottomSheet();
    }
  }, [currentStep, dongInfo]);

  return (
    <div className="h-full flex flex-col">
      <TopNav
        title="동네 안전"
        showBackButton={true}
        onBackClick={onBackClick}
      />

      {currentStep === "gu-selection" && (
        <StepWrapper
          hasButton={!!selectedDistrict}
          buttonContent={
            <Button
              onClick={handleNext}
              disabled={!selectedDistrict}
              size="wide"
              className="shadow-lg"
            >
              {`${selectedDistrict} 보러가기`}
            </Button>
          }
        >
          <div className="p-4">
            <DistrictPolygons
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={handleDistrictSelect}
            />
            {/* 안전등급 가이드 */}
            <div className="flex justify-center mb-4">
              <div
                onClick={() => openModal(<SafetyGuideDetail />)}
                className="cursor-pointer"
              >
                <GuideTag
                  icon={<HelpCircle className="w-3 h-3" />}
                  text="안전 등급이란?"
                />
              </div>
            </div>
          </div>
        </StepWrapper>
      )}

      {currentStep === "dong-selection" && (
        <StepWrapper
          hasButton={!!selectedDong}
          buttonContent={
            <Button
              onClick={handleNext}
              disabled={!selectedDong}
              size="wide"
              className="shadow-lg"
            >
              {`${selectedDong} 보러가기`}
            </Button>
          }
        >
          <div className="px-4">
            {/* 동 지도 영역 */}
            <p className="flex items-center justify-center mt-6 text-center">
              <span>{selectedDistrict}</span>
              {selectedDong && (
                <span className="ml-2">
                  <span className="mr-2">&gt;</span>
                  {selectedDong}
                </span>
              )}
            </p>
            <div className="mt-8 mb-8">
              <DongPolygons
                districtName={selectedDistrict || ""}
                onDongClick={handleDongClick}
                selectedDong={selectedDong}
              />
            </div>
            {/* 안전등급 표시 */}
            <div className="mt-2 mb-2">
              <SafetyLevel />
            </div>
          </div>
        </StepWrapper>
      )}

      {currentStep === "interactive-map" && (
        <div className="flex-1 relative">
          <InteractiveMap
            districtName={selectedDistrict || ""}
            dongInfo={dongInfo}
            openDongDetailBottomSheet={openDongDetailBottomSheet}
          />
        </div>
      )}
    </div>
  );
}
