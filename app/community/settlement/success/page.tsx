"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkPaymentStatus } from "@/app/queries/settlement";

export default function SettlementSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setError("필수 결제 정보가 누락되었습니다.");
      setIsProcessing(false);
      return;
    }

    const cleanedData = {
      paymentKey: String(paymentKey),
      orderId: String(orderId),
      amount: Number(amount),
    };

    let attempts = 0;
    const maxAttempts = 4; // 1분 동안 4번 시도 (15초씩)

    const checkStatus = async () => {
      try {
        attempts++;
        console.log(
          `결제 상태 확인 시도 ${attempts}/${maxAttempts}`,
          cleanedData,
        );

        const result = await checkPaymentStatus(
          cleanedData.orderId,
          cleanedData.paymentKey,
        );
        console.log("결제 상태 조회 API 응답:", result);

        if (result.success && result.data.isPaymentCompleted) {
          setIsProcessing(false);
          setTimeout(() => {
            router.push("/community");
          }, 3000);
        } else if (result.success) {
          // 결제가 아직 완료되지 않음
          throw new Error(`결제 상태: ${result.data.paymentStatus}`);
        } else {
          throw new Error("결제 상태 확인 실패");
        }
      } catch (err) {
        console.error(`결제 상태 확인 시도 ${attempts} 실패:`, err);

        if (attempts < maxAttempts) {
          // 15초 후 다시 시도
          setTimeout(() => {
            checkStatus();
          }, 15000);
        } else {
          // 최대 시도 횟수 초과
          setError("입금 처리 중입니다. 잠시 후 다시 확인해주세요.");
          setIsProcessing(false);
        }
      }
    };

    // 첫 번째 확인은 즉시 시도
    checkStatus();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-red-500">✕</span>
          </div>
          <h1 className="text-xl font-semibold text-[#111827] mb-2">
            결제 처리 실패
          </h1>
          <p className="text-sm text-[#6B7280] mb-6">{error}</p>
          <button
            onClick={() => router.push("/community")}
            className="px-6 py-3 bg-[#0f5fda] text-white rounded-[12px] font-semibold"
          >
            커뮤니티로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center">
        {isProcessing ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#0f5fda] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-xl font-semibold text-[#111827] mb-2">
              입금 처리 확인 중
            </h1>
            <p className="text-sm text-[#6B7280]">
              가상계좌 입금을 확인하고 있습니다...
            </p>
            <p className="text-xs text-[#9CA3AF] mt-2">
              15초마다 자동으로 확인합니다
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-green-500">✓</span>
            </div>
            <h1 className="text-xl font-semibold text-[#111827] mb-2">
              정산 완료!
            </h1>
            <p className="text-sm text-[#6B7280] mb-4">
              정산이 성공적으로 처리되었습니다.
            </p>
            <p className="text-xs text-[#9CA3AF]">
              3초 후 자동으로 이동합니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
