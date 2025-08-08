"use client";

import { Button } from "@/components/ui/Button";
import { TopNav } from "@/components/ui/TopNav";
import { RefreshCw, Heart, Settings } from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Button 컴포넌트 Playground</h1>
        <p className="text-gray-600">
          Button 컴포넌트의 다양한 사용 예시를 확인해보세요.
        </p>
      </div>

      <div className="space-y-12">
        {/* Size Variants */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">사이즈 variants</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Button size="sm">Small 버튼</Button>
              <Button size="md">Medium 버튼</Button>
              <Button size="lg">Large 버튼</Button>
            </div>
            <div className="w-full max-w-md">
              <Button size="wide">Wide 버튼 (전체 너비)</Button>
            </div>
          </div>
        </section>

        {/* State Variants */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">상태 variants</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <Button>활성 상태</Button>
            <Button disabled>비활성 상태</Button>
          </div>
        </section>

        {/* With Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">아이콘과 함께</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Button size="sm">
                <RefreshCw className="w-3 h-3" />
                초기화
              </Button>
              <Button size="md">
                <Heart className="w-4 h-4" />
                좋아요
              </Button>
              <Button size="lg">
                <Settings className="w-5 h-5" />
                설정
              </Button>
            </div>
            <div className="w-full max-w-md">
              <Button size="wide">
                <RefreshCw className="w-5 h-5" />
                전체 새로고침
              </Button>
            </div>
          </div>
        </section>

        {/* Real Use Cases */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">실제 사용 예시</h2>
          <div className="space-y-6">
            {/* Form Actions */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">폼 액션</h3>
              <div className="flex gap-3">
                <Button size="md">저장</Button>
                <Button disabled size="md">
                  취소
                </Button>
              </div>
            </div>

            {/* Card Actions */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">카드 액션</h3>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">카드 제목</h4>
                  <p className="text-sm text-gray-600">카드 설명입니다.</p>
                </div>
                <Button size="sm">자세히 보기</Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">내비게이션</h3>
              <div className="space-y-3">
                <Button size="wide">
                  <Heart className="w-4 h-4" />내 찜 목록
                </Button>
                <Button size="wide">
                  <Settings className="w-4 h-4" />
                  설정
                </Button>
              </div>
            </div>

            {/* Loading State Example */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">
                로딩 상태 (disabled 사용)
              </h3>
              <div className="flex gap-3">
                <Button disabled>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  로딩 중...
                </Button>
                <Button size="sm" disabled>
                  처리 중
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">코드 예시</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">기본 사용법</h4>
              <code className="text-sm">
                {`<Button size="md">클릭하세요</Button>
<Button size="lg" disabled>비활성 버튼</Button>`}
              </code>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">아이콘과 함께</h4>
              <code className="text-sm">
                {`<Button size="md">
  <Heart className="w-4 h-4" />
  좋아요
</Button>`}
              </code>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">전체 너비</h4>
              <code className="text-sm">
                {`<Button size="wide">전체 너비 버튼</Button>`}
              </code>
            </div>
          </div>
        </section>

        {/* TopNav Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">TopNav 컴포넌트</h2>
          <div className="space-y-6">
            {/* Basic TopNav */}
            <div className="border rounded-lg overflow-hidden">
              <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">
                기본 TopNav
              </h3>
              <TopNav
                title="마이페이지"
                onBackClick={() => alert("뒤로가기 클릭!")}
                onNotificationClick={() => alert("알림 클릭!")}
              />
            </div>

            {/* TopNav without back button */}
            <div className="border rounded-lg overflow-hidden">
              <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">
                뒤로가기 버튼 없음
              </h3>
              <TopNav
                title="홈"
                showBackButton={false}
                onNotificationClick={() => alert("알림 클릭!")}
              />
            </div>

            {/* TopNav without notification */}
            <div className="border rounded-lg overflow-hidden">
              <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">
                알림 버튼 없음
              </h3>
              <TopNav
                title="설정"
                showNotification={false}
                onBackClick={() => alert("뒤로가기 클릭!")}
              />
            </div>

            {/* Different titles */}
            <div className="border rounded-lg overflow-hidden">
              <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">
                다양한 제목
              </h3>
              <div className="space-y-0 divide-y">
                <TopNav
                  title="내 정보"
                  onBackClick={() => alert("뒤로가기")}
                  onNotificationClick={() => alert("알림")}
                />
                <TopNav
                  title="주변 안전시설"
                  onBackClick={() => alert("뒤로가기")}
                  onNotificationClick={() => alert("알림")}
                />
                <TopNav
                  title="커뮤니티"
                  onBackClick={() => alert("뒤로가기")}
                  onNotificationClick={() => alert("알림")}
                />
              </div>
            </div>

            {/* Minimal TopNav */}
            <div className="border rounded-lg overflow-hidden">
              <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">
                최소 구성
              </h3>
              <TopNav
                title="제목만"
                showBackButton={false}
                showNotification={false}
              />
            </div>
          </div>

          {/* TopNav Code Examples */}
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-medium">TopNav 코드 예시</h3>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">기본 사용법</h4>
              <code className="text-sm block whitespace-pre">
                {`<TopNav 
  title="마이페이지"
  onBackClick={() => router.back()}
  onNotificationClick={() => setShowNotifications(true)}
/>`}
              </code>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">옵션 비활성화</h4>
              <code className="text-sm block whitespace-pre">
                {`<TopNav 
  title="홈"
  showBackButton={false}
  showNotification={false}
/>`}
              </code>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Props 설명</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>title</code>: 네비게이션 바 중앙에 표시될 제목
                </p>
                <p>
                  <code>showBackButton</code>: 뒤로가기 버튼 표시 여부 (기본:
                  true)
                </p>
                <p>
                  <code>onBackClick</code>: 뒤로가기 버튼 클릭시 실행될 함수
                </p>
                <p>
                  <code>showNotification</code>: 알림 버튼 표시 여부 (기본:
                  true)
                </p>
                <p>
                  <code>onNotificationClick</code>: 알림 버튼 클릭시 실행될 함수
                </p>
                <p>
                  <code>className</code>: 추가 CSS 클래스
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
