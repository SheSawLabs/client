import { useDongGeoJSONDQuery } from "@/app/queries/map";
import {
  CustomOverlayInterface,
  LatNLng,
  MapInstance,
  MarkerInstance,
  PolygonInstance,
} from "@/types/kakao";
import { useEffect, useState } from "react";

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

const InteractiveMap = ({
  districtName,
  selectedDong,
}: {
  districtName: string;
  selectedDong: string | null;
}) => {
  const [map, setMap] = useState<MapInstance | null>(null);
  const [polygons, setPolygons] = useState<PolygonInstance[]>([]);
  const { data: dongGeoJSONData, isSuccess: dongGeoJSONIsSuccess } =
    useDongGeoJSONDQuery();

  console.log({ districtName, selectedDong });

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
  }, [map, dongGeoJSONIsSuccess, dongGeoJSONData, selectedDong, districtName]);

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

  // 동 이름 추출 (행정구역명에서 동 이름만)
  const extractDongName = (admNm: string): string => {
    const parts = admNm.split(" ");
    return parts[parts.length - 1] || "";
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

  // 폴리곤 생성 및 지도에 표시
  const displayPolygons = () => {
    if (!map || !dongGeoJSONData || !selectedDong) return;

    // 기존 폴리곤 제거
    clearPolygons();
    const newPolygons: PolygonInstance[] = [];

    // 선택된 동과 매칭되는 데이터 찾기
    const selectedFeature = dongGeoJSONData.features.find((feature) => {
      const dongName = extractDongName(feature.properties.adm_nm);
      return (
        dongName === selectedDong && feature.properties.sggnm === districtName
      );
    });

    if (!selectedFeature) {
      console.warn(
        `선택된 동 '${selectedDong}'에 해당하는 데이터를 찾을 수 없습니다.`,
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
    const paths: LatNLng[] = coords.map(
      (coord: number[]) => new window.kakao.maps.LatLng(coord[1], coord[0]), // [경도, 위도] -> LatLng(위도, 경도)
    );

    // 폴리곤 생성
    const polygon = new window.kakao.maps.Polygon({
      map: map,
      path: paths,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
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
      // 좌표들의 중심점 계산
      let totalLat = 0;
      let totalLng = 0;
      paths.forEach((path) => {
        totalLat += path.getLat ? path.getLat() : path.lat;
        totalLng += path.getLng ? path.getLng() : path.lng;
      });

      const centerLat = totalLat / paths.length;
      const centerLng = totalLng / paths.length;
      const center = new window.kakao.maps.LatLng(centerLat, centerLng);

      map.setCenter(center);
      map.setLevel(6); // 동 단위로 확대
    }

    setPolygons(newPolygons);
    console.log(`${selectedDong} 폴리곤 생성 완료`);
  };

  // 폴리곤 제거
  const clearPolygons = () => {
    polygons.forEach((polygon) => polygon.setMap(null));
    setPolygons([]);
  };

  return (
    <div className="relative">
      <div
        id="polygon-map"
        className="w-full border border-gray-300 rounded-lg"
        style={{ height: "600px" }}
      />
    </div>
  );
};

export { InteractiveMap };
