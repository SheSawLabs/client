import { DongFeature, ProcessedDong, CanvasBounds } from "@/types/map";
import { LatNLng } from "@/types/kakao";

/**
 * 행정구역명에서 동 이름만 추출
 * @param admNm 행정구역명 (예: "서울특별시 종로구 사직동")
 * @returns 동 이름 (예: "사직동")
 */
export const extractDongName = (admNm: string): string => {
  const parts = admNm.split(" ");
  return parts[parts.length - 1] || "";
};

/**
 * MultiPolygon에서 좌표 추출
 * @param feature GeoJSON Feature 객체
 * @returns 좌표 배열
 */
export const extractCoordinates = (feature: DongFeature): number[][] => {
  const coords: number[][] = [];
  const multiPolygonCoords = feature.geometry.coordinates;

  // MultiPolygon의 첫 번째 Polygon의 외부 링 사용
  if (multiPolygonCoords.length > 0 && multiPolygonCoords[0].length > 0) {
    coords.push(...multiPolygonCoords[0][0]);
  }

  return coords;
};

/**
 * 폴리곤의 중심점 계산
 * @param coordinates 좌표 배열
 * @returns 중심점 좌표
 */
export const calculatePolygonCenter = (
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

/**
 * GeoJSON Feature 배열을 처리하여 ProcessedDong 배열로 변환
 * @param features GeoJSON Feature 배열
 * @param districtName 구 이름 (필터링용)
 * @returns ProcessedDong 배열과 캔버스 경계
 */
export const processGeoJsonFeatures = (
  features: DongFeature[],
  districtName: string,
): { dongs: ProcessedDong[]; canvasBounds: CanvasBounds } => {
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

  const canvasBounds = {
    minX: globalMinX,
    maxX: globalMaxX,
    minY: globalMinY,
    maxY: globalMaxY,
    width: 800,
    height: 600,
    padding: 16,
  };

  return { dongs, canvasBounds };
};

/**
 * 좌표를 Canvas 좌표계로 변환 (패딩 적용)
 * @param x X 좌표
 * @param y Y 좌표
 * @param canvasBounds 캔버스 경계 정보
 * @returns Canvas 좌표
 */
export const transformToCanvas = (
  x: number,
  y: number,
  canvasBounds: CanvasBounds,
): [number, number] => {
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

/**
 * 선택된 동과 일치하는 Feature 찾기
 * @param features GeoJSON Feature 배열
 * @param selectedDong 선택된 동 이름
 * @param districtName 구 이름
 * @returns 일치하는 Feature 또는 null
 */
export const findSelectedDongFeature = (
  features: DongFeature[],
  selectedDong: string,
  districtName: string,
): DongFeature | null => {
  return (
    features.find((feature) => {
      const dongName = extractDongName(feature.properties.adm_nm);
      return (
        dongName === selectedDong && feature.properties.sggnm === districtName
      );
    }) || null
  );
};

/**
 * 좌표 배열을 카카오맵 LatLng 객체로 변환
 * @param coords 좌표 배열
 * @returns LatLng 객체 배열
 */
export const convertCoordsToKakaoLatLng = (coords: number[][]): LatNLng[] => {
  return coords.map(
    (coord) => new window.kakao.maps.LatLng(coord[1], coord[0]), // [경도, 위도] -> LatLng(위도, 경도)
  );
};

/**
 * LatLng 배열의 중심점 계산
 * @param paths LatLng 객체 배열
 * @returns 중심점 LatLng
 */
export const calculateKakaoMapCenter = (paths: LatNLng[]): LatNLng => {
  let totalLat = 0;
  let totalLng = 0;

  paths.forEach((path) => {
    totalLat += path.getLat ? path.getLat() : path.lat;
    totalLng += path.getLng ? path.getLng() : path.lng;
  });

  const centerLat = totalLat / paths.length;
  const centerLng = totalLng / paths.length;

  return new window.kakao.maps.LatLng(centerLat, centerLng);
};
