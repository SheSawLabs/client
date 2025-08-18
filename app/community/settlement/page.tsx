"use client";

import { X, ChevronRight } from "lucide-react";
import { useMySettlementsQuery } from "@/app/queries/settlement";

export default function SettlementListPage() {
  const {
    data: settlementsData,
    isLoading: isSettlementsLoading,
    error: settlementsError,
  } = useMySettlementsQuery();

  const handleClose = () => {
    window.location.href = "/community/groups";
  };

  const handleNotificationSettings = () => {
    // 알림 설정 페이지로 이동
    console.log("알림 설정으로 이동");
  };

  const handleSettlementClick = (
    settlementId: string,
    amount: number,
    title: string,
  ) => {
    // 정산하러가기
    window.location.href = `/community/settlement/receive?id=${settlementId}&amount=${amount}&title=${encodeURIComponent(title)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;

    return date.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    });
  };

  if (isSettlementsLoading) {
    return (
      <div className="min-h-screen bg-white px-6">
        {/* 상단 헤더 */}
        <header className="h-14 flex items-center justify-between bg-white">
          <div className="w-5"></div>
          <h1 className="text-[15px] font-semibold text-[#111827]">알림</h1>
          <button onClick={handleClose} aria-label="닫기">
            <X size={18} className="text-[#111827]" />
          </button>
        </header>

        <div className="flex items-center justify-center pt-32">
          <p className="text-[#6B7280]">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (settlementsError) {
    return (
      <div className="min-h-screen bg-white px-6">
        {/* 상단 헤더 */}
        <header className="h-14 flex items-center justify-between bg-white">
          <div className="w-5"></div>
          <h1 className="text-[15px] font-semibold text-[#111827]">알림</h1>
          <button onClick={handleClose} aria-label="닫기">
            <X size={18} className="text-[#111827]" />
          </button>
        </header>

        <div className="flex items-center justify-center pt-32">
          <p className="text-red-500">오류가 발생했습니다</p>
        </div>
      </div>
    );
  }

  const settlements = settlementsData?.data || [];

  return (
    <div className="min-h-screen bg-white px-6">
      {/* 상단 헤더 */}
      <header className="h-14 flex items-center justify-between bg-white">
        <div className="w-5"></div>
        <h1 className="text-[15px] font-semibold text-[#111827]">알림</h1>
        <button onClick={handleClose} aria-label="닫기">
          <X size={18} className="text-[#111827]" />
        </button>
      </header>

      {/* 상단 안내 배너 */}
      <button
        onClick={handleNotificationSettings}
        className="w-full h-11 bg-[#EEF4FF] px-4 py-2 flex items-center justify-between rounded-lg mb-4 mt-8"
        role="button"
        aria-label="알림 설정하기"
      >
        <div className="flex items-center">
          <div
            className="w-4 h-4 bg-[#017BFF] rounded-full flex items-center justify-center mr-2"
            aria-hidden="true"
          >
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <span className="text-[13px] text-[#017BFF]">
            알림 받기를 설정하고 유용한 알림들을 받아보세요.
          </span>
        </div>
        <ChevronRight size={14} className="text-[#017BFF]" aria-hidden="true" />
      </button>

      {/* 알림 리스트 */}
      <div className="py-4 space-y-3">
        {settlements.length === 0 ? (
          <div className="text-center pt-32">
            <p className="text-[#6B7280] text-sm">받은 알림이 없습니다</p>
          </div>
        ) : (
          settlements.map((settlement, index) => {
            const participant = settlement.participants[0];
            const showAd = index === 1 || index === 3 || index === 6; // 여러 위치에 광고 표시

            return (
              <>
                <div
                  key={settlement.id}
                  className="bg-white border border-[#E5E7EB] rounded-lg p-3"
                >
                  {/* 상단: 카테고리 라벨 + 시간 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 bg-[#017BFF] rounded-full flex items-center justify-center mr-1"
                        aria-hidden="true"
                      >
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                      <span className="text-xs text-[#6B7280] font-medium">
                        정산
                      </span>
                    </div>
                    <span className="text-xs text-[#6B7280]">
                      {formatDate(settlement.created_at)}
                    </span>
                  </div>

                  {/* 본문 */}
                  <div className="mb-2">
                    <p className="text-sm text-[#111827] leading-[1.4] mb-1">
                      {settlement.post_title}에서 정산요청이 왔어요!
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      내 정산 금액:{" "}
                      <span className="font-bold">
                        {participant.amount.toLocaleString()}원
                      </span>
                    </p>
                  </div>

                  {/* 우측 하단 링크 */}
                  <div className="flex justify-end">
                    {participant.payment_status === "pending" ? (
                      <button
                        onClick={() =>
                          handleSettlementClick(
                            settlement.id,
                            participant.amount,
                            settlement.post_title,
                          )
                        }
                        className="flex items-center text-xs text-[#4B5563]"
                        role="button"
                        aria-label="정산하러가기"
                      >
                        정산하러가기
                        <ChevronRight
                          size={12}
                          className="ml-1 text-[#4B5563]"
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <span className="text-xs text-[#4B5563]">정산 완료</span>
                    )}
                  </div>
                </div>

                {/* 광고 카드 */}
                {showAd && (
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-3">
                    {/* 상단: 카테고리 라벨 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 bg-[#4B5563] rounded-full flex items-center justify-center mr-1"
                          aria-hidden="true"
                        >
                          <span className="text-white text-[8px] font-bold">
                            Ad
                          </span>
                        </div>
                        <span className="text-xs text-[#6B7280] font-medium">
                          광고
                        </span>
                      </div>
                    </div>

                    {/* 본문 */}
                    <div className="mb-2">
                      {index === 1 && (
                        <>
                          <p className="text-sm text-[#111827] leading-[1.4] mb-1">
                            🎉 새로운 할인 혜택을 확인해보세요!
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            지금 가입하면 첫 주문{" "}
                            <span className="font-bold">20% 할인</span>
                          </p>
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <p className="text-sm text-[#111827] leading-[1.4] mb-1">
                            💰 이달 마지막 특가 이벤트!
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            모든 상품{" "}
                            <span className="font-bold">최대 30% 할인</span>
                          </p>
                        </>
                      )}
                      {index === 6 && (
                        <>
                          <p className="text-sm text-[#111827] leading-[1.4] mb-1">
                            🚚 무료 배송 이벤트 진행 중!
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            지금 주문하면{" "}
                            <span className="font-bold">배송비 무료</span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            );
          })
        )}
      </div>
    </div>
  );
}
