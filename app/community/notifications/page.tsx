"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";

interface NotificationKeyword {
  id: number;
  user_id: number;
  keyword: string;
  created_at: string;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<NotificationKeyword[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["신림동"]);
  const [isLoading, setIsLoading] = useState(false);

  // 키워드 목록 조회
  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/notifications/keywords",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        setKeywords(result.data || []);
      }
    } catch (error) {
      console.error("키워드 목록 조회 실패:", error);
    }
  };

  const handleAddKeyword = async () => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) return;

    if (trimmedKeyword.length > 20) {
      alert("키워드는 20자 이하로 입력해주세요.");
      return;
    }

    if (keywords.length >= 10) {
      alert("키워드는 최대 10개까지 등록 가능합니다.");
      return;
    }

    if (keywords.some((k) => k.keyword === trimmedKeyword)) {
      alert("이미 등록된 키워드입니다.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/api/notifications/keywords",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN}`,
          },
          body: JSON.stringify({ keyword: trimmedKeyword }),
        },
      );

      if (response.ok) {
        setKeyword("");
        await fetchKeywords();
      } else {
        alert("키워드 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("키워드 등록 실패:", error);
      alert("키워드 등록에 실패했습니다.");
    }
  };

  const handleDeleteKeyword = async (keywordToDelete: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/notifications/keywords/${encodeURIComponent(keywordToDelete)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        await fetchKeywords();
      } else {
        alert("키워드 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("키워드 삭제 실패:", error);
      alert("키워드 삭제에 실패했습니다.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddKeyword();
    }
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    // TODO: 지역 설정 저장 API 호출
    setTimeout(() => {
      setIsLoading(false);
      alert("설정이 저장되었습니다.");
    }, 1000);
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <div className="h-14 flex items-center justify-between px-4 bg-white flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-5 h-5"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827]" aria-hidden="true" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#111827]">
          키워드 알림 설정
        </h1>
        <div className="w-5 h-5" /> {/* 균형을 위한 빈 공간 */}
      </div>

      {/* 메인 콘텐츠 - 스크롤 가능한 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 max-w-[420px] mx-auto w-full">
        {/* 섹션 1: 알림 받을 키워드 등록 */}
        <div className="mt-4">
          <h2 className="text-base font-bold text-[#111827] mb-3">
            알림 받을 키워드 등록
          </h2>

          {/* 키워드 입력 */}
          <div className="h-11 flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="알림 받고 싶은 키워드를 입력해주세요"
              className="flex-1 text-sm text-[#111827] placeholder-[#6B7280] bg-transparent outline-none border-none"
              maxLength={20}
            />
            <button
              onClick={handleAddKeyword}
              className="text-sm text-[#0f5fda] hover:opacity-80 transition-opacity ml-3"
            >
              등록
            </button>
          </div>

          {/* 키워드 목록 */}
          <div className="mt-4 space-y-3 px-2">
            {keywords.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm text-[#0f5fda]">{item.keyword}</span>
                <button
                  onClick={() => handleDeleteKeyword(item.keyword)}
                  className="text-[#0f5fda] hover:opacity-80 transition-opacity"
                  aria-label={`${item.keyword} 삭제`}
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 섹션 2: 키워드 알림 설정 지역 */}
        <div className="mt-10">
          <h2 className="text-base font-bold text-[#111827] mb-3">
            키워드 알림 설정 지역
          </h2>

          <div className="space-y-3">
            {["신림동", "신림동"].map((region, index) => (
              <label
                key={`${region}-${index}`}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(`${region}-${index}`)}
                  onChange={() => toggleRegion(`${region}-${index}`)}
                  className="sr-only"
                />
                <div className="relative w-5 h-5 mr-3">
                  {selectedRegions.includes(`${region}-${index}`) ? (
                    <div className="w-5 h-5 bg-[#0f5fda] rounded border-none flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-white rounded border-2 border-[#0f5fda]" />
                  )}
                </div>
                <span className="text-sm text-[#111827]">{region}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 저장 버튼 - 하단 고정 */}
      <div className="bg-white p-6 flex-shrink-0 max-w-[420px] mx-auto w-full">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full h-12 bg-[#0f5fda] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          aria-disabled={isLoading}
        >
          {isLoading ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
