"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, X, Users, Receipt, Camera, Bell } from "lucide-react";
import { usePostSettlementQuery } from "@/app/queries/settlement";

export default function SettlementHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getDefaultProfileImage = () => {
    // 완전 랜덤하게 선택 (매번 다를 수 있음)
    const imageIndex = Math.floor(Math.random() * 2); // 0 또는 1
    return `/images/default-profile-${imageIndex + 1}.png`;
  };

  // URL에서 게시글 제목과 모임 ID 가져오기
  const groupTitle = searchParams.get("title") || "렛츠고 소분모임";
  const postId = searchParams.get("postId") || "";

  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending",
  );

  // 정산 데이터 조회 (새 API 사용)
  const { data: settlementData, isLoading } = usePostSettlementQuery(postId);

  const handleBack = () => {
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  const handleReceiptCheck = () => {
    console.log("영수증 확인");
  };

  const handlePhotoCheck = () => {
    console.log("사진 확인");
  };

  const handleEdit = () => {
    console.log("수정");
  };

  const handleRemind = (name: string) => {
    console.log(`${name}에게 알림 보내기`);
  };

  // 정산 데이터에서 참여자 분류
  const settlement = settlementData?.settlement;
  const pendingParticipants =
    settlement?.participants?.filter((p) => p.payment_status === "pending") ||
    [];
  const completedParticipants =
    settlement?.participants?.filter((p) => p.payment_status === "paid") || [];

  const totalAmount = settlement?.total_amount || 0;
  const requestDate = settlement?.created_at
    ? new Date(settlement.created_at)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(/(\d{4})\. (\d{1,2})\. (\d{1,2})\./, "$1.$2.$3")
    : "요청일 정보 없음";

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-[#E5E7EB]">
          <button onClick={handleBack} aria-label="뒤로가기">
            <ChevronLeft size={20} className="text-[#111827]" />
          </button>
          <h1 className="text-[15px] font-semibold text-[#111827]">
            1/N 정산 내역
          </h1>
          <button onClick={handleClose} aria-label="닫기">
            <X size={20} className="text-[#111827]" />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#6B7280]">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!settlementData?.hasSettlement) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-[#E5E7EB]">
          <button onClick={handleBack} aria-label="뒤로가기">
            <ChevronLeft size={20} className="text-[#111827]" />
          </button>
          <h1 className="text-[15px] font-semibold text-[#111827]">
            1/N 정산 내역
          </h1>
          <button onClick={handleClose} aria-label="닫기">
            <X size={20} className="text-[#111827]" />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#6B7280]">정산 요청이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between h-14 px-4 bg-white">
        <div className="w-8" />
        <h1 className="text-[15px] font-semibold text-[#111827]">
          1/N 정산 내역
        </h1>
        <button
          onClick={handleClose}
          className="flex items-center justify-center"
          aria-label="닫기"
        >
          <X size={20} className="text-[#111827]" />
        </button>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto px-6 max-w-[420px] mx-auto w-full">
        {/* 그룹 정보 */}
        <div className="flex flex-col items-center pt-4 pb-4">
          <Users size={16} className="text-[#111827] mb-2" />
          <span className="text-sm text-[#111827]">{groupTitle}</span>
        </div>

        {/* 금액 카드 */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mb-4">
          {/* 상단 라인 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#017BFF]">총 금액</span>
            <button onClick={handleEdit} className="text-sm text-[#6A88B6]">
              수정
            </button>
          </div>

          {/* 금액 */}
          <div className="mb-2">
            <span className="text-[22px] font-extrabold text-[#111827]">
              {totalAmount.toLocaleString()}원
            </span>
          </div>

          {/* 요청일 */}
          <div className="mb-4">
            <span className="text-xs text-[#6B7280]">
              요청일: {requestDate}
            </span>
          </div>

          {/* 목록형 항목들 */}
          <div className="space-y-0">
            <button
              onClick={handleReceiptCheck}
              className="flex items-center justify-between w-full h-12 px-0"
            >
              <div className="flex items-center gap-3">
                <Receipt size={16} className="text-[#111827]" />
                <span className="text-sm text-[#111827]">영수증 확인</span>
              </div>
              <ChevronLeft size={14} className="text-[#6B7280] rotate-180" />
            </button>
            <div className="h-px bg-[#E5E7EB]"></div>
            <button
              onClick={handlePhotoCheck}
              className="flex items-center justify-between w-full h-12 px-0"
            >
              <div className="flex items-center gap-3">
                <Camera size={16} className="text-[#111827]" />
                <span className="text-sm text-[#111827]">사진 확인</span>
              </div>
              <ChevronLeft size={14} className="text-[#6B7280] rotate-180" />
            </button>
          </div>
        </div>

        {/* 세그먼트 탭 */}
        <div className="mb-4">
          <div className="flex bg-white border border-[#E5E7EB] rounded-xl h-10 p-1">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "pending"
                  ? "bg-[#EEF4FF] text-[#017BFF]"
                  : "bg-white text-[#6B7280]"
              }`}
              role="tab"
              aria-selected={activeTab === "pending"}
            >
              미정산 {pendingParticipants.length}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "completed"
                  ? "bg-[#EEF4FF] text-[#017BFF]"
                  : "bg-white text-[#6B7280]"
              }`}
              role="tab"
              aria-selected={activeTab === "completed"}
            >
              정산 완료 {completedParticipants.length}
            </button>
          </div>
        </div>

        {/* 정산 대상 리스트 */}
        <div className="space-y-3 px-4">
          {activeTab === "pending" && (
            <>
              {pendingParticipants.length > 0 ? (
                pendingParticipants.map((participant) => (
                  <div
                    key={participant.user_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            participant.profile_image ||
                            getDefaultProfileImage()
                          }
                          alt={
                            participant.nickname ||
                            `사용자 ${participant.user_id}`
                          }
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-[#111827]">
                        {participant.nickname ||
                          `사용자 ${participant.user_id}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#111827]">
                        {participant.amount.toLocaleString()}원
                      </span>
                      <button
                        onClick={() =>
                          handleRemind(
                            participant.nickname ||
                              `사용자 ${participant.user_id}`,
                          )
                        }
                        className="w-4 h-4 bg-[#EEF4FF] rounded-full flex items-center justify-center"
                        aria-label={`${participant.nickname || `사용자 ${participant.user_id}`}에게 알림`}
                      >
                        <Bell size={10} className="text-[#017BFF]" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#6B7280]">
                  미정산 참여자가 없습니다.
                </div>
              )}
            </>
          )}

          {activeTab === "completed" && (
            <>
              {completedParticipants.length > 0 ? (
                completedParticipants.map((participant) => (
                  <div
                    key={participant.user_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            participant.profile_image ||
                            getDefaultProfileImage()
                          }
                          alt={
                            participant.nickname ||
                            `사용자 ${participant.user_id}`
                          }
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-[#111827]">
                        {participant.nickname ||
                          `사용자 ${participant.user_id}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#111827]">
                        {participant.amount.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#6B7280]">
                  정산 완료된 참여자가 없습니다.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
