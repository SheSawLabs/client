"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SettlementFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-2xl text-red-500">✕</span>
        </div>
        <h1 className="text-xl font-semibold text-[#111827] mb-2">정산 실패</h1>
        <p className="text-sm text-[#6B7280] mb-2">
          정산 처리 중 문제가 발생했습니다.
        </p>
        {errorMessage && (
          <p className="text-xs text-[#9CA3AF] mb-6">
            {errorCode && `[${errorCode}] `}
            {errorMessage}
          </p>
        )}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full px-6 py-3 bg-[#0f5fda] text-white rounded-[12px] font-semibold"
          >
            다시 시도하기
          </button>
          <button
            onClick={() => router.push("/community")}
            className="w-full px-6 py-3 bg-[#E5F3FF] text-[#0f5fda] rounded-[12px] font-semibold"
          >
            커뮤니티로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
