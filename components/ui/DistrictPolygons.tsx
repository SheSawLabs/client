import { useEffect, useState, useRef } from "react";
import { useDistrictJsonQuery, type GeoJSONData } from "@/app/queries/map";

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

const DistrictPolygons = ({
  selectedDistrict,
  setSelectedDistrict,
}: {
  selectedDistrict: string | null;
  setSelectedDistrict: (district: string | null) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const handleDistrictClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
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
    <>
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
          onClick={handleDistrictClick}
          className="w-full border border-gray-300 rounded-lg cursor-pointer"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </>
  );
};

export { DistrictPolygons };
