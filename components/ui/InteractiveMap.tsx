import {
  useDistrictByDistrictNameQuery,
  useDongGeoJSONDQuery,
} from "@/app/queries/map";
import { SAFETY_COLORS } from "@/constants";
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
import { useEffect, useState } from "react";

const InteractiveMap = ({
  districtName,
  selectedDong,
}: {
  districtName: string;
  selectedDong: string | null;
}) => {
  const [map, setMap] = useState<MapInstance | null>(null);
  const [polygons, setPolygons] = useState<PolygonInstance[]>([]);
  const [dongInfo, setDongInfo] = useState<Dong | null>(null);
  const { data: dongGeoJSONData, isSuccess: dongGeoJSONIsSuccess } =
    useDongGeoJSONDQuery();

  const { data: districtData, isSuccess: districtIsSuccess } =
    useDistrictByDistrictNameQuery(districtName);

  useEffect(() => {
    if (!districtIsSuccess || !districtData) return;

    const dongData = districtData.data?.find(
      (dong) => dong.dong === selectedDong,
    );

    setDongInfo(dongData || null);
  }, [districtData, selectedDong, districtIsSuccess]);

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

  // 폴리곤 생성 및 지도에 표시
  const displayPolygons = () => {
    if (!map || !dongGeoJSONData || !selectedDong) return;

    // 기존 폴리곤 제거
    clearPolygons();
    const newPolygons: PolygonInstance[] = [];

    // 선택된 동과 매칭되는 데이터 찾기
    const selectedFeature = findSelectedDongFeature(
      dongGeoJSONData.features as DongFeature[],
      selectedDong,
      districtName,
    );

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
    const paths: LatNLng[] = convertCoordsToKakaoLatLng(coords);

    const gradeColor = dongInfo?.grade
      ? SAFETY_COLORS[dongInfo.grade]
      : "#0f5fda";
    // 폴리곤 생성
    const polygon = new window.kakao.maps.Polygon({
      map: map,
      path: paths,
      strokeColor: dongInfo?.grade ? SAFETY_COLORS[dongInfo.grade] : "#0f5fda",
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
