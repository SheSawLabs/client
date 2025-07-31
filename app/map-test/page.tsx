"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

declare global {
  interface Window {
    kakao: {
      maps: KakakoMap;
    };
  }
}

interface KakakoMap {
  LatLng: new (lat: number, lng: number) => { lat: number; lng: number };
  Map: new (
    container: HTMLElement,
    options: {
      center: {
        lat: number;
        lng: number;
      };
      level: number;
    },
  ) => {
    setCenter: (coords: string) => void;
    setLevel: (level: number) => void;
  };
  load: (callback: () => void) => void;
}

export default function MapTestPage() {
  const [searchAddress, setSearchAddress] = useState("");
  const [map, setMap] = useState<unknown>(null);

  useEffect(() => {
    window.kakao.maps.load(() => {
      console.log("Kakao Maps API loaded");
      initializeMap();
    });
  }, []);

  // 카카오맵 초기화
  const initializeMap = () => {
    console.log("window.kakao:", window.kakao);
    if (typeof window !== "undefined" && window.kakao && window.kakao.maps) {
      console.log("Kakao Maps API loaded");
      const container = document.getElementById("map");
      if (!container) {
        console.error("지도 컨테이너가 없습니다.");
        return;
      }

      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울시청 좌표
        level: 8,
      };

      const kakaoMap = new window.kakao.maps.Map(container, options);
      setMap(kakaoMap);
    }
  };

  // 검색 처리
  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }

    try {
      // 카카오 REST API를 통한 지오코딩
      const response = await fetch("/api/geocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: searchAddress }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.error || "검색 중 오류가 발생했습니다.");
        return;
      }

      // 지도에 결과 표시
      if (window.kakao && map) {
        // const coords = new window.kakao.maps.LatLng(data.result.y, data.result.x);
        // // 지도 중심 이동
        // map.setCenter(coords);
        // map.setLevel(3);
        // // 기존 마커 제거
        // if (marker) {
        //   marker.setMap(null);
        // }
        // // 새 마커 생성
        // const newMarker = new window.kakao.maps.Marker({
        //   position: coords,
        //   map: map
        // });
        // setMarker(newMarker);
        // // 인포윈도우 생성
        // const infowindow = new window.kakao.maps.InfoWindow({
        //   content: `<div style="padding:5px;">${data.result.address_name}</div>`
        // });
        // infowindow.open(map, newMarker);
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">카카오맵 검색 테스트</h1>

      {/* 검색 UI */}
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="주소를 입력하세요 (예: 서울시 강남구 테헤란로)"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch}>검색</Button>
      </div>

      {/* 지도 컨테이너 */}
      <div className="relative">
        <div
          id="map"
          className="w-full h-96 border border-gray-300 rounded-lg"
          style={{ height: "400px" }}
        />
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">사용 방법:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>
            검색창에 주소를 입력하고 &ldquo;검색&rdquo; 버튼을 클릭하거나
            Enter를 누릅니다.
          </li>
          <li>검색된 위치에 마커가 표시되고 지도 중심이 이동됩니다.</li>
        </ol>
      </div>
    </div>
  );
}
