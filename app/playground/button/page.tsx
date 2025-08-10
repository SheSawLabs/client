"use client";

import { Button } from "@/components/ui/Button";
import { RefreshCw, Heart, Settings, ArrowLeft } from "lucide-react";
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

export default function ButtonPlayground() {
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
            Button 컴포넌트
          </h1>
          <p className="text-lg text-gray-600">
            다양한 크기와 상태를 가진 버튼 컴포넌트를 테스트해보세요.
          </p>
        </div>

        {/* Size Variants */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            사이즈 variants
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            <MobilePreview title="Small">
              <div className="p-6 space-y-4">
                <Button size="sm">Small 버튼</Button>
                <Button size="sm" disabled>
                  비활성 Small
                </Button>
                <Button size="sm">
                  <RefreshCw className="w-3 h-3" />
                  아이콘 Small
                </Button>
              </div>
            </MobilePreview>

            <MobilePreview title="Medium">
              <div className="p-6 space-y-4">
                <Button size="md">Medium 버튼</Button>
                <Button size="md" disabled>
                  비활성 Medium
                </Button>
                <Button size="md">
                  <Heart className="w-4 h-4" />
                  아이콘 Medium
                </Button>
              </div>
            </MobilePreview>

            <MobilePreview title="Large">
              <div className="p-6 space-y-4">
                <Button size="lg">Large 버튼</Button>
                <Button size="lg" disabled>
                  비활성 Large
                </Button>
                <Button size="lg">
                  <Settings className="w-5 h-5" />
                  아이콘 Large
                </Button>
              </div>
            </MobilePreview>

            <MobilePreview title="Wide">
              <div className="p-6 space-y-4">
                <Button size="wide">Wide 버튼</Button>
                <Button size="wide" disabled>
                  비활성 Wide
                </Button>
                <Button size="wide">
                  <RefreshCw className="w-5 h-5" />
                  전체 새로고침
                </Button>
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
            <MobilePreview title="폼 액션">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">회원가입 폼</h3>
                  <div className="space-y-3">
                    <Button size="wide">회원가입</Button>
                    <Button size="wide" disabled>
                      취소
                    </Button>
                  </div>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="카드 액션">
              <div className="p-6 space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">알림 설정</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    푸시 알림을 받으시겠습니까?
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">허용</Button>
                    <Button size="sm" disabled>
                      거부
                    </Button>
                  </div>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="네비게이션">
              <div className="p-6 space-y-4">
                <Button size="wide">
                  <Heart className="w-4 h-4" />
                  찜한 목록 보기
                </Button>
                <Button size="wide">
                  <Settings className="w-4 h-4" />
                  설정으로 이동
                </Button>
                <Button size="wide" disabled>
                  <RefreshCw className="w-4 h-4" />
                  새로고침 중...
                </Button>
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
                {`// 다양한 크기
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="wide">Wide</Button>

// 비활성화
<Button disabled>비활성 버튼</Button>`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">아이콘과 함께</h3>
              <pre className="bg-gray-50 rounded p-4 text-sm overflow-x-auto">
                {`// 아이콘 버튼
<Button size="md">
  <Heart className="w-4 h-4" />
  좋아요
</Button>

// 로딩 상태
<Button disabled>
  <RefreshCw className="w-4 h-4 animate-spin" />
  로딩 중...
</Button>`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Props</h3>
              <div className="text-sm space-y-2">
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">size</code>:
                  `&quot;sm`&quot; | `&quot;md`&quot; | `&quot;lg`&quot; |
                  `&quot;wide`&quot;
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    disabled
                  </code>
                  : boolean
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">onClick</code>
                  : () =&gt; void
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    children
                  </code>
                  : React.ReactNode
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">스타일링</h3>
              <div className="text-sm space-y-2">
                <p>• 활성 상태: 파란색 배경 (#0f5fda)</p>
                <p>• 비활성 상태: 회색 배경, 회색 텍스트</p>
                <p>• hover 효과: 투명도 90%</p>
                <p>• 폰트: semibold, 다양한 크기</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
