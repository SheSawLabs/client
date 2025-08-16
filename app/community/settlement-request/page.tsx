"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface Neighbor {
  id: string;
  name: string;
  amount: number;
}

export default function SettlementRequestPage() {
  const router = useRouter();
  const [totalAmount, setTotalAmount] = useState(9000);
  const [neighbors, setNeighbors] = useState<Neighbor[]>([
    { id: "1", name: "헤몽", amount: 3000 },
    { id: "2", name: "또리", amount: 3000 },
    { id: "3", name: "나나", amount: 3000 },
  ]);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [editingNeighborId, setEditingNeighborId] = useState<string | null>(
    null,
  );
  const [tempAmount, setTempAmount] = useState("");

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
        setNeighbors(
          neighbors.map((neighbor) =>
            neighbor.id === editingNeighborId
              ? { ...neighbor, amount: newAmount }
              : neighbor,
          ),
        );
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
    // TODO: 정산 요청 API 호출
    console.log("정산 요청하기");
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
          <span className="text-sm text-[#111827]">렛츠고 소분모임</span>
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
            {neighbors.map((neighbor) => (
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
            ))}
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
        >
          정산 요청하기
        </Button>
      </div>
    </div>
  );
}
