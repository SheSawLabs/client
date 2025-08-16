import { useEffect, useRef } from "react";
import { COLORS } from "@/constants";
import { Streetlight } from "@/types/streetlight";
import {
  MapInstance,
  MarkerInstance,
  MarkerClustererInstance,
} from "@/types/kakao";
import { hexToRgba } from "@/utils/policy";

interface UseMarkerClustererProps {
  map: MapInstance | null;
  streetlights: Streetlight[];
}

export const useMarkerClusterer = ({
  map,
  streetlights,
}: UseMarkerClustererProps) => {
  const clustererRef = useRef<MarkerClustererInstance | null>(null);
  const markersRef = useRef<MarkerInstance[]>([]);

  useEffect(() => {
    if (!map || !window.kakao?.maps || !window.kakao.maps.MarkerClusterer)
      return;

    // 기존 클러스터러 정리
    if (clustererRef.current) {
      clustererRef.current.clear();
    }

    // 기존 마커들 정리
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    if (streetlights.length === 0) return;

    // 가로등 마커들 생성
    const markers = streetlights.map((streetlight) => {
      const position = new window.kakao.maps.LatLng(
        streetlight.latitude,
        streetlight.longitude,
      );

      return new window.kakao.maps.Marker({
        position,
        title: streetlight.management_number,
      });
    });

    markersRef.current = markers;

    // 클러스터러 생성
    const clusterer = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 0, // 모든 레벨에서 클러스터링 동작하도록 변경
      gridSize: 60, // 클러스터 그리드 크기 설정 (기본값보다 작게)
      disableClickZoom: false,
      calculator: [19, 39, 59], // 크기 범위 정의: ≤19, 20-39, 40-59, 60+
      styles: [
        {
          // 2-19개: 기본 크기의 1.5배 (30px -> 45px)
          width: "45px",
          height: "45px",
          background: hexToRgba(COLORS.RED_500, 0.4),
          borderRadius: "22.5px",
          border: `2px solid ${COLORS.RED_500}`,
          color: "#FFFFFF",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px",
          lineHeight: "41px",
        },
        {
          // 20-39개: 첫 번째 크기의 1.5배 (45px -> 67px)
          width: "67px",
          height: "67px",
          background: hexToRgba(COLORS.RED_500, 0.4),
          borderRadius: "33.5px",
          border: `2px solid ${COLORS.RED_500}`,
          color: "#FFFFFF",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "16px",
          lineHeight: "63px",
        },
        {
          // 40-59개: 두 번째 크기의 1.5배 (67px -> 100px)
          width: "100px",
          height: "100px",
          background: hexToRgba(COLORS.RED_500, 0.4),
          borderRadius: "50px",
          border: `2px solid ${COLORS.RED_500}`,
          color: "#FFFFFF",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "18px",
          lineHeight: "96px",
        },
        {
          // 60개 이상: 세 번째 크기의 1.5배 (100px -> 150px)
          width: "150px",
          height: "150px",
          background: hexToRgba(COLORS.RED_500, 0.4),
          borderRadius: "75px",
          border: `2px solid ${COLORS.RED_500}`,
          color: "#FFFFFF",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
          lineHeight: "146px",
        },
      ],
    });

    clusterer.addMarkers(markers);
    clustererRef.current = clusterer;

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clear();
      }
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [map, streetlights]);

  return clustererRef.current;
};
