"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { TopNav } from "@/components/ui/TopNav";
import { useDistrictJsonQuery, type GeoJSONData } from "@/app/queries/map";
import { SafetyLevel } from "@/components/ui/SafetyLevel";
import { GuideTag } from "@/components/ui/GuideTag";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { DistrictSafetyDetail } from "@/components/ui/DistrictSafetyDetail";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { HelpCircle } from "lucide-react";
import { SafetyGuideDetail } from "@/components/ui/SafetyGuideDetail";

interface DistrictFeature {
  type: "Feature";
  properties: {
    name: string;
    name_eng: string;
    [key: string]: unknown;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

interface ProcessedDistrict {
  name: string;
  coordinates: number[][];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  center: { x: number; y: number };
}

// interface ProcessedDong {
//   name: string;
//   coordinates: number[][];
//   bounds: { minX: number; maxX: number; minY: number; maxY: number };
//   center: { x: number; y: number };
// }

export default function MapPage() {
  // 퍼널 상태 관리
  const [currentStep, setCurrentStep] = useState<
    "gu-selection" | "dong-selection"
  >("gu-selection");
  const [funnelContext, setFunnelContext] = useState<{
    selectedDistrict?: string;
  }>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  // const [selectedDong, setSelectedDong] = useState<string | null>(null);
  const [processedDistricts, setProcessedDistricts] = useState<
    ProcessedDistrict[]
  >([]);

  const [canvasBounds, setCanvasBounds] = useState({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    width: 800,
    height: 600,
    padding: 16,
  });

  // React Query hooks
  const districtQuery = useDistrictJsonQuery();

  // Process district data when available
  useEffect(() => {
    if (districtQuery.data) {
      processGeoJsonData(districtQuery.data);
    }
  }, [districtQuery.data]);

  // 폴리곤의 중심점 계산
  const calculatePolygonCenter = (
    coordinates: number[][],
  ): { x: number; y: number } => {
    let totalX = 0;
    let totalY = 0;
    const count = coordinates.length;

    coordinates.forEach(([x, y]) => {
      totalX += x;
      totalY += y;
    });

    return {
      x: totalX / count,
      y: totalY / count,
    };
  };

  // 좌표계 변환 및 정규화
  const processGeoJsonData = (data: GeoJSONData) => {
    const districts: ProcessedDistrict[] = [];
    let globalMinX = Infinity,
      globalMaxX = -Infinity;
    let globalMinY = Infinity,
      globalMaxY = -Infinity;

    // 전체 좌표 범위 계산
    data.features.forEach((feature) => {
      const coords = extractCoordinates(feature);
      coords.forEach((coord) => {
        globalMinX = Math.min(globalMinX, coord[0]);
        globalMaxX = Math.max(globalMaxX, coord[0]);
        globalMinY = Math.min(globalMinY, coord[1]);
        globalMaxY = Math.max(globalMaxY, coord[1]);
      });
    });

    // 각 구별 데이터 처리
    data.features.forEach((feature) => {
      const coords = extractCoordinates(feature);
      const name = feature.properties.name || feature.properties.name_eng;
      const center = calculatePolygonCenter(coords);

      districts.push({
        name,
        coordinates: coords,
        bounds: {
          minX: globalMinX,
          maxX: globalMaxX,
          minY: globalMinY,
          maxY: globalMaxY,
        },
        center,
      });
    });

    setCanvasBounds({
      minX: globalMinX,
      maxX: globalMaxX,
      minY: globalMinY,
      maxY: globalMaxY,
      width: 800,
      height: 600,
      padding: 16,
    });

    setProcessedDistricts(districts);
  };

  // GeoJSON에서 좌표 추출
  const extractCoordinates = (feature: DistrictFeature): number[][] => {
    const coords: number[][] = [];

    if (feature.geometry.type === "Polygon") {
      const polygonCoords = feature.geometry.coordinates as number[][][];
      coords.push(...polygonCoords[0]);
    } else if (feature.geometry.type === "MultiPolygon") {
      const multiPolygonCoords = feature.geometry.coordinates as number[][][][];
      if (multiPolygonCoords.length > 0) {
        coords.push(...multiPolygonCoords[0][0]);
      }
    }

    return coords;
  };

  // 좌표를 Canvas 좌표계로 변환 (패딩 적용)
  const transformToCanvas = (x: number, y: number): [number, number] => {
    const padding = canvasBounds.padding || 0;
    const drawableWidth = canvasBounds.width - padding * 2;
    const drawableHeight = canvasBounds.height - padding * 2;

    const canvasX =
      padding +
      ((x - canvasBounds.minX) / (canvasBounds.maxX - canvasBounds.minX)) *
        drawableWidth;
    const canvasY =
      padding +
      drawableHeight -
      ((y - canvasBounds.minY) / (canvasBounds.maxY - canvasBounds.minY)) *
        drawableHeight;
    return [canvasX, canvasY];
  };

  // Canvas에 폴리곤 그리기
  const drawDistricts = () => {
    const canvas = canvasRef.current;
    if (!canvas || processedDistricts.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff"; // 흰색 배경
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 각 구별 폴리곤 그리기
    processedDistricts.forEach((district) => {
      ctx.beginPath();

      district.coordinates.forEach((coord, index) => {
        const [canvasX, canvasY] = transformToCanvas(coord[0], coord[1]);

        if (index === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      });

      ctx.closePath();

      // 폴리곤 채우기 (흰색, 선택시 연한 회색)
      ctx.fillStyle =
        district.name === selectedDistrict ? "#DAE6FD" : "#ffffff";
      ctx.fill();

      // 테두리 그리기 (검은색)
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 구 이름 표시 (중앙에)
      const [centerX, centerY] = transformToCanvas(
        district.center.x,
        district.center.y,
      );
      ctx.fillStyle = "#000000";
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(district.name, centerX, centerY);
    });
  };

  const handleNext = () => {
    if (selectedDistrict) {
      setFunnelContext({ selectedDistrict });
      console.log("funnelContext:", funnelContext);
      setCurrentStep("dong-selection");
    }
  };

  // Canvas 클릭 이벤트 처리
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // Canvas의 실제 크기와 CSS 크기를 고려한 스케일 계산
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // 스케일이 적용된 클릭 좌표
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 각 구역 폴리곤 내부 클릭 확인 (역순으로 검사하여 나중에 그려진 것 우선)
    for (let i = processedDistricts.length - 1; i >= 0; i--) {
      const district = processedDistricts[i];
      ctx.beginPath();

      district.coordinates.forEach((coord, index) => {
        const [canvasX, canvasY] = transformToCanvas(coord[0], coord[1]);

        if (index === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      });

      ctx.closePath();

      if (ctx.isPointInPath(clickX, clickY)) {
        setSelectedDistrict(district.name);
        console.log("선택된 구:", district.name, "클릭 좌표:", {
          clickX,
          clickY,
        });
        break;
      }
    }
  };

  // processedDistricts가 변경될 때마다 자동으로 그리기
  useEffect(() => {
    if (processedDistricts.length > 0) {
      drawDistricts();
    }
  }, [processedDistricts, selectedDistrict]);

  return (
    <div className="pb-20">
      <TopNav title="동네 안전" showBackButton={true} />
      {currentStep === "gu-selection" && (
        <div className="p-4">
          {districtQuery.isLoading && (
            <div className="mb-4 px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-gray-600">데이터 로딩 중...</span>
            </div>
          )}

          {districtQuery.error && (
            <div className="mb-4 px-4 py-2 bg-red-100 rounded-lg">
              <span className="text-red-600">
                데이터 로드 실패: {districtQuery.error.message}
              </span>
            </div>
          )}

          <div className="mb-1 py-1 rounded-lg h-1 flex justify-center items-center">
            {selectedDistrict && (
              <p className="font-semibold text-center">{selectedDistrict}</p>
            )}
          </div>

          <p className="text-center mb-2">
            안전을 확인하고 싶은 구를 선택해주세요.
          </p>

          <div className="mb-4 py-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onClick={handleCanvasClick}
              className="w-full border border-gray-300 rounded-lg cursor-pointer"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          {/* 안전등급 표시 */}
          <div className="mb-2">
            <SafetyLevel />
          </div>

          {/* 안전등급 가이드 */}
          <div className="flex justify-center mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <div>
                  <GuideTag
                    icon={<HelpCircle className="w-3 h-3" />}
                    text="안전 등급이란?"
                  />
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[50vh]">
                <SheetHeader>
                  <SheetTitle>안전 등급 가이드</SheetTitle>
                </SheetHeader>
                <SafetyGuideDetail />
              </SheetContent>
            </Sheet>
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
          {/* 지도 영역 (구현될 예정) */}
          <div className="h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">동 지도 구현 예정</p>
          </div>

          <BottomSheet defaultHeight="30%" minHeight="15%" maxHeight="90%">
            <DistrictSafetyDetail districtName="신림동" grade="E" />
          </BottomSheet>
        </div>
      )}
    </div>
  );
}
