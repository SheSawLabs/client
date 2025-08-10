"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TopNav } from "@/components/ui/TopNav";
import { SideNavigationItem } from "@/components/ui/SideNavigationItem";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { Heart, User, ChevronRight } from "lucide-react";

// iPhone 16 Preview Component (393x852)
function MobilePreview({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-medium mb-2 text-center text-gray-600">
        {title}
      </h3>
      <div className="w-[393px] h-[500px] bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

interface ComponentCardProps {
  title: string;
  description: string;
  route: string;
  preview: React.ReactNode;
}

function ComponentCard({
  title,
  description,
  route,
  preview,
}: ComponentCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={() => router.push(route)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            자세히 보기
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="flex justify-center">{preview}</div>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            UI 컴포넌트 Playground
          </h1>
          <p className="text-lg text-gray-600">
            모바일 앱의 UI 컴포넌트들을 실시간으로 테스트해보세요.
          </p>
        </div>

        {/* Component Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ComponentCard
            title="Button"
            description="다양한 크기와 상태를 가진 버튼 컴포넌트. 아이콘과 함께 사용할 수 있으며, 활성/비활성 상태를 지원합니다."
            route="/playground/button"
            preview={
              <MobilePreview title="">
                <div className="p-6 space-y-4 flex flex-col items-center">
                  <Button size="md">기본 버튼</Button>
                  <Button size="md">
                    <Heart className="w-4 h-4" />
                    아이콘 버튼
                  </Button>
                  <Button size="wide">전체 너비 버튼</Button>
                </div>
              </MobilePreview>
            }
          />

          <ComponentCard
            title="TopNav"
            description="앱 상단 네비게이션 바. 뒤로가기, 제목, 알림 버튼을 포함하며, 각 요소를 선택적으로 표시할 수 있습니다."
            route="/playground/topnav"
            preview={
              <MobilePreview title="">
                <div>
                  <TopNav
                    title="마이페이지"
                    onBackClick={() => {}}
                    onNotificationClick={() => {}}
                  />
                  <div className="p-6 text-center">
                    <p className="text-gray-600">페이지 내용</p>
                  </div>
                </div>
              </MobilePreview>
            }
          />

          <ComponentCard
            title="SideNavigationItem"
            description="사이드바나 메뉴에서 사용하는 네비게이션 아이템. 아이콘과 텍스트, 화살표를 포함하며 클릭 이벤트를 지원합니다."
            route="/playground/sidenavitem"
            preview={
              <MobilePreview title="">
                <div className="divide-y">
                  <SideNavigationItem text="관심 목록" onClick={() => {}} />
                  <SideNavigationItem text="내 정보" onClick={() => {}}>
                    <User className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem text="설정" onClick={() => {}} />
                </div>
              </MobilePreview>
            }
          />

          <ComponentCard
            title="NavigationBar"
            description="하단 탭 네비게이션 바. 현재 경로를 자동으로 감지하여 활성화 상태를 표시하며, 각 탭은 파란색으로 강조됩니다."
            route="/playground/navigationbar"
            preview={
              <MobilePreview title="">
                <div className="relative h-full flex flex-col">
                  <div className="flex-1 p-6 flex items-center justify-center">
                    <p className="text-center text-gray-600">앱 컨텐츠</p>
                  </div>
                  <NavigationBar />
                </div>
              </MobilePreview>
            }
          />
        </div>
      </div>
    </div>
  );
}
