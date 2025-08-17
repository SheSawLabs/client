import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      provider: string;
      providerId: string;
      email: string;
      nickname: string;
      profileImage?: string;
      thumbnailImage?: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface TokenVerifyResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      provider: string;
      providerId: string;
      email: string;
      nickname: string;
    };
  };
}

export interface UserProfile {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      provider: string;
      providerId: string;
      email: string;
      nickname: string;
    };
  };
}

const AUTH_BASE_URL = "http://localhost:3001/auth";

export const useTokenVerifyQuery = (token?: string) => {
  return useQuery({
    queryKey: ["/auth/verify", token],
    queryFn: async (): Promise<TokenVerifyResponse> => {
      if (!token) {
        throw new Error("토큰이 없습니다");
      }

      const response = await fetch(`${AUTH_BASE_URL}/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      token: string,
    ): Promise<{ success: boolean; message: string }> => {
      const response = await fetch(`${AUTH_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // 쿠키에서 토큰 제거
      if (typeof window !== "undefined") {
        document.cookie =
          "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
      queryClient.clear();
    },
  });
};

export const useUserProfileQuery = (token?: string) => {
  return useQuery({
    queryKey: ["/auth/profile", token],
    queryFn: async (): Promise<UserProfile> => {
      if (!token) {
        throw new Error("토큰이 없습니다");
      }

      const response = await fetch(`${AUTH_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
  });
};
