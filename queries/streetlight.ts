import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants";
import { StreetlightResponse } from "@/types/streetlight";

export const useStreetlightQuery = (dongName: string | null) => {
  return useQuery({
    queryKey: ["streetlight", dongName],
    queryFn: async (): Promise<StreetlightResponse> => {
      if (!dongName) {
        throw new Error("동 이름이 필요합니다");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/streetlight/dong/${encodeURIComponent(dongName)}`,
      );

      if (!response.ok) {
        throw new Error("가로등 데이터를 불러오는데 실패했습니다");
      }

      return response.json();
    },
    enabled: !!dongName,
  });
};
