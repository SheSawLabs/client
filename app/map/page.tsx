"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

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

interface GeoJSONData {
  type: "FeatureCollection";
  features: DistrictFeature[];
}

interface ProcessedDistrict {
  name: string;
  coordinates: number[][];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  center: { x: number; y: number };
}

export default function MapPage() {
  // 퍼널 상태 관리
  const [currentStep, setCurrentStep] = useState<
    "district-selection" | "dong-selection"
  >("district-selection");
  const [funnelContext, setFunnelContext] = useState<{
    selectedDistrict?: string;
  }>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    loadDistrictData();
  }, []);

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

  // 데이터 로드
  const loadDistrictData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeoJSONData = await response.json();
      processGeoJsonData(data);
    } catch (error) {
      console.error("구별 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
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

      // 폴리곤 채우기 (흰색)
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // 테두리 그리기 (검은색, 선택시 빨간색)
      ctx.strokeStyle =
        district.name === selectedDistrict ? "#ff0000" : "#000000";
      ctx.lineWidth = district.name === selectedDistrict ? 3 : 1;
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

  // Canvas 클릭 이벤트 처리
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 각 구역 폴리곤 내부 클릭 확인
    for (const district of processedDistricts) {
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
        break;
      }
    }
  };

  // 다음 버튼 클릭 핸들러
  const handleNext = () => {
    if (selectedDistrict) {
      setFunnelContext({ selectedDistrict });
      setCurrentStep("dong-selection");
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
      {currentStep === "district-selection" && (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">구 선택</h1>

          {isLoading && (
            <div className="mb-4 px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-gray-600">데이터 로딩 중...</span>
            </div>
          )}

          {selectedDistrict && (
            <div className="mb-4 px-4 py-2 bg-blue-100 rounded-lg">
              <span className="font-semibold">
                선택된 구: {selectedDistrict}
              </span>
            </div>
          )}

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

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!selectedDistrict}
              className="px-6 py-2"
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {currentStep === "dong-selection" && (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">동선택 페이지</h1>
          <p>선택된 구: {funnelContext.selectedDistrict}</p>
          <Button
            onClick={() => setCurrentStep("district-selection")}
            className="mt-4"
          >
            이전으로
          </Button>
        </div>
      )}
    </div>
  );
}
