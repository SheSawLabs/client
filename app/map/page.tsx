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

export default function MapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openBottomSheet } = useBottomSheet();
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

  useEffect(() => {
    if (!districtIsSuccess || !districtData) return;

    const dongData = districtData.data?.find(
      (dong) => dong.dong === selectedDong,
    );

    setDongInfo(dongData || null);
  }, [districtData, selectedDong, districtIsSuccess]);

  const handleNext = () => {
    return currentStep === "gu-selection"
      ? handleGuSelection()
      : handleDongSelection();
  };

  const handleGuSelection = () => {
    if (selectedDistrict) {
      updateUrl({ step: "dong-selection" });
    }
  };

  const handleDongSelection = () => {
    if (selectedDong) {
      updateUrl({ step: "interactive-map" });
    }
  };

  // 구 선택 핸들러
  const handleDistrictSelect = (district: string | null) => {
    updateUrl({ district, dong: null, step: "gu-selection" });
  };

  // 동 클릭 핸들러
  const handleDongClick = (dong: string) => {
    updateUrl({ dong, step: "interactive-map" });
  };

  const onBackClick = () => {
    if (currentStep === "dong-selection") {
      updateUrl({ dong: null, step: "gu-selection" });
    } else if (currentStep === "interactive-map") {
      updateUrl({ dong: null, step: "dong-selection" });
    } else {
      // Navigate back to the previous page
      window.history.back();
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
    }
  }, [currentStep, dongInfo]);

  return (
    <div className="pb-20">
      <TopNav
        title="동네 안전"
        showBackButton={true}
        onBackClick={onBackClick}
      />
      {currentStep === "gu-selection" && (
        <div className="p-4">
          <DistrictPolygons
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={handleDistrictSelect}
          />
          {/* 안전등급 표시 */}
          <div className="mb-2">
            <SafetyLevel />
          </div>
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

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!selectedDistrict}
              size="wide"
              className="px-6 py-2"
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {currentStep === "dong-selection" && (
        <div className="relative h-screen">
          {/* 동 지도 영역 */}
          <div className="h-full p-4">
            <DongPolygons
              districtName={selectedDistrict || ""}
              onDongClick={handleDongClick}
              selectedDong={selectedDong}
              className="h-full"
            />
          </div>
          {selectedDong && (
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!selectedDong}
                size="wide"
                className="px-6 py-2"
              >
                {`${selectedDong} 보러가기`}
              </Button>
            </div>
          )}
        </div>
      )}

      {currentStep === "interactive-map" && (
        <div className="relative h-screen">
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
