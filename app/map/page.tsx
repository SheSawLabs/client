"use client";

import { useEffect, useState } from "react";
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
  // 퍼널 상태 관리
  const [currentStep, setCurrentStep] = useState<
    "gu-selection" | "dong-selection" | "interactive-map"
  >("gu-selection");
  const [, setFunnelContext] = useState<{
    selectedDistrict?: string;
  }>({});

  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedDong, setSelectedDong] = useState<string | null>(null);
  const [dongInfo, setDongInfo] = useState<Dong | null>(null);
  const { openBottomSheet } = useBottomSheet();
  const { openModal } = useModal();
  const { data: districtData, isSuccess: districtIsSuccess } =
    useDistrictByDistrictNameQuery(selectedDistrict || "");

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
      setFunnelContext({ selectedDistrict });
      setCurrentStep("dong-selection");
    }
  };

  const handleDongSelection = () => {
    if (selectedDong) {
      // Update funnel context with selected dong
      setFunnelContext((prev) => ({
        ...prev,
        selectedDong,
      }));
    }
  };

  // 동 클릭 핸들러
  const handleDongClick = (selectedDong: string) => {
    setSelectedDong(selectedDong);
    setFunnelContext((prev) => ({ ...prev, selectedDong }));
    setCurrentStep("interactive-map");
  };

  const onBackClick = () => {
    if (currentStep === "dong-selection") {
      setCurrentStep("gu-selection");
      setSelectedDong(null);
    } else if (currentStep === "interactive-map") {
      setCurrentStep("dong-selection");
    } else {
      // Navigate back to the previous page
      window.history.back();
    }
  };

  useEffect(() => {
    if (currentStep === "interactive-map" && dongInfo) {
      openBottomSheet(<DongSafetyDetail dongInfo={dongInfo} />, {
        defaultHeight: "40%",
        minHeight: "15%",
        maxHeight: "70%",
      });
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
            setSelectedDistrict={setSelectedDistrict}
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
          />
        </div>
      )}
    </div>
  );
}
