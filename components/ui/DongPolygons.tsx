"use client";

import {
  useDistrictByDistrictNameQuery,
  useDongGeoJSONDQuery,
} from "@/app/queries/map";
import { SAFETY_COLORS } from "@/constants";
import { SafetyGrade } from "@/types/safety";
import React, { useRef, useEffect, useState } from "react";

interface DongFeature {
  type: "Feature";
  properties: {
    adm_nm: string; // 행정구역명 (예: "서울특별시 종로구 사직동")
    sggnm: string; // 시군구명 (예: "종로구")
    [key: string]: unknown;
  };
  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
}

interface ProcessedDong {
  name: string;
  dongName: string; // 동 이름만 (예: "사직동")
  coordinates: number[][];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  center: { x: number; y: number };
}

interface DongPolygonsProps {
  districtName: string;
  onDongClick?: (dongName: string) => void;
  selectedDong: string | null;
  className?: string;
}

export const DongPolygons: React.FC<DongPolygonsProps> = ({
  districtName,
  onDongClick,
  selectedDong,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedDongs, setProcessedDongs] = useState<ProcessedDong[]>([]);
  const [canvasBounds, setCanvasBounds] = useState({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    width: 800,
    height: 600,
    padding: 16,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 행정동 GeoJSON 데이터
  const { data: hangjeongDongData } = useDongGeoJSONDQuery();

  // 구별 안전 데이터
  const { data: districtData } = useDistrictByDistrictNameQuery(
    districtName || "",
  );

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

  // MultiPolygon에서 좌표 추출
  const extractCoordinates = (feature: DongFeature): number[][] => {
    const coords: number[][] = [];
    const multiPolygonCoords = feature.geometry.coordinates;

    // MultiPolygon의 첫 번째 Polygon의 외부 링 사용
    if (multiPolygonCoords.length > 0 && multiPolygonCoords[0].length > 0) {
      coords.push(...multiPolygonCoords[0][0]);
    }

    return coords;
  };

  // 동 이름 추출 (행정구역명에서 동 이름만)
  const extractDongName = (admNm: string): string => {
    const parts = admNm.split(" ");
    return parts[parts.length - 1] || "";
  };

  // 동 이름으로 안전 등급 찾기
  const getDongSafetyGrade = (dongName: string): string => {
    if (!districtData?.data) return "C"; // 기본값

    const dong = districtData.data.find((d) => d.dong === dongName);
    return dong?.grade || "C";
  };

  // GeoJSON 데이터 처리
  const processGeoJsonData = (features: DongFeature[]) => {
    const dongs: ProcessedDong[] = [];
    let globalMinX = Infinity,
      globalMaxX = -Infinity;
    let globalMinY = Infinity,
      globalMaxY = -Infinity;

    // 선택된 구에 해당하는 동들만 필터링
    const filteredFeatures = features.filter(
      (feature) => feature.properties.sggnm === districtName,
    );

    // 전체 좌표 범위 계산
    filteredFeatures.forEach((feature) => {
      const coords = extractCoordinates(feature);
      coords.forEach((coord) => {
        globalMinX = Math.min(globalMinX, coord[0]);
        globalMaxX = Math.max(globalMaxX, coord[0]);
        globalMinY = Math.min(globalMinY, coord[1]);
        globalMaxY = Math.max(globalMaxY, coord[1]);
      });
    });

    // 각 동별 데이터 처리
    filteredFeatures.forEach((feature) => {
      const coords = extractCoordinates(feature);
      const name = feature.properties.adm_nm;
      const dongName = extractDongName(name);
      const center = calculatePolygonCenter(coords);

      dongs.push({
        name,
        dongName,
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

    setProcessedDongs(dongs);
  };

  // 데이터 로드 및 처리
  useEffect(() => {
    if (hangjeongDongData && districtName) {
      setIsLoading(true);
      try {
        processGeoJsonData(hangjeongDongData.features);
      } catch (error) {
        console.error("동별 데이터 처리 실패:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [hangjeongDongData, districtName, districtData]);

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
  const drawDongs = () => {
    const canvas = canvasRef.current;
    if (!canvas || processedDongs.length === 0) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 각 동별 폴리곤 그리기
    processedDongs.forEach((dong) => {
      ctx.beginPath();

      dong.coordinates.forEach((coord, index) => {
        const [canvasX, canvasY] = transformToCanvas(coord[0], coord[1]);

        if (index === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      });

      ctx.closePath();

      // 폴리곤 채우기 (안전 등급에 따른 색상)
      const grade = getDongSafetyGrade(dong.dongName);
      const safetyColor =
        SAFETY_COLORS[grade as SafetyGrade] || SAFETY_COLORS.C;

      if (dong.dongName === selectedDong) {
        // 선택된 동은 더 진한 색상으로
        ctx.fillStyle = safetyColor;
        ctx.globalAlpha = 0.8;
      } else {
        // 일반 동은 연한 색상으로
        ctx.fillStyle = safetyColor;
        ctx.globalAlpha = 0.4;
      }
      ctx.fill();
      ctx.globalAlpha = 1.0; // 투명도 복구

      // 테두리 그리기 (검은색)
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 동 이름 표시 (중앙에)
      const [centerX, centerY] = transformToCanvas(
        dong.center.x,
        dong.center.y,
      );
      ctx.fillStyle = "#000000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(dong.dongName, centerX, centerY);
    });
  };

  // Canvas 클릭 이벤트 처리
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onDongClick) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 각 동 폴리곤 내부 클릭 확인 (역순으로 검사하여 나중에 그려진 것 우선)
    for (let i = processedDongs.length - 1; i >= 0; i--) {
      const dong = processedDongs[i];
      ctx.beginPath();

      dong.coordinates.forEach((coord, index) => {
        const [canvasX, canvasY] = transformToCanvas(coord[0], coord[1]);

        if (index === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      });

      ctx.closePath();

      if (ctx.isPointInPath(clickX, clickY)) {
        onDongClick(dong.dongName);
        console.log("선택된 동:", dong.dongName, "클릭 좌표:", {
          clickX,
          clickY,
        });
        break;
      }
    }
  };

  // processedDongs가 변경될 때마다 자동으로 그리기
  useEffect(() => {
    if (processedDongs.length > 0) {
      drawDongs();
    }
  }, [processedDongs, selectedDong]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-gray-500">동 데이터 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        className="w-full border border-gray-300 rounded-lg cursor-pointer"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};
