"use client";

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

export default function TopNavPlayground() {
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
            TopNav 컴포넌트
          </h1>
          <p className="text-lg text-gray-600">
            앱 상단 네비게이션 바의 다양한 구성을 테스트해보세요.
          </p>
        </div>

        {/* Basic Variants */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            기본 variants
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            <MobilePreview title="기본 TopNav">
              <div>
                <TopNav
                  title="마이페이지"
                  onBackClick={() => alert("뒤로가기!")}
                  onNotificationClick={() => alert("알림!")}
                />
                <div className="p-6">
                  <p className="text-gray-600 text-center">
                    뒤로가기 + 제목 + 알림
                  </p>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="뒤로가기 없음">
              <div>
                <TopNav
                  title="홈"
                  showBackButton={false}
                  onNotificationClick={() => alert("알림!")}
                />
                <div className="p-6">
                  <p className="text-gray-600 text-center">제목 + 알림만</p>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="알림 없음">
              <div>
                <TopNav
                  title="설정"
                  showNotification={false}
                  onBackClick={() => alert("뒤로가기!")}
                />
                <div className="p-6">
                  <p className="text-gray-600 text-center">뒤로가기 + 제목만</p>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="최소 구성">
              <div>
                <TopNav
                  title="제목만"
                  showBackButton={false}
                  showNotification={false}
                />
                <div className="p-6">
                  <p className="text-gray-600 text-center">제목만 있는 구성</p>
                </div>
              </div>
            </MobilePreview>
          </div>
        </section>

        {/* Different Titles */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            다양한 제목
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            <MobilePreview title="내 정보">
              <div>
                <TopNav
                  title="내 정보"
                  onBackClick={() => alert("뒤로가기")}
                  onNotificationClick={() => alert("알림")}
                />
                <div className="p-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
                    <h3 className="font-medium">사용자 이름</h3>
                  </div>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="주변 안전시설">
              <div>
                <TopNav
                  title="주변 안전시설"
                  onBackClick={() => alert("뒤로가기")}
                  onNotificationClick={() => alert("알림")}
                />
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="h-8 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="커뮤니티">
              <div>
                <TopNav
                  title="커뮤니티"
                  onBackClick={() => alert("뒤로가기")}
                  onNotificationClick={() => alert("알림")}
                />
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded"></div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </MobilePreview>
          </div>
        </section>

        {/* Real Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            실제 사용 예시
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            <MobilePreview title="디테일 페이지">
              <div>
                <TopNav
                  title="안전시설 정보"
                  onBackClick={() => alert("목록으로 돌아가기")}
                  onNotificationClick={() => alert("즐겨찾기 추가")}
                />
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                    <h3 className="text-lg font-semibold">시설명</h3>
                    <p className="text-gray-600 text-sm">
                      시설에 대한 상세 정보가 여기에 표시됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="설정 페이지">
              <div>
                <TopNav
                  title="환경설정"
                  onBackClick={() => alert("메인으로 돌아가기")}
                  showNotification={false}
                />
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span>알림 설정</span>
                      <div className="w-8 h-4 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span>다크 모드</span>
                      <div className="w-8 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="홈페이지">
              <div>
                <TopNav
                  title="SheSaw"
                  showBackButton={false}
                  onNotificationClick={() => alert("알림 목록")}
                />
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        메인 배너
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-gray-100 rounded-lg"></div>
                      <div className="h-24 bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>
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
                {`// 완전한 TopNav
<TopNav 
  title="마이페이지"
  onBackClick={() => router.back()}
  onNotificationClick={() => openNotifications()}
/>

// 홈페이지용 (뒤로가기 없음)
<TopNav 
  title="SheSaw"
  showBackButton={false}
  onNotificationClick={() => openNotifications()}
/>`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">선택적 기능</h3>
              <pre className="bg-gray-50 rounded p-4 text-sm overflow-x-auto">
                {`// 알림 없는 설정 페이지
<TopNav 
  title="환경설정"
  onBackClick={() => router.back()}
  showNotification={false}
/>

// 제목만 있는 간단한 구성
<TopNav 
  title="제목"
  showBackButton={false}
  showNotification={false}
/>`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Props</h3>
              <div className="text-sm space-y-2">
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">title</code>:
                  string
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    showBackButton
                  </code>
                  : boolean (기본값: true)
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    onBackClick
                  </code>
                  : () =&gt; void
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    showNotification
                  </code>
                  : boolean (기본값: true)
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    onNotificationClick
                  </code>
                  : () =&gt; void
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">스타일링</h3>
              <div className="text-sm space-y-2">
                <p>• 높이: 48px (h-12)</p>
                <p>• 배경: 흰색</p>
                <p>• 제목: 중앙 정렬, semibold</p>
                <p>• 아이콘: Figma SVG 사용</p>
                <p>• hover 효과: 버튼 영역 회색 배경</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
