/**
 * 정책 관련 유틸리티 함수들
 */

/**
 * 날짜가 유효한 형식인지 확인하는 함수
 * @param dateString 확인할 날짜 문자열
 * @returns 유효한 날짜 형식인지 여부
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString || typeof dateString !== "string") return false;

  // "예산소진시", "상시" 등은 날짜가 아님
  if (dateString.includes("예산소진시") || dateString.includes("상시")) {
    return false;
  }

  // YYYY년 MM월 DD일 형식 또는 YYYY.MM.DD, YYYY-MM-DD 형식 체크
  return (
    (dateString.includes("년") &&
      dateString.includes("월") &&
      dateString.includes("일")) ||
    dateString.includes("-") ||
    dateString.includes(".")
  );
};

/**
 * 한국어 날짜를 Date 객체로 변환하는 함수
 * @param koreanDate 한국어 날짜 문자열 (예: "2025년 08월 14일")
 * @returns Date 객체 또는 null
 */
const parseKoreanDate = (koreanDate: string): Date | null => {
  try {
    // "2025년 08월 14일" -> ["2025", "08", "14"]
    const match = koreanDate.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
    if (!match) return null;

    const [, year, month, day] = match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) return null;

    return date;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * D-day 계산 함수
 * @param endDate 마감일 문자열 (예: "2025년 08월 14일" 또는 "2025.02.26 - 2025.02.28")
 * @returns D-day 숫자 (마감일까지 남은 일수) 또는 null (유효하지 않은 날짜인 경우)
 */
export const calculateDDay = (endDate: string): number | null => {
  // 날짜 형식이 아닌 경우 null 반환
  if (!isValidDate(endDate)) {
    return null;
  }

  try {
    let targetDate: Date | null = null;

    // 한국어 날짜 형식 처리 (예: "2025년 08월 14일")
    if (
      endDate.includes("년") &&
      endDate.includes("월") &&
      endDate.includes("일")
    ) {
      targetDate = parseKoreanDate(endDate);
    } else {
      // YYYY.MM.DD - YYYY.MM.DD 형식에서 마감일 추출
      const dateRange = endDate.split(" - ");
      const lastDate = dateRange[dateRange.length - 1];

      // YYYY.MM.DD 또는 YYYY-MM-DD 형식을 Date로 변환
      const formattedDate = lastDate.replace(/\./g, "-");
      targetDate = new Date(formattedDate);
    }

    if (!targetDate || isNaN(targetDate.getTime())) {
      return null;
    }

    const today = new Date();

    // 시간 부분 제거
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error("D-day 계산 중 오류 발생:", error);
    return null;
  }
};

/**
 * 날짜 범위를 표시용 형식으로 포맷팅하는 함수
 * @param dateRange 날짜 범위 문자열 (예: "2025년 08월 14일" 또는 "2025-02-26 - 2025-02-28")
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDateRange = (dateRange: string): string => {
  // 이미 한국어 형식이면 그대로 반환
  if (
    dateRange.includes("년") &&
    dateRange.includes("월") &&
    dateRange.includes("일")
  ) {
    return dateRange;
  }

  // YYYY-MM-DD를 YYYY.MM.DD로 변환
  return dateRange.replace(/-/g, ".");
};

/**
 * 헥스 컬러를 RGBA로 변환하는 함수
 * @param hex 헥스 컬러 코드 (예: "#EF4444")
 * @param alpha 투명도 (0-1 사이의 값)
 * @returns RGBA 색상 문자열 (예: "rgba(239, 68, 68, 0.2)")
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
