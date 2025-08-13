import { useDongGeoJSONDQuery } from "@/app/queries/map";
import { COLORS, SAFETY_COLORS } from "@/constants";
import {
  CustomOverlayInterface,
  LatNLng,
  MapInstance,
  MarkerInstance,
  PolygonInstance,
} from "@/types/kakao";
import { Dong, DongFeature } from "@/types/map";
import {
  findSelectedDongFeature,
  extractCoordinates,
  convertCoordsToKakaoLatLng,
  calculateKakaoMapCenter,
} from "@/utils/map";
import { FacilitiesFilters } from "./FacilitiesFilters";
import { FacilityType } from "@/hooks/useFacilityFilters";
import { useEffect, useState } from "react";

const InteractiveMap = ({
  districtName,
  dongInfo,
}: {
  districtName: string;
  dongInfo: Dong | null;
}) => {
  const [map, setMap] = useState<MapInstance | null>(null);
  const [polygons, setPolygons] = useState<PolygonInstance[]>([]);
  const [activeFilters, setActiveFilters] = useState<FacilityType[]>([]);

  const { data: dongGeoJSONData, isSuccess: dongGeoJSONIsSuccess } =
    useDongGeoJSONDQuery();

  useEffect(() => {
    window.kakao.maps.load(() => {
      initializeMap();
    });

    return () => clearPolygons();
  }, []);

  useEffect(() => {
    if (!map) return;
    if (!dongGeoJSONIsSuccess || !dongGeoJSONData) {
      console.error("동 GeoJSON 데이터가 로드되지 않았습니다.");
      return;
    }

    displayPolygons();
  }, [map, dongGeoJSONIsSuccess, dongGeoJSONData, dongInfo, districtName]);

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

  // 폴리곤 생성 및 지도에 표시
  const displayPolygons = () => {
    if (!map || !dongGeoJSONData || !dongInfo) return;

    // 기존 폴리곤 제거
    clearPolygons();
    const newPolygons: PolygonInstance[] = [];

    // 선택된 동과 매칭되는 데이터 찾기
    const selectedFeature = findSelectedDongFeature(
      dongGeoJSONData.features as DongFeature[],
      dongInfo.dong,
      districtName,
    );

    if (!selectedFeature) {
      console.warn(
        `선택된 동 '${dongInfo.dong}'에 해당하는 데이터를 찾을 수 없습니다.`,
      );
      return;
    }

    // 좌표 추출 및 변환
    const coords = extractCoordinates(selectedFeature);
    if (coords.length === 0) {
      console.warn("좌표 데이터가 없습니다.");
      return;
    }

    // 좌표를 카카오맵 LatLng 객체로 변환
    const paths: LatNLng[] = convertCoordsToKakaoLatLng(coords);

    const gradeColor = dongInfo?.grade
      ? SAFETY_COLORS[dongInfo.grade]
      : "#0f5fda";
    // 폴리곤 생성
    const polygon = new window.kakao.maps.Polygon({
      map: map,
      path: paths,
      strokeColor: dongInfo?.grade
        ? SAFETY_COLORS[dongInfo.grade]
        : COLORS.PRIMARY,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: gradeColor,
      fillOpacity: 0.3,
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
        console.log("클릭된 구역:", selectedFeature.properties.adm_nm);
        alert(`클릭된 구역: ${selectedFeature.properties.adm_nm}`);
      },
    );

    // 폴리곤이 보이도록 지도 중심 및 레벨 조정
    if (paths.length > 0) {
      const center = calculateKakaoMapCenter(paths);
      map.setCenter(center);
      map.setLevel(6); // 동 단위로 확대
    }

    setPolygons(newPolygons);
  };

  // 폴리곤 제거
  const clearPolygons = () => {
    polygons.forEach((polygon) => polygon.setMap(null));
    setPolygons([]);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filters: FacilityType[]) => {
    setActiveFilters(filters);
    console.log("activeFilters", activeFilters);
    // TODO: 실제 필터링 로직 구현 (지도에 마커 표시/숨김 등)
  };

  return (
    <div className="relative h-full">
      {/* 지도 컨테이너 */}
      <div id="polygon-map" className="w-full h-full" />

      {/* 상단 플로팅 필터 태그 */}
      <div className="absolute top-4 left-0 right-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <FacilitiesFilters
            dongInfo={dongInfo}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
};

export { InteractiveMap };
