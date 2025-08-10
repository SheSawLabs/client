"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Calendar, MapPin, Users } from "lucide-react";
import { cn } from "@/utils/cn";

const categories = [
  { id: "safety", label: "안전 수리" },
  { id: "small_group", label: "소분 모임", active: true },
  { id: "hobby", label: "취미·기타" },
];

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "group"; // "group" 또는 "post"

  const [title, setTitle] = useState("");
  const [activeCategory, setActiveCategory] = useState("small_group");
  const [description, setDescription] = useState("");
  const [meetingDate] = useState("2025-08-01");
  const [meetingPlace] = useState("신림동 하이마트");
  const [maxMembers] = useState("12명");

  const isGroup = type === "group";

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (isGroup) {
      console.log("모임 생성:", {
        title,
        activeCategory,
        description,
        meetingDate,
        meetingPlace,
        maxMembers,
      });
    } else {
      console.log("일반 게시글 생성:", {
        title,
        description,
      });
    }
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
      <div className="flex-1 px-4 py-6 space-y-6">
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
                    "flex-1 px-4 py-2 text-sm rounded-lg transition-colors duration-100",
                    activeCategory === category.id
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100 text-gray-700",
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
            <div className="flex items-center h-12 py-0 px-4">
              <Calendar
                size={16}
                className="text-gray-500"
                aria-hidden="true"
              />
              <span className="ml-3 text-sm text-gray-500 flex-1">
                모임 날짜
              </span>
              <span className="text-sm text-gray-900">{meetingDate}</span>
            </div>
            <div className="h-px bg-gray-200 mx-4"></div>

            <div className="flex items-center h-12 py-0 px-4">
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
              <span className="text-sm text-gray-900">{maxMembers}</span>
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
            className="w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isGroup ? "모임 만들기" : "게시글 작성하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
