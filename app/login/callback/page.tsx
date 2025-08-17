"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography } from "@/components/ui/Typography";

export default function LoginCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("카카오 로그인 에러:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
        router.push("/login");
        return;
      }

      if (!code) {
        console.error("인증 코드가 없습니다");
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/auth/kakao/callback?code=${code}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data.token) {
          localStorage.setItem("authToken", data.data.token);

          localStorage.setItem("user", JSON.stringify(data.data.user));

          router.push("/");
        } else {
          throw new Error(data.message || "로그인에 실패했습니다");
        }
      } catch (error) {
        console.error("로그인 처리 중 오류:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
        router.push("/login");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
        <Typography variant="p" className="text-gray-600">
          로그인 처리 중입니다...
        </Typography>
      </div>
    </div>
  );
}
