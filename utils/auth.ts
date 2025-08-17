export const getAuthTokenFromCookie = (): string | null => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("authToken="),
  );

  return authCookie ? authCookie.split("=")[1] : null;
};

export const getUserFromCookie = (): unknown | null => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const userCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("user="),
  );

  if (!userCookie) return null;

  try {
    const userString = decodeURIComponent(userCookie.split("=")[1]);
    return JSON.parse(userString);
  } catch (error) {
    console.error("사용자 정보 파싱 오류:", error);
    return null;
  }
};

export const removeAuthCookies = (): void => {
  if (typeof window === "undefined") return;

  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
