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
      styles: [
        {
          width: "30px",
          height: "30px",
          background: hexToRgba(COLORS.RED_500, 0.4),
          borderRadius: "15px",
          border: `2px solid ${COLORS.RED_500}`,
          color: "#FFFFFF",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "12px",
          lineHeight: "26px",
        },
        {
          width: "40px",
          height: "40px",
          background: hexToRgba(COLORS.RED_500, 0.4),
          borderRadius: "20px",
          border: `2px solid ${COLORS.RED_500}`,
          color: "#FFFFFF",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "13px",
          lineHeight: "36px",
        },
        {
          width: "50px",
          height: "50px",
          background: hexToRgba(COLORS.RED_500, 0.4),
          borderRadius: "25px",
          border: `2px solid ${COLORS.RED_500}`,
          color: "#FFFFFF",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px",
          lineHeight: "46px",
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
