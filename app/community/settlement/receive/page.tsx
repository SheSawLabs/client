"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Users,
  ChevronRight,
  Receipt,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { startSettlement } from "@/app/queries/settlement";

// 토스페이먼츠 SDK 확인
const getTossPayments = () => {
  if (
    typeof window !== "undefined" &&
    (window as unknown as { TossPayments?: unknown }).TossPayments
  ) {
    return (window as unknown as { TossPayments: unknown }).TossPayments;
  }
  throw new Error("토스페이먼츠 SDK가 로드되지 않았습니다.");
};

export default function SettlementReceivePage() {
  const searchParams = useSearchParams();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settlementId, setSettlementId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    const id = searchParams.get("id");
    const amountParam = searchParams.get("amount");

    console.log("URL 파라미터 확인:", { id, amountParam });

    if (id) {
      setSettlementId(id);
      console.log("settlementId 설정됨:", id);
    }
    if (amountParam) {
      const parsedAmount = parseInt(amountParam, 10);
      setAmount(parsedAmount);
      console.log("amount 설정됨:", parsedAmount);
    }
  }, [searchParams]);
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
    console.log("확인 버튼 클릭됨");
    setShowConfirmModal(true);
  };

  const handleSend = async () => {
    try {
      setIsProcessing(true);

      if (!settlementId) {
        throw new Error("정산 ID가 없습니다.");
      }

      console.log("정산 시작...", { settlementId, amount });

      // 1. 정산 시작 API 호출
      console.log("정산 시작 API 호출 중...", settlementId);

      const settlementData = await startSettlement(settlementId);
      console.log("정산 시작 API 응답:", settlementData);

      if (!settlementData.success) {
        throw new Error("정산 시작 API 호출 실패");
      }

      // 2. 토스페이먼츠 결제 위젯 실행
      console.log("토스페이먼츠 SDK 확인 중...");
      const TossPayments = getTossPayments();
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

      console.log("클라이언트 키:", clientKey);
      console.log("TossPayments:", TossPayments);

      if (!clientKey) {
        throw new Error("토스페이먼츠 클라이언트 키가 설정되지 않았습니다.");
      }

      const tossPayments = TossPayments(clientKey);

      // 현재 도메인 기반으로 콜백 URL 생성
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/community/settlement/success`;
      const failUrl = `${baseUrl}/community/settlement/fail`;

      const paymentData = {
        amount: settlementData.data.amount,
        orderId: settlementData.data.orderId,
        orderName: settlementData.data.orderName,
        successUrl,
        failUrl,
      };

      console.log("결제 요청 데이터:", paymentData);
      sessionStorage.setItem("lastPaymentData", JSON.stringify(paymentData));

      // 가상계좌로 결제 (앱 호출 없이 웹에서 직접 처리)
      console.log("가상계좌 결제 요청 시작...");

      // 모달 먼저 닫기
      setShowConfirmModal(false);

      // 가상계좌 결제 요청 (orderId는 서버에서 받은 것을 그대로 사용)
      tossPayments.requestPayment("가상계좌", {
        amount: settlementData.data.amount,
        orderId: settlementData.data.orderId,
        orderName: settlementData.data.orderName,
        successUrl,
        failUrl,
        customerEmail: "test@example.com",
        customerName: "테스트사용자",
        customerMobilePhone: "01012345678",
        validHours: 24, // 가상계좌 유효시간 24시간
        cashReceipt: {
          type: "소득공제",
        },
      });

      console.log("가상계좌 결제 요청 완료");
    } catch (error) {
      console.error("정산 처리 오류 상세:", error);
      console.error(
        "오류 스택:",
        error instanceof Error ? error.stack : "스택 없음",
      );
      alert(
        `정산 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    } finally {
      setIsProcessing(false);
    }
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
            <p className="text-sm text-[#6B7280] mb-3">보낼 금액</p>
            <p className="text-2xl font-extrabold text-[#111827]">
              {amount > 0 ? amount.toLocaleString() : "0"} 원
            </p>
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
                {amount > 0 ? amount.toLocaleString() : "0"}원 보낼까요?
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
                disabled={isProcessing}
                className="flex-1 h-12 bg-[#0f5fda] text-white font-semibold rounded-[12px] hover:bg-[#0f5fda]/90 disabled:opacity-50"
              >
                {isProcessing ? "처리 중..." : "보내기"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
