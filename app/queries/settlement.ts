import { API_BASE_URL } from "@/constants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SettlementStartResponse {
  success: boolean;
  data: {
    orderId: string;
    amount: number;
    orderName: string;
    successUrl: string;
    failUrl: string;
  };
}

interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface PaymentConfirmResponse {
  success: boolean;
  data: {
    paymentKey: string;
    orderId: string;
    status: string;
  };
}

interface SettlementParticipant {
  settlement_request_id: string;
  user_id: number;
  amount: number;
  payment_status: "pending" | "completed" | "failed";
  toss_payment_key: string | null;
  toss_order_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Settlement {
  id: string;
  post_id: string;
  creator_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  participants: SettlementParticipant[];
}

interface SettlementDetailResponse {
  success: boolean;
  data: {
    id: string;
    post_id: string;
    creator_id: number;
    total_amount: number;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    created_at: string;
    updated_at: string;
    completed_at: string | null;
    participants: Array<{
      id: string;
      settlement_request_id: string;
      user_id: number;
      amount: number;
      payment_status: "pending" | "paid" | "failed" | "refunded";
      toss_payment_key: string | null;
      toss_order_id: string | null;
      paid_at: string | null;
      created_at: string;
      updated_at: string;
    }>;
  };
}

interface MySettlementsResponse {
  success: boolean;
  data: Settlement[];
}

interface CreateSettlementRequest {
  post_id: string;
  total_amount: number;
  participants: Array<{
    user_id: number;
    amount: number;
  }>;
}

interface CreateSettlementResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    post_id: string;
    creator_id: number;
    total_amount: number;
    status: string;
    created_at: string;
    updated_at: string;
    participants: Array<{
      id: string;
      settlement_request_id: string;
      user_id: number;
      amount: number;
      payment_status: string;
      created_at: string;
      updated_at: string;
    }>;
  };
}

// 정산 시작 API 호출
export const startSettlement = async (
  settlementId: string,
): Promise<SettlementStartResponse> => {
  const token = process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN;

  console.log("정산 시작 API 요청:", {
    url: `${API_BASE_URL}/api/payments/settlement/start`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: { settlementId },
  });

  const response = await fetch(
    `${API_BASE_URL}/api/payments/settlement/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ settlementId }),
    },
  );

  console.log("정산 시작 API 응답 상태:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("정산 시작 API 오류 응답:", errorText);
    throw new Error(
      `정산 시작 API 호출 실패: ${response.status} - ${errorText}`,
    );
  }

  const result = await response.json();
  console.log("정산 시작 API 성공 응답:", result);
  return result;
};

// 결제 상태 조회 API 호출 (서버 API 명세에 맞춤)
export const checkPaymentStatus = async (
  orderId: string,
  paymentKey: string,
): Promise<{
  success: boolean;
  data: {
    orderId: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    amount: number;
    paidAt: string | null;
    settlementId: string;
    isPaymentCompleted: boolean;
  };
}> => {
  const token = process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN;

  const url = `${API_BASE_URL}/api/payments/settlement/status?orderId=${encodeURIComponent(orderId)}&paymentKey=${encodeURIComponent(paymentKey)}`;

  console.log("결제 상태 조회 API 요청:", {
    url,
    orderId,
    paymentKey,
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("결제 상태 조회 API 응답 상태:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("결제 상태 조회 API 오류 응답:", errorText);
    throw new Error(
      `결제 상태 조회 API 호출 실패: ${response.status} - ${errorText}`,
    );
  }

  const result = await response.json();
  console.log("결제 상태 조회 API 성공 응답:", result);
  return result;
};

// 결제 확인 API 호출 (기존 - 호환성 유지)
export const confirmPayment = async (
  paymentData: PaymentConfirmRequest,
): Promise<PaymentConfirmResponse> => {
  const token = process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN;

  console.log("결제 확인 API 요청:", {
    url: `${API_BASE_URL}/api/payments/settlement/confirm`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: paymentData,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/payments/settlement/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    },
  );

  console.log("결제 확인 API 응답 상태:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("결제 확인 API 오류 응답:", errorText);
    throw new Error(
      `결제 확인 API 호출 실패: ${response.status} - ${errorText}`,
    );
  }

  const result = await response.json();
  console.log("결제 확인 API 성공 응답:", result);
  return result;
};

// 내 정산 참여 조회 API 호출
export const fetchMySettlements = async (): Promise<MySettlementsResponse> => {
  const token = process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN;

  console.log("내 정산 참여 조회 API 요청:", {
    url: `${API_BASE_URL}/api/settlements/my/participations`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await fetch(
    `${API_BASE_URL}/api/settlements/my/participations`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log("내 정산 참여 조회 API 응답 상태:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("내 정산 참여 조회 API 오류 응답:", errorText);
    throw new Error(
      `내 정산 참여 조회 API 호출 실패: ${response.status} - ${errorText}`,
    );
  }

  const result = await response.json();
  console.log("내 정산 참여 조회 API 성공 응답:", result);
  return result;
};

// 정산 요청 생성 API 호출
export const createSettlement = async (
  settlementData: CreateSettlementRequest,
): Promise<CreateSettlementResponse> => {
  const token = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;

  console.log("정산 요청 생성 API 요청:", {
    url: `${API_BASE_URL}/api/settlements`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: settlementData,
  });

  const response = await fetch(`${API_BASE_URL}/api/settlements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settlementData),
  });

  console.log("정산 요청 생성 API 응답 상태:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("정산 요청 생성 API 오류 응답:", errorText);
    throw new Error(
      `정산 요청 생성 API 호출 실패: ${response.status} - ${errorText}`,
    );
  }

  const result = await response.json();
  console.log("정산 요청 생성 API 성공 응답:", result);
  return result;
};

