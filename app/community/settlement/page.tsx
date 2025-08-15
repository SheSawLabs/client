"use client";

import { ArrowLeft, Users, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useMySettlementsQuery } from "@/app/queries/settlement";

export default function SettlementListPage() {
  const {
    data: settlementsData,
    isLoading: isSettlementsLoading,
    error: settlementsError,
  } = useMySettlementsQuery();

  const handleBack = () => {
    window.history.back();
  };

  const handleSettlementClick = (settlementId: string, amount: number) => {
    // 정산 받기 페이지로 이동 (settlement_id와 amount를 쿼리 파라미터로 전달)
    window.location.href = `/community/settlement/receive?id=${settlementId}&amount=${amount}`;
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  if (isSettlementsLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-[#0f5fda] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-[#6B7280]">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (settlementsError) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-2">오류가 발생했습니다</p>
          <p className="text-xs text-[#6B7280]">
            {settlementsError instanceof Error
              ? settlementsError.message
              : "알 수 없는 오류"}
          </p>
        </div>
      </div>
    );
  }

  const settlements = settlementsData?.data || [];

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-[#E5E7EB] bg-white flex-shrink-0">
        <button onClick={handleBack} className="p-1" aria-label="뒤로가기">
          <ArrowLeft size={20} className="text-[#111827]" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#111827]">정산 요청</h1>
        <div className="w-8" />
      </header>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 max-w-[420px] mx-auto w-full">
        {settlements.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Users size={48} className="text-[#E5E7EB] mx-auto mb-4" />
              <p className="text-[#6B7280] text-sm">
                아직 받은 정산 요청이 없어요
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {settlements.map((settlement) => {
              const participant = settlement.participants[0]; // 현재 사용자의 참여 정보
              return (
                <div
                  key={settlement.id}
                  className="bg-white border border-[#E5E7EB] rounded-[12px] p-4 mb-3 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center mr-3">
                        <Users size={20} className="text-[#0f5fda]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          정산 요청
                        </p>
                        <div className="flex items-center">
                          <Calendar size={12} className="text-[#6B7280] mr-1" />
                          <p className="text-xs text-[#6B7280]">
                            {formatDate(settlement.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#111827]">
                        {formatAmount(participant.amount)}원
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          participant.payment_status === "pending"
                            ? "bg-[#FEF3C7] text-[#D97706]"
                            : participant.payment_status === "completed"
                              ? "bg-[#D1FAE5] text-[#059669]"
                              : "bg-[#FEE2E2] text-[#DC2626]"
                        }`}
                      >
                        {participant.payment_status === "pending"
                          ? "대기 중"
                          : participant.payment_status === "completed"
                            ? "완료"
                            : "실패"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#6B7280]">전체 금액</p>
                      <p className="text-sm text-[#111827]">
                        {formatAmount(settlement.total_amount)}원
                      </p>
                    </div>

                    {participant.payment_status === "pending" && (
                      <Button
                        onClick={() =>
                          handleSettlementClick(
                            settlement.id,
                            participant.amount,
                          )
                        }
                        className="h-8 px-3 bg-[#0f5fda] text-white text-xs font-medium rounded-[8px] hover:bg-[#0f5fda]/90 flex items-center"
                      >
                        결제하기
                        <ChevronRight size={12} className="ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
