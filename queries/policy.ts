import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants";
import { PolicyListResponse, Policy } from "@/types/policy";
import { calculateDDay } from "@/utils/policy";

// isEnded 필드가 추가된 확장 Policy 타입
export interface PolicyWithStatus extends Policy {
  dDay: number | null;
  isEnded: boolean;
}

export const usePolicyListQuery = (category?: string) => {
  return useQuery({
    queryKey: ["policies", category],
    queryFn: async () => {
      const url = category
        ? `${API_BASE_URL}/api/policies?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/api/policies`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("정책 데이터를 불러오는데 실패했습니다");
      }

      return response.json();
    },
    select: (data: PolicyListResponse): PolicyWithStatus[] => {
      if (!data?.data || !Array.isArray(data.data)) {
        return [];
      }

      // 각 정책에 dDay와 isEnded 정보 추가
      const transformedPolicies: PolicyWithStatus[] = data.data.map(
        (policy) => {
          const dDay = calculateDDay(policy.application_period);
          const isEnded = dDay !== null && dDay < 0;

          return {
            ...policy,
            dDay,
            isEnded,
          };
        },
      );

      // isEnded가 false인 것들을 먼저, true인 것들을 나중에 정렬
      const sortedPolicies = transformedPolicies.sort((a, b) => {
        // 먼저 isEnded 상태로 정렬 (false가 먼저)
        if (a.isEnded !== b.isEnded) {
          return a.isEnded ? 1 : -1;
        }

        // 같은 상태 내에서는 D-Day 순으로 정렬
        if (a.dDay === null && b.dDay === null) return 0;
        if (a.dDay === null) return 1;
        if (b.dDay === null) return -1;

        return a.dDay - b.dDay;
      });

      return sortedPolicies;
    },
  });
};

// 단일 정책 상세 조회
export const usePolicyDetailQuery = (policyId: string) => {
  return useQuery({
    queryKey: ["policy", policyId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/policies/${policyId}`);

      if (!response.ok) {
        throw new Error("정책 상세 정보를 불러오는데 실패했습니다");
      }

      return response.json();
    },
    select: (data: { success: boolean; data: Policy }): PolicyWithStatus => {
      const policy = data.data;
      const dDay = calculateDDay(policy.application_period);
      const isEnded = dDay !== null && dDay < 0;

      return {
        ...policy,
        dDay,
        isEnded,
      };
    },
    enabled: !!policyId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};
