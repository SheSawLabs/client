"use client";

import { NavigationBar } from "@/components/ui/NavigationBar";
import { TopNav } from "@/components/ui/TopNav";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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
      <h3 className="text-sm font-medium mb-3 text-center text-gray-600">
        {title}
      </h3>
      <div className="w-[393px] h-[600px] bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default function NavigationBarPlayground() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/playground")}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Playground로 돌아가기
          </button>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            NavigationBar 컴포넌트
          </h1>
          <p className="text-lg text-gray-600">
            하단 탭 네비게이션 바의 동작과 활성화 상태를 테스트해보세요.
          </p>
        </div>

        {/* Basic Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            기본 사용법
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            <MobilePreview title="홈 활성화 (/)">
              <div className="relative h-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">홈 페이지</h3>
                  <p className="text-gray-600 text-sm mb-4">현재 경로: /</p>
                  <div className="space-y-2">
                    <div className="h-8 bg-blue-100 rounded"></div>
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="h-8 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 w-full">
                  <NavigationBar />
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="NavigationBar만">
              <div className="relative h-full">
                <div className="absolute bottom-0 w-full">
                  <NavigationBar />
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="다른 탭들">
              <div className="relative h-full">
                <div className="p-6">
                  <div className="text-center text-gray-600 text-sm mb-4">
                    실제 앱에서는 현재 경로에 따라
                    <br />
                    해당하는 탭이 파란색으로 활성화됩니다
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 border rounded text-sm">
                      <span className="font-medium">홈 (/):</span> 첫 번째 탭
                      활성화
                    </div>
                    <div className="p-3 border rounded text-sm">
                      <span className="font-medium">지도 (/map):</span> 두 번째
                      탭 활성화
                    </div>
                    <div className="p-3 border rounded text-sm">
                      <span className="font-medium">정보 (/info):</span> 세 번째
                      탭 활성화
                    </div>
                    <div className="p-3 border rounded text-sm">
                      <span className="font-medium">
                        커뮤니티 (/community):
                      </span>{" "}
                      네 번째 탭 활성화
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 w-full">
                  <NavigationBar />
                </div>
              </div>
            </MobilePreview>
          </div>
        </section>

        {/* With TopNav */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            TopNav와 함께
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            <MobilePreview title="완전한 레이아웃">
              <div className="relative h-full flex flex-col">
                <TopNav title="SheSaw" showBackButton={false} />
                <div className="flex-1 p-6">
                  <h3 className="text-lg font-semibold mb-4">메인 컨텐츠</h3>
                  <div className="space-y-4">
                    <div className="h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        배너 영역
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-sm text-gray-600">카드 1</span>
                      </div>
                      <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-sm text-gray-600">카드 2</span>
                      </div>
                    </div>
                  </div>
                </div>
                <NavigationBar />
              </div>
            </MobilePreview>

            <MobilePreview title="서브 페이지">
              <div className="relative h-full flex flex-col">
                <TopNav
                  title="안전지도"
                  onBackClick={() => {}}
                  onNotificationClick={() => {}}
                />
                <div className="flex-1 p-6">
                  <div className="text-center text-gray-600 mb-4">
                    지도 페이지 컨텐츠
                  </div>
                  <div className="h-32 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-green-600">지도 영역</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="h-8 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <NavigationBar />
              </div>
            </MobilePreview>

            <MobilePreview title="커뮤니티">
              <div className="relative h-full flex flex-col">
                <TopNav
                  title="커뮤니티"
                  showBackButton={false}
                  onNotificationClick={() => {}}
                />
                <div className="flex-1 p-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">사용자명</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        커뮤니티 게시글 내용입니다.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">사용자명</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        또 다른 게시글입니다.
                      </p>
                    </div>
                  </div>
                </div>
                <NavigationBar />
              </div>
            </MobilePreview>
          </div>
        </section>

        {/* Interactive Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            상호작용 기능
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            <MobilePreview title="클릭 가능">
              <div className="relative h-full">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      탭 클릭 테스트
                    </h3>
                    <p className="text-gray-600 text-sm">
                      각 탭을 클릭하면 해당 페이지로 이동합니다
                    </p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <span className="font-medium text-blue-700">홈</span>:
                      메인 페이지
                    </div>
                    <div className="p-3 bg-gray-50 border rounded">
                      <span className="font-medium">동네 안전</span>: 지도
                      페이지
                    </div>
                    <div className="p-3 bg-gray-50 border rounded">
                      <span className="font-medium">정책 정보</span>: 정책
                      페이지
                    </div>
                    <div className="p-3 bg-gray-50 border rounded">
                      <span className="font-medium">커뮤니티</span>: 커뮤니티
                      페이지
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 w-full">
                  <NavigationBar />
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="활성 상태 표시">
              <div className="relative h-full">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      활성화 스타일
                    </h3>
                    <p className="text-gray-600 text-sm">
                      현재 페이지에 해당하는 탭이 파란색으로 표시됩니다
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-2">활성 상태:</div>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• 아이콘: 파란색 (#0f5fda)</li>
                        <li>• 텍스트: 파란색, semibold</li>
                        <li>• 투명도: 100%</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-2">비활성 상태:</div>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• 아이콘: 회색</li>
                        <li>• 텍스트: 회색</li>
                        <li>• 투명도: 40%</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 w-full">
                  <NavigationBar />
                </div>
              </div>
            </MobilePreview>
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            코드 예시
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">기본 사용법</h3>
              <pre className="bg-gray-50 rounded p-4 text-sm overflow-x-auto">
                {`// 단독 사용
<NavigationBar />

// 전체 레이아웃과 함께
<div className="relative h-screen">
  <div className="flex-1 overflow-y-auto pb-20">
    {/* 페이지 컨텐츠 */}
  </div>
  <NavigationBar />
</div>`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">MobileLayout과 함께</h3>
              <pre className="bg-gray-50 rounded p-4 text-sm overflow-x-auto">
                {`// MobileLayout에서 자동 포함됨
export function MobileLayout({ children }) {
  return (
    <div className="mobile-container">
      <div className="content">
        {children}
      </div>
      <NavigationBar />
    </div>
  );
}`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">네비게이션 아이템</h3>
              <pre className="bg-gray-50 rounded p-4 text-sm overflow-x-auto">
                {`const navigationItems = [
  { id: "home", label: "홈", href: "/" },
  { id: "map", label: "동네 안전", href: "/map" },
  { id: "info", label: "정책 정보", href: "/info" },
  { id: "community", label: "커뮤니티", href: "/community" }
];`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">특징</h3>
              <div className="text-sm space-y-2">
                <p>• 현재 경로 자동 감지 (usePathname)</p>
                <p>• 클릭 시 페이지 이동 (useRouter)</p>
                <p>• 활성 탭 파란색 스타일링</p>
                <p>• SVG 아이콘 사용</p>
                <p>• 하단 고정 위치 (absolute bottom-0)</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
