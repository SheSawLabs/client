"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, COLORS } from "@/constants";

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
