import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("카카오 로그인 에러:", error);
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", request.url),
    );
  }

  if (!code) {
    console.error("인증 코드가 없습니다");
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
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
      const cookieStore = cookies();

      cookieStore.set("authToken", data.data.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: "/",
      });

      cookieStore.set("user", JSON.stringify(data.data.user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: "/",
      });

      return NextResponse.redirect(new URL("/", request.url));
    } else {
      throw new Error(data.message || "로그인에 실패했습니다");
    }
  } catch (error) {
    console.error("로그인 처리 중 오류:", error);
    return NextResponse.redirect(
      new URL("/login?error=process_failed", request.url),
    );
  }
}
