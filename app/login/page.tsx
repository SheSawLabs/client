"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, COLORS } from "@/constants";

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    // 에러 파라미터 체크
    const error = searchParams.get("error");
    if (error) {
      let errorMessage = "로그인에 실패했습니다. 다시 시도해주세요.";

      switch (error) {
        case "auth_failed":
          errorMessage = "카카오 인증에 실패했습니다.";
          break;
        case "no_code":
          errorMessage = "인증 코드가 제공되지 않았습니다.";
          break;
        case "process_failed":
          errorMessage = "로그인 처리 중 오류가 발생했습니다.";
          break;
      }

      alert(errorMessage);
      // URL에서 에러 파라미터 제거
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleKakaoLogin = () => {
    if (typeof window !== "undefined") {
      window.location.href = `${API_BASE_URL}/auth/kakao`;
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col justify-center items-center px-6 overflow-hidden">
      <div
        className="w-full max-w-sm flex flex-col justify-center items-center"
        style={{ height: "calc(100vh - 3rem)" }}
      >
        {/* 메인 이미지 */}
        <div className="flex justify-center mb-16">
          <Image
            src="/assets/shesaw_main_image.svg"
            alt="Shesaw 메인 이미지"
            width={200}
            height={200}
            className="w-48 h-48"
          />
        </div>

        {/* 카카오 로그인 버튼 */}
        {isMounted && (
          <div className="w-full">
            <Button
              onClick={handleKakaoLogin}
              className="w-full text-black font-medium py-4 text-base rounded-lg flex items-center justify-center gap-3"
              style={{
                backgroundColor: COLORS.KAKAO_YELLOW,
                border: "none",
              }}
              size="lg"
            >
              <Image
                src="/icons/kakao.svg"
                alt="카카오 아이콘"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              카카오로 시작하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
