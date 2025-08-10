"use client";

import { SideNavigationItem } from "@/components/ui/SideNavigationItem";
import {
  ArrowLeft,
  User,
  MapPin,
  BookOpen,
  MessageCircle,
  Star,
  Settings,
  Heart,
  Search,
  Shield,
  Bell,
} from "lucide-react";
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

export default function SideNavItemPlayground() {
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
            SideNavigationItem 컴포넌트
          </h1>
          <p className="text-lg text-gray-600">
            사이드바나 메뉴에서 사용하는 네비게이션 아이템을 테스트해보세요.
          </p>
        </div>

        {/* Basic Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            기본 사용법
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            <MobilePreview title="기본 아이콘">
              <div className="divide-y">
                <SideNavigationItem
                  text="관심 목록"
                  onClick={() => alert("관심 목록 클릭!")}
                />
                <SideNavigationItem
                  text="즐겨찾기"
                  onClick={() => alert("즐겨찾기 클릭!")}
                />
                <SideNavigationItem
                  text="최근 검색"
                  onClick={() => alert("최근 검색 클릭!")}
                />
                <SideNavigationItem
                  text="내 활동"
                  onClick={() => alert("내 활동 클릭!")}
                />
              </div>
            </MobilePreview>

            <MobilePreview title="짧은 텍스트">
              <div className="divide-y">
                <SideNavigationItem
                  text="홈"
                  onClick={() => alert("홈 클릭!")}
                />
                <SideNavigationItem
                  text="설정"
                  onClick={() => alert("설정 클릭!")}
                />
                <SideNavigationItem
                  text="도움말"
                  onClick={() => alert("도움말 클릭!")}
                />
              </div>
            </MobilePreview>

            <MobilePreview title="긴 텍스트">
              <div className="divide-y">
                <SideNavigationItem
                  text="개인정보 보호 설정"
                  onClick={() => alert("개인정보 설정 클릭!")}
                />
                <SideNavigationItem
                  text="알림 및 소리 설정"
                  onClick={() => alert("알림 설정 클릭!")}
                />
                <SideNavigationItem
                  text="앱 정보 및 버전"
                  onClick={() => alert("앱 정보 클릭!")}
                />
              </div>
            </MobilePreview>
          </div>
        </section>

        {/* Custom Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            커스텀 아이콘
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            <MobilePreview title="사용자 관련">
              <div className="divide-y">
                <SideNavigationItem
                  text="내 정보"
                  onClick={() => alert("내 정보!")}
                >
                  <User className="w-6 h-6 text-gray-400" />
                </SideNavigationItem>
                <SideNavigationItem
                  text="즐겨찾기"
                  onClick={() => alert("즐겨찾기!")}
                >
                  <Heart className="w-6 h-6 text-gray-400" />
                </SideNavigationItem>
                <SideNavigationItem
                  text="최근 검색"
                  onClick={() => alert("검색!")}
                >
                  <Search className="w-6 h-6 text-gray-400" />
                </SideNavigationItem>
              </div>
            </MobilePreview>

            <MobilePreview title="앱 기능">
              <div className="divide-y">
                <SideNavigationItem
                  text="주변 안전시설"
                  onClick={() => alert("안전시설!")}
                >
                  <MapPin className="w-6 h-6 text-gray-400" />
                </SideNavigationItem>
                <SideNavigationItem
                  text="정책 정보"
                  onClick={() => alert("정책 정보!")}
                >
                  <BookOpen className="w-6 h-6 text-gray-400" />
                </SideNavigationItem>
                <SideNavigationItem
                  text="커뮤니티"
                  onClick={() => alert("커뮤니티!")}
                >
                  <MessageCircle className="w-6 h-6 text-gray-400" />
                </SideNavigationItem>
              </div>
            </MobilePreview>

            <MobilePreview title="설정 관련">
              <div className="divide-y">
                <SideNavigationItem
                  text="환경 설정"
                  onClick={() => alert("설정!")}
                >
                  <Settings className="w-6 h-6 text-gray-400" />
                </SideNavigationItem>
                <SideNavigationItem
                  text="개인정보 보호"
                  onClick={() => alert("개인정보!")}
                >
                  <Shield className="w-6 h-6 text-gray-400" />
                </SideNavigationItem>
                <SideNavigationItem
                  text="알림 설정"
                  onClick={() => alert("알림!")}
                >
                  <Bell className="w-6 h-6 text-gray-400" />
                </SideNavigationItem>
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
            <MobilePreview title="마이페이지 메뉴">
              <div>
                <div className="p-6 border-b bg-gray-50">
                  <h3 className="font-semibold text-lg">마이페이지</h3>
                </div>
                <div className="divide-y">
                  <SideNavigationItem
                    text="내 활동"
                    onClick={() => alert("내 활동으로 이동")}
                  >
                    <User className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem
                    text="찜한 장소"
                    onClick={() => alert("찜한 장소로 이동")}
                  >
                    <Heart className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem
                    text="최근 검색"
                    onClick={() => alert("최근 검색으로 이동")}
                  >
                    <Search className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem
                    text="설정"
                    onClick={() => alert("설정으로 이동")}
                  >
                    <Settings className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="앱 메뉴">
              <div>
                <div className="p-6 border-b bg-gray-50">
                  <h3 className="font-semibold text-lg">메뉴</h3>
                </div>
                <div className="divide-y">
                  <SideNavigationItem
                    text="안전지도"
                    onClick={() => alert("안전지도로 이동")}
                  >
                    <MapPin className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem
                    text="정책안내"
                    onClick={() => alert("정책안내로 이동")}
                  >
                    <BookOpen className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem
                    text="커뮤니티"
                    onClick={() => alert("커뮤니티로 이동")}
                  >
                    <MessageCircle className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem
                    text="추천 장소"
                    onClick={() => alert("추천 장소로 이동")}
                  >
                    <Star className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                </div>
              </div>
            </MobilePreview>

            <MobilePreview title="설정 메뉴">
              <div>
                <div className="p-6 border-b bg-gray-50">
                  <h3 className="font-semibold text-lg">설정</h3>
                </div>
                <div className="divide-y">
                  <SideNavigationItem
                    text="계정 설정"
                    onClick={() => alert("계정 설정")}
                  >
                    <User className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem
                    text="알림 설정"
                    onClick={() => alert("알림 설정")}
                  >
                    <Bell className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem
                    text="개인정보 보호"
                    onClick={() => alert("개인정보 설정")}
                  >
                    <Shield className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
                  <SideNavigationItem
                    text="앱 정보"
                    onClick={() => alert("앱 정보")}
                  >
                    <BookOpen className="w-6 h-6 text-gray-400" />
                  </SideNavigationItem>
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
                {`// 기본 하트 아이콘
<SideNavigationItem 
  text="관심 목록"
  onClick={() => handleClick()}
/>

// 텍스트만 변경
<SideNavigationItem 
  text="즐겨찾기"
  onClick={() => navigateToFavorites()}
/>`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">커스텀 아이콘</h3>
              <pre className="bg-gray-50 rounded p-4 text-sm overflow-x-auto">
                {`// children으로 아이콘 전달
<SideNavigationItem 
  text="내 정보"
  onClick={() => router.push('/profile')}
>
  <User className="w-6 h-6 text-gray-400" />
</SideNavigationItem>

// 다양한 아이콘들
<MapPin className="w-6 h-6 text-gray-400" />
<Settings className="w-6 h-6 text-gray-400" />`}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Props</h3>
              <div className="text-sm space-y-2">
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">text</code>:
                  string (기본값: `&quot;관심 목록`&quot;)
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
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    className
                  </code>
                  : string
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-medium mb-4">스타일링</h3>
              <div className="text-sm space-y-2">
                <p>• 높이: 56px (h-14)</p>
                <p>• 패딩: 좌우 16px</p>
                <p>• 기본 아이콘: Figma Heart SVG</p>
                <p>• 화살표: Figma Chevron SVG (-rotate-90)</p>
                <p>• hover 효과: 회색 배경</p>
                <p>• 하단 보더: 회색 1px</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
