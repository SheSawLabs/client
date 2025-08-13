"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type {
  MapInstance,
  PolygonInstance,
  LatNLng,
  MarkerInstance,
  CustomOverlayInterface,
} from "@/types/kakao";

interface GeoJSONFeature {
  type: string;
  properties: {
    OBJECTID: number;
    adm_nm: string;
    adm_cd: string;
    adm_cd2: string;
    sgg: string;
    sido: string;
    sidonm: string;
    sggnm: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][][]; // MultiPolygon: [폴리곤들][링들][좌표점들][경도,위도]
  };
}

interface GeoJSONData {
  type: string;
  name: string;
  features: GeoJSONFeature[];
}

export default function PolygonTestPage() {
  const [map, setMap] = useState<MapInstance | null>(null);
  const [polygons, setPolygons] = useState<PolygonInstance[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.kakao.maps.load(() => {
      initializeMap();
    });
  }, []);

  // 카카오맵 초기화
  const initializeMap = () => {
    if (typeof window !== "undefined" && window.kakao && window.kakao.maps) {
      const container = document.getElementById("polygon-map");
      if (!container) {
        console.error("지도 컨테이너가 없습니다.");
        return;
      }

      const center: LatNLng = new window.kakao.maps.LatLng(37.5665, 126.978); // 서울시청 좌표
      const options = {
        center,
        level: 8,
      };

      const kakaoMap: MapInstance = new window.kakao.maps.Map(
        container,
        options,
      );
      setMap(kakaoMap);
    }
  };

  // GeoJSON 데이터 로드
  const loadGeoJsonData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/data/seoul.json");
      const data: GeoJSONData = await response.json();
      console.log("data", data);
      setGeoJsonData(data);
      console.log("GeoJSON 데이터 로드 완료:", data.features.length, "개 구역");
    } catch (error) {
      console.error("GeoJSON 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 폴리곤 생성 및 지도에 표시
  const displayPolygons = () => {
    if (!map || !geoJsonData) return;

    // 기존 폴리곤 제거
    // clearPolygons();
    const newPolygons: PolygonInstance[] = [];

    geoJsonData.features.forEach((feature) => {
      if (feature.geometry.type === "MultiPolygon") {
        // MultiPolygon의 각 Polygon을 처리
        feature.geometry.coordinates.forEach((polygonCoords) => {
          // 외곽선만 사용 (첫 번째 링)
          const outerRing = polygonCoords[0]; // 첫 번째 링이 외곽선
          // 좌표를 카카오맵 LatLng 객체로 변환
          const paths: LatNLng[] = outerRing.map(
            (coord: number[]) =>
              new window.kakao.maps.LatLng(coord[1], coord[0]), // [경도, 위도] -> LatLng(위도, 경도)
          );

          // 폴리곤 생성
          const polygon = new window.kakao.maps.Polygon({
            map: map,
            paths: paths,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.2,
          });

          polygon.setMap(map);
          newPolygons.push(polygon);

          // 폴리곤 클릭 이벤트
          window.kakao?.maps.event.addListener(
            polygon as unknown as
              | MapInstance
              | MarkerInstance
              | CustomOverlayInterface,
            "click",
            () => {
              console.log("클릭된 구역:", feature.properties.adm_nm);
              alert(`클릭된 구역: ${feature.properties.adm_nm}`);
            },
          );
        });
      }
    });

    setPolygons(newPolygons);
    console.log(`${newPolygons.length}개 폴리곤 생성 완료`);
  };

  // 폴리곤 제거
  const clearPolygons = () => {
    polygons.forEach((polygon) => polygon.setMap(null));
    setPolygons([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">서울시 구별 폴리곤 지도</h1>

      {/* 컨트롤 버튼 */}
      <div className="mb-6 flex gap-4">
        <Button onClick={loadGeoJsonData} disabled={isLoading}>
          {isLoading ? "로딩 중..." : "GeoJSON 데이터 로드"}
        </Button>
        <Button onClick={displayPolygons} disabled={!geoJsonData || !map}>
          폴리곤 표시하기
        </Button>
        <Button onClick={clearPolygons}>폴리곤 제거</Button>
      </div>

      {/* 데이터 정보 */}
      {geoJsonData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">로드된 데이터 정보:</h3>
          <p>총 {geoJsonData.features.length}개 구역</p>
          <p>데이터 이름: {geoJsonData.name}</p>
        </div>
      )}

      {/* 지도 컨테이너 */}
      <div className="relative">
        <div
          id="polygon-map"
          className="w-full border border-gray-300 rounded-lg"
          style={{ height: "600px" }}
        />
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">사용 방법:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>
            먼저 &ldquo;GeoJSON 데이터 로드&rdquo; 버튼을 클릭하여 서울시 구별
            데이터를 불러옵니다.
          </li>
          <li>
            &ldquo;폴리곤 표시하기&rdquo; 버튼을 클릭하면 서울시 각 구별 경계가
            표시됩니다.
          </li>
          <li>폴리곤을 클릭하면 해당 구역의 이름이 표시됩니다.</li>
          <li>
            &ldquo;폴리곤 제거&rdquo; 버튼으로 모든 폴리곤을 숨길 수 있습니다.
          </li>
        </ol>
      </div>
    </div>
  );
}
