"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Upload,
  Users,
  ChevronRight,
  Receipt,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SettlementReceivePage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleImageUpload = () => {
    // 이미지 업로드 로직
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 이미지 처리 로직
        console.log("이미지 업로드:", file);
      }
    };
    input.click();
  };

  const handleReceiptCheck = () => {
    // 영수증 확인 페이지로 네비게이션
    console.log("영수증 확인 페이지로 이동");
  };

  const handlePhotoCheck = () => {
    // 사진 확인 페이지로 네비게이션
    console.log("사진 확인 페이지로 이동");
  };

  const handleConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleSend = () => {
    // 정산 보내기 로직
    console.log("정산 보내기 완료");
    setShowConfirmModal(false);
    // 완료 후 이전 페이지로 이동
    window.history.back();
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const handleBack = () => {
    // 뒤로가기
    window.history.back();
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-[#E5E7EB] bg-white flex-shrink-0">
        <button onClick={handleBack} className="p-1" aria-label="뒤로가기">
          <ArrowLeft size={20} className="text-[#111827]" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#111827]">정산하기</h1>
        <div className="w-8" />
      </header>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-6 max-w-[420px] mx-auto w-full flex items-center">
        <div className="w-full">
          {/* 이미지 업로드 영역 */}
          <div className="flex justify-center mb-3">
            <button
              onClick={handleImageUpload}
              className="w-24 h-24 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center"
              aria-label="이미지 추가"
            >
              <Upload size={28} className="text-[#0f5fda]" />
            </button>
          </div>

          {/* 금액 정보 */}
          <div className="text-center mb-6">
            <p className="text-sm text-[#6B7280] mb-3">도윤 님께 보낼 금액</p>
            <p className="text-2xl font-extrabold text-[#111827]">3,000 원</p>
          </div>

          {/* 그룹 정보 */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center">
              <Users size={16} className="text-[#111827] mb-1" />
              <p className="text-sm text-[#111827]">렛츠고 소분모임</p>
            </div>
          </div>

          {/* 목록 항목들 */}
          <div className="mb-6">
            <button
              onClick={handleReceiptCheck}
              className="w-full h-12 flex items-center justify-between px-0 border-b border-[#E5E7EB]"
              aria-label="영수증 확인 페이지로 이동"
            >
              <div className="flex items-center">
                <Receipt size={16} className="text-[#111827] mr-3" />
                <span className="text-sm text-[#111827]">영수증 확인</span>
              </div>
              <ChevronRight size={14} className="text-[#6B7280]" />
            </button>

            <button
              onClick={handlePhotoCheck}
              className="w-full h-12 flex items-center justify-between px-0 border-b border-[#E5E7EB]"
              aria-label="사진 확인 페이지로 이동"
            >
              <div className="flex items-center">
                <Camera size={16} className="text-[#111827] mr-3" />
                <span className="text-sm text-[#111827]">사진 확인</span>
              </div>
              <ChevronRight size={14} className="text-[#6B7280]" />
            </button>
          </div>
        </div>
      </div>

      {/* 하단 고정 CTA */}
      <div className="bg-white p-6 flex-shrink-0 max-w-[420px] mx-auto w-full">
        <Button
          onClick={handleConfirm}
          className="w-full h-12 bg-[#0f5fda] text-white font-semibold rounded-[12px] hover:bg-[#0f5fda]/90"
        >
          확인
        </Button>
      </div>

      {/* 정산 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-[320px] mx-auto">
            {/* 모달 내용 */}
            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-[#111827]">
                도윤 님께 3,000원 보낼까요?
              </p>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                className="flex-1 h-12 bg-[#E5F3FF] text-[#0f5fda] font-semibold rounded-[12px] hover:bg-[#D1E9FF]"
              >
                취소
              </Button>
              <Button
                onClick={handleSend}
                className="flex-1 h-12 bg-[#0f5fda] text-white font-semibold rounded-[12px] hover:bg-[#0f5fda]/90"
              >
                보내기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