// React Query 훅 - 내 정산 참여 조회
export const useMySettlementsQuery = () => {
  return useQuery({
    queryKey: ["/api/settlements/my/participations"],
    queryFn: fetchMySettlements,
  });
};

// 모임별 정산 요청 조회 API 호출
export const fetchPostSettlement = async (
  postId: string,
): Promise<{
  hasSettlement: boolean;
  settlement?: {
    id: string;
    post_id: string;
    creator_id: number;
    total_amount: number;
    status: string;
    created_at: string;
    participants: Array<{
      user_id: number;
      amount: number;
      payment_status: "pending" | "paid" | "failed" | "refunded";
      nickname?: string;
      profile_image?: string;
    }>;
  };
}> => {
  const token = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;

  console.log("모임별 정산 요청 조회 API 요청:", {
    url: `${API_BASE_URL}/api/posts/${postId}/settlement`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await fetch(
    `${API_BASE_URL}/api/posts/${postId}/settlement`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log("모임별 정산 요청 조회 API 응답 상태:", response.status);

  if (response.status === 404) {
    // 정산 요청이 없는 경우
    return { hasSettlement: false };
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("모임별 정산 요청 조회 API 오류 응답:", errorText);
    throw new Error(
      `모임별 정산 요청 조회 API 호출 실패: ${response.status} - ${errorText}`,
    );
  }

  const result = await response.json();
  console.log("모임별 정산 요청 조회 API 성공 응답:", result);

  return {
    hasSettlement: true,
    settlement: result.data,
  };
};

// React Query 훅 - 모임별 정산 요청 조회
export const usePostSettlementQuery = (postId: string) => {
  return useQuery({
    queryKey: ["/api/posts", postId, "settlement"],
    queryFn: () => fetchPostSettlement(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};

// 정산 상세 정보 조회 API 호출
export const fetchSettlementDetail = async (
  settlementId: string,
): Promise<SettlementDetailResponse> => {
  const token = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN;

  console.log("정산 상세 정보 조회 API 요청:", {
    url: `${API_BASE_URL}/api/settlements/${settlementId}`,
    settlementId,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/settlements/${settlementId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && token !== "your_temp_token_here"
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
    },
  );

  console.log("정산 상세 정보 조회 API 응답 상태:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("정산 상세 정보 조회 API 오류 응답:", errorText);
    throw new Error(
      `정산 상세 정보 조회 API 호출 실패: ${response.status} - ${errorText}`,
    );
  }

  const result = await response.json();
  console.log("정산 상세 정보 조회 API 성공 응답:", result);
  return result;
};

// React Query 훅 - 정산 상세 정보 조회
export const useSettlementDetailQuery = (settlementId: string) => {
  return useQuery({
    queryKey: ["/api/settlements", settlementId],
    queryFn: () => fetchSettlementDetail(settlementId),
    enabled: !!settlementId,
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};

// React Query 훅 - 정산 요청 생성
export const useCreateSettlementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSettlement,
    onSuccess: () => {
      // 정산 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["/api/settlements"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/settlements/my/participations"],
      });
      // 모임별 정산 요청 쿼리도 무효화 (새 API)
      queryClient.invalidateQueries({
        queryKey: ["/api/posts"],
      });
    },
  });
};
