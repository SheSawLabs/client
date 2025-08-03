"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type {
  MapInstance,
  MarkerInstance,
  CustomOverlayInterface,
  KakakoMap,
  LatNLng,
} from "@/types/kakao";
import { generateMarkerSVGByLevel } from "@/utils/markerUtils";
import { SAFETY_LEVEL_BG_CLASSES } from "@/constants/markerColors";
import type { AddressData } from "@/types/address";

declare global {
  interface Window {
    kakao: {
      maps: KakakoMap;
    };
  }
}

export default function MapTestPage() {
  const [map, setMap] = useState<MapInstance | null>(null);
  const [markers, setMarkers] = useState<MarkerInstance[]>([]);
  const [customOverlays, setCustomOverlays] = useState<
    CustomOverlayInterface[]
  >([]);

  // 샘플 주소 데이터

  // 배열에서 한개일때는 에러가 안나는데 두개일때 남..
  const [addressData] = useState<AddressData[]>([
    { address: "서울시 강남구 테헤란로 20길 5", level: 1 },
    // { address: "서울시 종로구 종로 1", level: 3 },
    { address: "서울시 이태원로55길 60-16", level: 5 },
    // { address: "서울시 종로구 창경궁로16길 38", level: 2 },
    // { address: "서울시 서대문구 통일로 420", level: 4 },
  ]);

  useEffect(() => {
    window.kakao.maps.load(() => {
      initializeMap();
    });

    return () => {
      clearMarkersAndOverlays();
    };
  }, []);

  // map이 설정된 후에 마커 생성
  useEffect(() => {
    if (map) {
      createMultipleMarkers();
    }
  }, [map]);

  // 모든 마커와 오버레이 제거
  const clearMarkersAndOverlays = () => {
    markers.forEach((marker) => marker.setMap(null));
    customOverlays.forEach((overlay) => overlay.setMap(null));
    setMarkers([]);
    setCustomOverlays([]);
  };

  // 여러 주소를 지오코딩하고 마커 생성
  const createMultipleMarkers = async () => {
    if (!map) return;

    const newMarkers: MarkerInstance[] = [];
    const newOverlays: CustomOverlayInterface[] = [];
    const coordinates: LatNLng[] = [];

    for (const data of addressData) {
      try {
        // 지오코딩 API 호출
        const response = await fetch("/api/geocode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: data.address }),
        });

        const result = await response.json();

        if (result.success) {
          const coords: LatNLng = new window.kakao.maps.LatLng(
            parseFloat(result.result.y),
            parseFloat(result.result.x),
          );
          coordinates.push(coords);

          // 마커 이미지 생성
          const markerImage = new window.kakao.maps.MarkerImage(
            generateMarkerSVGByLevel(data.level),
            new window.kakao.maps.Size(35, 60),
            {
              offset: new window.kakao.maps.Point(15, 50),
            },
          );

          // 마커 생성
          const marker: MarkerInstance = new window.kakao.maps.Marker({
            position: coords,
            image: markerImage,
            map: map,
          });

          newMarkers.push(marker);

          // 오버레이 위치를 마커보다 약간 위로 조정
          const overlayCoords = new window.kakao.maps.LatLng(
            parseFloat(result.result.y) + 0.0004, // 위도를 약간 위로
            parseFloat(result.result.x),
          );

          // 커스텀 오버레이 생성
          const bgClass = SAFETY_LEVEL_BG_CLASSES[data.level];
          const customAddress = `<div class="${bgClass} px-2 py-1 rounded-lg shadow-md">
            <a href="#" class="text-white hover:underline text-xs">
              ${result.result.address_name}</a>
            </div>`;

          const customOverlay: CustomOverlayInterface =
            new window.kakao.maps.CustomOverlay({
              map: map,
              clickable: true,
              content: customAddress,
              position: overlayCoords,
              xAnchor: 0.5,
              yAnchor: 1,
              zIndex: 10,
            });

          newOverlays.push(customOverlay);
        }
      } catch (error) {
        console.error(`주소 "${data.address}" 지오코딩 실패:`, error);
      }
    }

    setMarkers(newMarkers);
    setCustomOverlays(newOverlays);

    // 모든 마커가 보이도록 지도 영역 조정
    if (coordinates.length > 0) {
      fitMapToBounds(coordinates);
    }
  };

  // 모든 좌표가 보이도록 지도 영역 조정
  const fitMapToBounds = (coordinates: LatNLng[]) => {
    if (!map || coordinates.length === 0) return;

    if (coordinates.length === 1) {
      // 마커가 하나인 경우 중심 이동
      map.setCenter(coordinates[0]);
      map.setLevel(3);
    } else {
      // 여러 마커인 경우 경계 계산
      const bounds = coordinates.reduce(
        (acc, coord) => ({
          minLat: Math.min(acc.minLat, coord.lat),
          maxLat: Math.max(acc.maxLat, coord.lat),
          minLng: Math.min(acc.minLng, coord.lng),
          maxLng: Math.max(acc.maxLng, coord.lng),
        }),
        {
          minLat: coordinates[0].lat,
          maxLat: coordinates[0].lat,
          minLng: coordinates[0].lng,
          maxLng: coordinates[0].lng,
        },
      );

      // 중심점 계산
      const centerLat = (bounds.minLat + bounds.maxLat) / 2;
      const centerLng = (bounds.minLng + bounds.maxLng) / 2;
      const center = new window.kakao.maps.LatLng(centerLat, centerLng);

      map.setCenter(center);

      // 적절한 줌 레벨 계산 (간단한 방식)
      const latDiff = bounds.maxLat - bounds.minLat;
      const lngDiff = bounds.maxLng - bounds.minLng;
      const maxDiff = Math.max(latDiff, lngDiff);

      let level = 10;
      if (maxDiff < 0.01) level = 4;
      else if (maxDiff < 0.02) level = 5;
      else if (maxDiff < 0.05) level = 6;
      else if (maxDiff < 0.1) level = 7;
      else if (maxDiff < 0.2) level = 8;
      else if (maxDiff < 0.5) level = 9;

      map.setLevel(level);
    }
  };

  // 카카오맵 초기화
  const initializeMap = () => {
    if (typeof window !== "undefined" && window.kakao && window.kakao.maps) {
      const container = document.getElementById("map");
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">다중 마커 지도 테스트</h1>

      {/* 다중 마커 생성 버튼 */}
      <div className="mb-6">
        <Button onClick={createMultipleMarkers} size="lg">
          다중 마커 표시하기
        </Button>
      </div>

      {/* 주소 데이터 표시 */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">표시할 주소 목록:</h3>
        <div className="space-y-2">
          {addressData.map((data, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded"
            >
              <div
                className={`w-4 h-4 rounded-full ${SAFETY_LEVEL_BG_CLASSES[data.level]}`}
              />
              <span className="flex-1">{data.address}</span>
              <span className="text-sm text-gray-600">레벨 {data.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 지도 컨테이너 */}
      <div className="relative">
        <div
          id="map"
          className="w-full border border-gray-300 rounded-lg"
          style={{ height: "500px" }}
        />
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">사용 방법:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>
            &ldquo;다중 마커 표시하기&rdquo; 버튼을 클릭하면 모든 주소에 마커가
            표시됩니다.
          </li>
          <li>마커 색상은 안전도 레벨에 따라 자동으로 결정됩니다.</li>
          <li>모든 마커가 보이도록 지도 영역이 자동으로 조정됩니다.</li>
        </ol>
        <div className="mt-3">
          <h4 className="font-medium mb-1">안전도 레벨:</h4>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              레벨 1 (매우 위험)
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              레벨 2-3 (위험-보통)
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              레벨 4 (안전)
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              레벨 5 (매우 안전)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
