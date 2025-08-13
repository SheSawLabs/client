"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Calendar, MapPin, Users } from "lucide-react";
import { cn } from "@/utils/cn";
import { LocationSearchModal } from "@/components/ui/LocationSearchModal";
import { useCreatePostMutation } from "@/app/queries/community";
import type { KakaoPlace } from "@/types/kakao";

const categories = [
  { id: "안전", label: "안전 수리" },
  { id: "소분", label: "소분 모임", active: true },
  { id: "취미", label: "취미·기타" },
];

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "group"; // "group" 또는 "post"

  const [title, setTitle] = useState("");
  // type이 post일 때는 "일반" 카테고리, group일 때는 "소분" 기본값
  const [activeCategory, setActiveCategory] = useState(
    type === "post" ? "일반" : "소분",
  );

  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState("2025-08-01");
  const [meetingPlace, setMeetingPlace] = useState("신림동 하이마트");
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [maxMembers, setMaxMembers] = useState(12);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const isGroup = type === "group";
  const createPostMutation = useCreatePostMutation();

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const postData = {
      title: title.trim(),
      content: description.trim(),
      category: isGroup ? activeCategory : "일반", // 일반 게시글은 무조건 "일반" 카테고리
      location: isGroup ? meetingPlace : undefined,
      date: isGroup ? meetingDate : undefined,
      max_participants: isGroup ? maxMembers : undefined,
    };

    createPostMutation.mutate(postData, {
      onSuccess: () => {
        router.push("/community/groups");
      },
      onError: (error) => {
        console.error("게시글 생성 실패:", error);
        alert("게시글 생성에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  const handleDateRowClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleLocationClick = () => {
    setShowLocationSearch(true);
  };

  const handleLocationSelect = (place: KakaoPlace) => {
    setMeetingPlace(place.place_name);
    setShowLocationSearch(false);
  };

  const formatDisplayDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-5 h-5"
          aria-label="닫기"
        >
          <X size={20} className="text-gray-900" />
        </button>
        <h1 className="text-base font-semibold text-gray-900">
          {isGroup ? "모임 개설" : "일반 게시글"}
        </h1>
        <div className="w-5"></div>
      </header>

      {/* 폼 컨텐츠 */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* 제목/모임명 */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-900"
          >
            {isGroup ? "모임명" : "제목"}
          </label>
          <div className="relative">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isGroup ? "모임 개설에 대한 설명" : "게시글 제목을 입력해주세요"
              }
              maxLength={24}
              className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
            />
            <div className="mt-1 text-right">
              <span className="text-xs text-gray-500">{title.length}/24</span>
            </div>
          </div>
        </div>

        {/* 카테고리 (모임일 때만) */}
        {isGroup && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              카테고리
            </label>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm rounded-full transition-colors duration-100 border-2",
                    activeCategory === category.id
                      ? "bg-[#EEF4FF] text-[#0F5FDA] border-[#0F5FDA]"
                      : "bg-[#F9FAFB] text-[#9CA3AF] border-[#E5E7EB]",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 목록형 입력 (모임일 때만) */}
        {isGroup && (
          <div className="space-y-0 px-4 -mx-4">
            <div
              className="flex items-center h-12 py-0 px-4 cursor-pointer hover:bg-gray-50 relative"
              onClick={handleDateRowClick}
            >
              <Calendar
                size={16}
                className="text-gray-500"
                aria-hidden="true"
              />
              <span className="ml-3 text-sm text-gray-500 flex-1">
                모임 날짜
              </span>
              <div className="relative">
                <span className="text-sm text-gray-900">
                  {formatDisplayDate(meetingDate)}
                </span>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="absolute top-0 opacity-0 pointer-events-none"
                  style={{
                    right: "0",
                    top: "-10px",
                    width: "200px",
                    height: "40px",
                  }}
                />
              </div>
            </div>
            <div className="h-px bg-gray-200 mx-4"></div>

            <div
              className="flex items-center h-12 py-0 px-4 cursor-pointer hover:bg-gray-50"
              onClick={handleLocationClick}
            >
              <MapPin size={16} className="text-gray-500" aria-hidden="true" />
              <span className="ml-3 text-sm text-gray-500 flex-1">
                모임 장소
              </span>
              <span className="text-sm text-gray-900">{meetingPlace}</span>
            </div>
            <div className="h-px bg-gray-200 mx-4"></div>

            <div className="flex items-center h-12 py-0 px-4">
              <Users size={16} className="text-gray-500" aria-hidden="true" />
              <span className="ml-3 text-sm text-gray-500 flex-1">
                최대 멤버 수
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(Number(e.target.value))}
                  min={2}
                  max={100}
                  className="w-12 text-sm text-gray-900 text-right bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1"
                />
                <span className="text-sm text-gray-500">명</span>
              </div>
            </div>
          </div>
        )}

        {/* 내용/모임 소개글 */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-900"
          >
            {isGroup ? "모임 소개글" : "내용"}
          </label>
          <div className="relative">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isGroup
                  ? "모임에 대한 설명을 적어주세요."
                  : "게시글 내용을 입력해주세요"
              }
              maxLength={500}
              rows={6}
              className="w-full px-3.5 py-3 text-sm border border-gray-200 rounded-xl resize-none focus:border-gray-400 focus:outline-none"
            />
            <div className="mt-1 text-right">
              <span className="text-xs text-gray-500">
                {description.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="pt-6">
          <button
            onClick={handleSubmit}
            disabled={createPostMutation.isPending}
            className="w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createPostMutation.isPending
              ? "생성 중..."
              : isGroup
                ? "모임 만들기"
                : "게시글 작성하기"}
          </button>
        </div>
      </div>

      {/* 장소 검색 모달 */}
      <LocationSearchModal
        isOpen={showLocationSearch}
        onClose={() => setShowLocationSearch(false)}
        onSelect={handleLocationSelect}
      />
    </div>
  );
}
