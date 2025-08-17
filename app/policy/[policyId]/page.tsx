"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TopNav } from "@/components/ui/TopNav";
import { PolicyTags } from "@/components/ui/PolicyTags";
import { PolicyInfoItem } from "@/components/ui/PolicyInfoItem";
import { Button } from "@/components/ui/Button";
import { usePolicyDetailQuery } from "@/queries/policy";

interface PolicyDetailPageProps {
  params: {
    policyId: string;
  };
}

function PolicyDetailPage({ params }: PolicyDetailPageProps) {
  const router = useRouter();
  const { policyId } = params;

  // ChunkLoadError 방지를 위한 에러 핸들링
  useEffect(() => {
    const handleChunkLoadError = (event: ErrorEvent) => {
      if (
        event.message?.includes("Loading chunk") ||
        event.message?.includes("ChunkLoadError")
      ) {
        console.warn("ChunkLoadError detected, attempting to reload page");
        window.location.reload();
      }
    };

    window.addEventListener("error", handleChunkLoadError);

    return () => {
      window.removeEventListener("error", handleChunkLoadError);
    };
  }, []);

  const {
    data: policy,
    isLoading,
    isError,
    error,
  } = usePolicyDetailQuery(policyId);

  const handleBackClick = () => {
    router.push("/policy");
  };

  const handleApplyClick = () => {
    if (policy?.link) {
      window.open(policy.link, "_blank");
    }
  };

  // 캘린더 아이콘
  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M17.5 3.33334H16.6667V2.5C16.6667 2.04167 16.2917 1.66667 15.8333 1.66667C15.375 1.66667 15 2.04167 15 2.5V3.33334H5V2.5C5 2.04167 4.625 1.66667 4.16667 1.66667C3.70833 1.66667 3.33333 2.04167 3.33333 2.5V3.33334H2.5C1.58333 3.33334 0.833333 4.08334 0.833333 5V17.5C0.833333 18.4167 1.58333 19.1667 2.5 19.1667H17.5C18.4167 19.1667 19.1667 18.4167 19.1667 17.5V5C19.1667 4.08334 18.4167 3.33334 17.5 3.33334ZM17.5 17.5H2.5V8.33334H17.5V17.5ZM17.5 6.66667H2.5V5H17.5V6.66667Z"
        fill="currentColor"
      />
    </svg>
  );

  // 사람 아이콘
  const PersonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 10C12.3 10 14.1667 8.13333 14.1667 5.83333C14.1667 3.53333 12.3 1.66667 10 1.66667C7.7 1.66667 5.83333 3.53333 5.83333 5.83333C5.83333 8.13333 7.7 10 10 10ZM10 11.6667C7.225 11.6667 1.66667 13.0583 1.66667 15.8333V17.5C1.66667 18.1917 2.225 18.3333 2.91667 18.3333H17.0833C17.775 18.3333 18.3333 18.1917 18.3333 17.5V15.8333C18.3333 13.0583 12.775 11.6667 10 11.6667Z"
        fill="currentColor"
      />
    </svg>
  );

  // 문서 아이콘
  const DocumentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.5 1.66667H5C4.08333 1.66667 3.33333 2.41667 3.33333 3.33334V16.6667C3.33333 17.5833 4.08333 18.3333 5 18.3333H15C15.9167 18.3333 16.6667 17.5833 16.6667 16.6667V6.66667L12.5 1.66667ZM15 16.6667H5V3.33334H11.6667V7.5H15V16.6667Z"
        fill="currentColor"
      />
    </svg>
  );

  // 하트 아이콘
  const HeartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21L10.55 19.7C5.4 15.36 2 12.27 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.27 18.6 15.36 13.45 19.7L12 21Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
      />
    </svg>
  );

  if (isLoading) {
    return (
      <div className="bg-white">
        <TopNav title="정책 상세" onBackClick={handleBackClick} />
        <div className="px-7 pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !policy) {
    return (
      <div className="bg-white">
        <TopNav title="정책 상세" onBackClick={handleBackClick} />
        <div className="px-7 pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">
              {error instanceof Error
                ? error.message
                : "정책 정보를 불러올 수 없습니다."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <TopNav title="정책 상세" onBackClick={handleBackClick} />

      <div className="px-7 pt-6 pb-8">
        {/* PolicyTags와 하트 아이콘 */}
        <div className="flex items-center justify-between mb-6">
          <PolicyTags policy={policy} />
          <HeartIcon />
        </div>

        {/* 정책명 */}
        <h1 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
          {policy.title}
        </h1>

        {/* 정책 내용 */}
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          {policy.description}
        </p>

        {/* 정책 정보 섹션들 */}
        <div className="space-y-6 mb-8">
          <PolicyInfoItem
            icon={<CalendarIcon />}
            label="신청기간"
            content={policy.application_period}
          />

          <PolicyInfoItem
            icon={<PersonIcon />}
            label="신청자격"
            content={policy.eligibility_criteria}
          />

          <PolicyInfoItem
            icon={<DocumentIcon />}
            label="상세안내"
            content={policy.description}
          />
        </div>

        {/* 신청하러 가기 버튼 */}

        <Button
          onClick={handleApplyClick}
          size="wide"
          className="text-base font-medium"
          disabled={!policy.link}
        >
          신청하러 가기
        </Button>
      </div>
    </div>
  );
}

export default PolicyDetailPage;
