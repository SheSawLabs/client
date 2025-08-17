"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  X,
  Users,
  Edit2,
  ChevronRight,
  Receipt,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useParticipantsQuery } from "@/app/queries/community";
import { useCreateSettlementMutation } from "@/app/queries/settlement";

interface Neighbor {
  id: string;
  name: string;
  amount: number;
  user_id: number;
}

export default function SettlementRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 게시글 제목과 모임 ID 가져오기
  const groupTitle = searchParams.get("title") || "렛츠고 소분모임";
  const postId = searchParams.get("postId") || "";

  const [totalAmount, setTotalAmount] = useState(9000);
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);

  // 모임 참여자 목록 조회
  const { data: participants = [], isLoading: participantsLoading } =
    useParticipantsQuery(postId);

  // 정산 요청 생성
  const createSettlementMutation = useCreateSettlementMutation();
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [editingNeighborId, setEditingNeighborId] = useState<string | null>(
    null,
  );
  const [tempAmount, setTempAmount] = useState("");
  const skipTotalAmountEffect = useRef(false);

  // API에서 가져온 참여자 데이터를 neighbors로 설정
  useEffect(() => {
    if (participants.length > 0) {
      const participantNeighbors = participants.map((participant) => ({
        ...participant,
        amount: Math.floor(totalAmount / participants.length),
      }));
      setNeighbors(participantNeighbors);
    }
  }, [participants, totalAmount]);

  // 총 금액이 변경될 때 개별 금액을 균등 분할 (이웃 수정으로 인한 변경이 아닐 때만)
  useEffect(() => {
    if (neighbors.length > 0 && !skipTotalAmountEffect.current) {
      const perPersonAmount = Math.floor(totalAmount / neighbors.length);
      setNeighbors((prevNeighbors) =>
        prevNeighbors.map((neighbor) => ({
          ...neighbor,
          amount: perPersonAmount,
        })),
      );
    }
    // 플래그 리셋
    skipTotalAmountEffect.current = false;
  }, [totalAmount, neighbors.length]);

  const handleBack = () => {
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  const handleEditAmount = () => {
    setTempAmount(totalAmount.toString());
    setIsEditingAmount(true);
  };

  const handleAmountSubmit = () => {
    const newAmount = parseInt(tempAmount.replace(/,/g, ""), 10);
    if (newAmount && newAmount <= 500000) {
      // 총금액 직접 수정시에는 플래그를 false로 두어 useEffect가 실행되도록 함
      skipTotalAmountEffect.current = false;
      setTotalAmount(newAmount);
    }
    setIsEditingAmount(false);
    setTempAmount("");
  };

  const handleAmountCancel = () => {
    setIsEditingAmount(false);
    setTempAmount("");
  };

  const handleRemoveNeighbor = (id: string) => {
    setNeighbors(neighbors.filter((neighbor) => neighbor.id !== id));
  };

  const handleEditNeighborAmount = (id: string, currentAmount: number) => {
    setEditingNeighborId(id);
    setTempAmount(currentAmount.toString());
  };

  const handleNeighborAmountSubmit = () => {
    if (editingNeighborId) {
      const newAmount = parseInt(tempAmount.replace(/,/g, ""), 10);
      if (newAmount && newAmount <= 500000) {
        // 해당 이웃의 금액만 수정 (다른 이웃들은 그대로 유지)
        const updatedNeighbors = neighbors.map((neighbor) =>
          neighbor.id === editingNeighborId
            ? { ...neighbor, amount: newAmount }
            : neighbor,
        );

        setNeighbors(updatedNeighbors);

        // 총 금액을 모든 개별 금액의 합으로 업데이트
        const newTotalAmount = updatedNeighbors.reduce(
          (sum, neighbor) => sum + neighbor.amount,
          0,
        );

        // 이웃 수정으로 인한 총금액 변경임을 표시 (useEffect 실행 방지)
        skipTotalAmountEffect.current = true;
        setTotalAmount(newTotalAmount);
      }
      setEditingNeighborId(null);
      setTempAmount("");
    }
  };

  const handleNeighborAmountCancel = () => {
    setEditingNeighborId(null);
    setTempAmount("");
  };

  const handleReceiptAttach = () => {
    // TODO: 영수증 첨부 구현
    console.log("영수증 첨부");
  };

  const handlePhotoAttach = () => {
    // TODO: 사진 첨부 구현
    console.log("사진 첨부");
  };

  const handleSubmitRequest = () => {
    if (!postId || neighbors.length === 0) {
      alert("참여자가 없거나 모임 정보가 없습니다.");
      return;
    }

    // 금액 합계 검증
    const participantAmountSum = neighbors.reduce(
      (sum, neighbor) => sum + neighbor.amount,
      0,
    );
    if (participantAmountSum !== totalAmount) {
      alert(
        `참여자 금액 합계(${participantAmountSum.toLocaleString()}원)와 총 금액(${totalAmount.toLocaleString()}원)이 일치하지 않습니다.`,
      );
      return;
    }

    // 모든 참여자가 양수 금액을 가지는지 검증
    const hasInvalidAmount = neighbors.some((neighbor) => neighbor.amount <= 0);
    if (hasInvalidAmount) {
      alert("모든 참여자의 금액은 0원보다 커야 합니다.");
      return;
    }

    // API 요청 데이터 구성
    const settlementData = {
      post_id: postId,
      total_amount: totalAmount,
      participants: neighbors.map((neighbor) => ({
        user_id: neighbor.user_id,
        amount: neighbor.amount,
      })),
    };

    console.log("정산 요청 데이터:", settlementData);
    console.log("neighbors 상태:", neighbors);
    console.log("participants 원본:", participants);

    // 추가 검증
    console.log("각 참여자별 상세 정보:");
    neighbors.forEach((neighbor, index) => {
      console.log(`${index + 1}. ${neighbor.name}:`, {
        id: neighbor.id,
        user_id: neighbor.user_id,
        amount: neighbor.amount,
        user_id_type: typeof neighbor.user_id,
        amount_type: typeof neighbor.amount,
        is_user_id_valid: neighbor.user_id && neighbor.user_id > 0,
        is_amount_valid: neighbor.amount && neighbor.amount > 0,
      });
    });

    createSettlementMutation.mutate(settlementData, {
      onSuccess: (response) => {
        console.log("정산 요청 성공:", response);
        router.push(
          `/community/settlement-history?postId=${postId}&title=${encodeURIComponent(groupTitle)}`,
        ); // 정산 내역 페이지로 이동
      },
      onError: (error) => {
        console.error("정산 요청 실패:", error);
        alert("정산 요청에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-[#E5E7EB]">
        <button
          onClick={handleBack}
          className="flex items-center justify-center"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={20} className="text-[#111827]" />
        </button>
        <h1 className="text-[15px] font-semibold text-[#111827]">
          1/N 요청하기
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

        {/* 총 금액 카드 */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mb-4">
          <div className="mb-3">
            <span className="text-sm text-[#017BFF]">총 금액</span>
          </div>
          <div className="flex items-center mb-2">
            {isEditingAmount ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={tempAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    const numericValue = parseInt(value, 10);
                    if (isNaN(numericValue) || numericValue <= 500000) {
                      setTempAmount(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAmountSubmit();
                    } else if (e.key === "Escape") {
                      handleAmountCancel();
                    }
                  }}
                  onBlur={handleAmountSubmit}
                  autoFocus
                  className="text-[22px] font-extrabold text-[#111827] bg-transparent border-b-2 border-[#017BFF] outline-none w-32"
                  placeholder="금액"
                />
                <span className="text-[22px] font-extrabold text-[#111827]">
                  원
                </span>
              </div>
            ) : (
              <>
                <span className="text-[22px] font-extrabold text-[#111827]">
                  {totalAmount.toLocaleString()} 원
                </span>
                <button
                  onClick={handleEditAmount}
                  className="flex items-center justify-center ml-2"
                  aria-label="총 금액 편집"
                >
                  <Edit2 size={16} className="text-[#017BFF]" />
                </button>
              </>
            )}
          </div>
          <span className="text-xs text-[#6B7280]">
            최대 50만원까지 입력 가능
          </span>
        </div>

        {/* 이웃 편집 카드 */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mb-4">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-[#111827]">이웃 편집</h2>
          </div>
          <div className="space-y-0">
            {participantsLoading ? (
              <div className="text-center py-4 text-[#6B7280]">
                참여자 목록을 불러오는 중...
              </div>
            ) : neighbors.length === 0 ? (
              <div className="text-center py-4 text-[#6B7280]">
                참여자가 없습니다.
              </div>
            ) : (
              neighbors.map((neighbor) => (
                <div
                  key={neighbor.id}
                  className="flex items-center justify-between h-12"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#EEF4FF] border border-[#DDE6FF] rounded-full flex items-center justify-center">
                      <Users size={16} className="text-[#017BFF]" />
                    </div>
                    <span className="text-sm text-[#111827]">
                      {neighbor.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingNeighborId === neighbor.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={tempAmount}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            const numericValue = parseInt(value, 10);
                            if (isNaN(numericValue) || numericValue <= 500000) {
                              setTempAmount(value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleNeighborAmountSubmit();
                            } else if (e.key === "Escape") {
                              handleNeighborAmountCancel();
                            }
                          }}
                          onBlur={handleNeighborAmountSubmit}
                          autoFocus
                          className="text-sm text-[#111827] bg-transparent border-b border-[#017BFF] outline-none w-16 text-right"
                          placeholder="금액"
                        />
                        <span className="text-sm text-[#111827]">원</span>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleEditNeighborAmount(neighbor.id, neighbor.amount)
                        }
                        className="text-sm text-[#111827] hover:bg-gray-50 px-1 py-0.5 rounded"
                      >
                        {neighbor.amount.toLocaleString()}원
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveNeighbor(neighbor.id)}
                      className="flex items-center justify-center"
                      aria-label={`${neighbor.name} 삭제`}
                    >
                      <X size={14} className="text-[#6B7280]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 첨부 섹션 */}
        <div className="mb-4">
          <button
            onClick={handleReceiptAttach}
            className="flex items-center justify-between w-full h-12 px-0"
          >
            <div className="flex items-center gap-3">
              <Receipt size={16} className="text-[#111827]" />
              <span className="text-sm text-[#111827]">영수증 첨부</span>
            </div>
            <ChevronRight size={14} className="text-[#6B7280]" />
          </button>
          <div className="h-px bg-[#E5E7EB]"></div>
          <button
            onClick={handlePhotoAttach}
            className="flex items-center justify-between w-full h-12 px-0"
          >
            <div className="flex items-center gap-3">
              <Camera size={16} className="text-[#111827]" />
              <span className="text-sm text-[#111827]">사진 첨부</span>
            </div>
            <ChevronRight size={14} className="text-[#6B7280]" />
          </button>
        </div>

        {/* 전체 구분선 */}
        <div className="h-px bg-[#E5E7EB] mb-6"></div>
      </div>

      {/* 하단 고정 CTA */}
      <div className="bg-white p-6 flex-shrink-0 max-w-[420px] mx-auto w-full">
        <Button
          onClick={handleSubmitRequest}
          size="wide"
          className="rounded-xl"
          disabled={
            createSettlementMutation.isPending || neighbors.length === 0
          }
        >
          {createSettlementMutation.isPending ? "요청 중..." : "정산 요청하기"}
        </Button>
      </div>
    </div>
  );
}
