"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:3001/auth/kakao";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-sm space-y-8">
        {/* 로고 및 제목 */}
        <div className="text-center space-y-4">
          <Typography variant="h1" className="text-3xl font-bold text-gray-900">
            Shesaw
          </Typography>
          <Typography variant="p" className="text-gray-600">
            안전한 우리 동네를 위한 첫 걸음
          </Typography>
        </div>

        {/* 로그인 설명 */}
        <div className="text-center space-y-2">
          <Typography
            variant="h3"
            className="text-xl font-semibold text-gray-900"
          >
            로그인
          </Typography>
          <Typography variant="p" className="text-gray-500 text-sm">
            카카오 계정으로 간편하게 시작하세요
          </Typography>
        </div>

        {/* 카카오 로그인 버튼 */}
        <div className="space-y-4">
          <Button
            onClick={handleKakaoLogin}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-4 text-base"
            size="lg"
          >
            카카오로 로그인하기
          </Button>
        </div>

        {/* 하단 안내 */}
        <div className="text-center">
          <Typography variant="small" className="text-gray-400 text-xs">
            로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </Typography>
        </div>
      </div>
    </div>
  );
}
