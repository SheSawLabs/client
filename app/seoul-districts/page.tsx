"use client";

import { useEffect, useState, useRef } from "react";

interface DistrictFeature {
  type: "Feature";
  properties: {
    SIG_CD: string;
    SIG_ENG_NM: string;
    SIG_KOR_NM: string;
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

// 구별 색상 매핑
const DISTRICT_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85C1E9",
  "#D7BDE2",
  "#A3E4D7",
  "#FAD7A0",
  "#D5A6BD",
  "#AED6F1",
  "#A9DFBF",
  "#F9E79F",
  "#D2B4DE",
  "#A6E3E9",
  "#FFCCCB",
  "#E6E6FA",
];

interface ProcessedDistrict {
  name: string;
  color: string;
  coordinates: number[][];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export default function SeoulDistrictsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
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
  });

  useEffect(() => {
    loadDistrictData();
  }, []);

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
    data.features.forEach((feature, index) => {
      const coords = extractCoordinates(feature);
      const color = DISTRICT_COLORS[index % DISTRICT_COLORS.length];
      const name =
        feature.properties.SIG_KOR_NM || feature.properties.SIG_ENG_NM;

      districts.push({
        name,
        color,
        coordinates: coords,
        bounds: {
          minX: globalMinX,
          maxX: globalMaxX,
          minY: globalMinY,
          maxY: globalMaxY,
        },
      });
    });

    setCanvasBounds({
      minX: globalMinX,
      maxX: globalMaxX,
      minY: globalMinY,
      maxY: globalMaxY,
      width: 800,
      height: 600,
    });

    setProcessedDistricts(districts);
  };

  // GeoJSON에서 좌표 추출
  const extractCoordinates = (feature: DistrictFeature): number[][] => {
    const coords: number[][] = [];

    if (feature.geometry.type === "Polygon") {
      const polygonCoords = feature.geometry.coordinates as number[][][];
      coords.push(...polygonCoords[0]); // 외곽선만 사용
    } else if (feature.geometry.type === "MultiPolygon") {
      const multiPolygonCoords = feature.geometry.coordinates as number[][][][];
      // 첫 번째 폴리곤의 외곽선만 사용 (단순화)
      if (multiPolygonCoords.length > 0) {
        coords.push(...multiPolygonCoords[0][0]);
      }
    }

    return coords;
  };

  // GitHub에서 서울시 구별 데이터 로드
  const loadDistrictData = async () => {
    setIsLoading(true);
    try {
      // southkorea/seoul-maps 리포지토리의 구별 GeoJSON 데이터
      const response = await fetch(
        "https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeoJSONData = await response.json();
      setGeoJsonData(data);
      processGeoJsonData(data);
      console.log(
        "서울시 구별 데이터 로드 완료:",
        data.features.length,
        "개 구",
      );
    } catch (error) {
      console.error("구별 데이터 로드 실패:", error);
      // 백업 데이터 소스 시도
      try {
        const backupResponse = await fetch(
          "https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo.json",
        );
        const backupData: GeoJSONData = await backupResponse.json();
        setGeoJsonData(backupData);
        processGeoJsonData(backupData);
        console.log(
          "백업 데이터 로드 완료:",
          backupData.features.length,
          "개 구",
        );
      } catch (backupError) {
        console.error("백업 데이터 로드도 실패:", backupError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 좌표를 Canvas 좌표계로 변환
  const transformToCanvas = (x: number, y: number): [number, number] => {
    const canvasX =
      ((x - canvasBounds.minX) / (canvasBounds.maxX - canvasBounds.minX)) *
      canvasBounds.width;
    const canvasY =
      canvasBounds.height -
      ((y - canvasBounds.minY) / (canvasBounds.maxY - canvasBounds.minY)) *
        canvasBounds.height;
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
    ctx.fillStyle = "#f8f9fa"; // 배경색
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

      // 폴리곤 채우기
      ctx.fillStyle =
        district.name === selectedDistrict ? "#FF4444" : district.color;
      ctx.fill();

      // 테두리 그리기
      ctx.strokeStyle =
        district.name === selectedDistrict ? "#CC0000" : "#ffffff";
      ctx.lineWidth = district.name === selectedDistrict ? 3 : 1;
      ctx.stroke();
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
        console.log("클릭된 구:", district.name);
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
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">서울시 구별 행정구역 지도</h1>

      {/* 상태 정보 */}
      <div className="mb-6 flex gap-4 items-center">
        {isLoading && (
          <div className="px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-gray-600">데이터 로딩 중...</span>
          </div>
        )}
        {selectedDistrict && (
          <div className="px-4 py-2 bg-blue-100 rounded-lg">
            <span className="font-semibold">선택된 구: {selectedDistrict}</span>
          </div>
        )}
      </div>

      {/* 데이터 정보 */}
      {geoJsonData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">로드된 데이터 정보:</h3>
          <p>총 {geoJsonData.features.length}개 구</p>
          <p>데이터 출처: GitHub - southkorea/seoul-maps</p>
          <div className="mt-2 grid grid-cols-5 gap-2 text-sm">
            {geoJsonData.features.map((feature, index) => (
              <span key={feature.properties.SIG_CD} className="inline-block">
                <span
                  className="inline-block w-3 h-3 rounded mr-1"
                  style={{
                    backgroundColor:
                      DISTRICT_COLORS[index % DISTRICT_COLORS.length],
                  }}
                ></span>
                {feature.properties.SIG_KOR_NM}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Canvas 컨테이너 */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onClick={handleCanvasClick}
          className="w-full border border-gray-300 rounded-lg cursor-pointer"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">사용 방법:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>
            페이지가 로드되면 자동으로 서울시 25개 구의 행정구역이 Canvas에
            표시됩니다.
          </li>
          <li>
            각 구를 클릭하면 구 이름이 표시되고 해당 구역이 빨간색으로
            하이라이트됩니다.
          </li>
          <li>Canvas 기반 단색 그래픽으로 구별 경계를 표시합니다.</li>
          <li>각 구별로 다른 색상이 자동으로 할당됩니다.</li>
        </ol>
        <div className="mt-3 text-xs text-gray-600">
          <p>데이터 출처: southkorea/seoul-maps GitHub 리포지토리</p>
          <p>라이선스: 오픈소스 (공공 데이터)</p>
        </div>
      </div>
    </div>
  );
}
