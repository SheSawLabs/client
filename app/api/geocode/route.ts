import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "주소를 입력해주세요." },
        { status: 400 },
      );
    }

    // 카카오 REST API를 사용하여 지오코딩
    const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    if (!kakaoApiKey) {
      return NextResponse.json(
        { error: "카카오 API 키가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      {
        headers: {
          Authorization: `KakaoAK ${kakaoApiKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("카카오 API 요청 실패");
    }

    const data = await response.json();

    if (data.documents.length === 0) {
      return NextResponse.json(
        { error: "검색된 결과가 없습니다." },
        { status: 404 },
      );
    }

    const result = data.documents[0];

    return NextResponse.json({
      success: true,
      result: {
        address_name: result.address_name,
        x: result.x, // 경도
        y: result.y, // 위도
        place_name: result.address_name,
      },
    });
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { error: "지오코딩 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
