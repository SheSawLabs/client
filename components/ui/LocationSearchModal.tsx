"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Search } from "lucide-react";
import type { KakaoPlace, KakakoMap } from "@/types/kakao";

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (place: KakaoPlace) => void;
}

declare global {
  interface Window {
    kakao: {
      maps: KakakoMap;
    };
  }
}

export function LocationSearchModal({
  isOpen,
  onClose,
  onSelect,
}: LocationSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // 카카오맵 API 초기화
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        // API 로드 완료
      });
    }
  }, [isOpen]);

  const searchPlaces = async () => {
    if (!searchTerm.trim()) return;
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    setIsLoading(true);
    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(searchTerm, (data: KakaoPlace[], status: string) => {
      setIsLoading(false);
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data.slice(0, 10)); // 최대 10개 결과
      } else {
        setSearchResults([]);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchPlaces();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">장소 검색</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="장소명, 주소를 검색하세요"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={searchPlaces}
            disabled={!searchTerm.trim() || isLoading}
            className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "검색 중..." : "검색"}
          </button>
        </div>

        {/* 검색 결과 */}
        <div className="max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((place, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(place)}
                  className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {place.place_name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {place.road_address_name || place.address_name}
                      </div>
                      {place.category_name && (
                        <div className="text-xs text-blue-600 mt-1">
                          {place.category_name}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : searchTerm && !isLoading ? (
            <div className="p-8 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              장소명이나 주소를 입력해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
