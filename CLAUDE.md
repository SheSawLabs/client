# Claude 개발 가이드

## 일반적 규칙

별도 요청이 없을 시, 코드 작성 시 아래 내용을 항상 적용합니다.

- 항상 한글로 작성합니다.
- 항상 TypeScript를 사용합니다.
- API 호출 시, 항상 React-Query를 사용합니다.
- 모달, 바텀시트, 버튼 기능 구현 요청시 기존에 만들어진 컴포넌트를 재활용합니다.

## React-Query 컨벤션

- queryKey는 해당 API의 엔드포인트를 기반으로 작성합니다.
- queryKey는 배열 형태로 작성하며, 첫 번째 요소는 엔드포인트, 두 번째 요소는 필요한 파라미터를 포함합니다.
  - 예시: 엔드포인트가 '/api/safety/district/:disctrictName' 일때, `['/safety/district/:disctrictName', disctrictName]` 으로 작성.
- query 함수는 queries 디렉토리에 작성합니다.

## 커밋 메시지 컨벤션

커밋 메시지 작성 시 다음 형식을 사용해주세요:

### 말머리 형식

- `feat:` - 새로운 기능 추가
- `fix:` - 버그 수정
- `docs:` - 문서 변경
- `style:` - 코드 스타일 변경 (포맷팅, 세미콜론 등)
- `refactor:` - 코드 리팩토링
- `test:` - 테스트 추가 또는 수정
- `chore:` - 빌드 과정 또는 보조 도구 변경
- `deps`: - 의존성 업데이트
- `perf:` - 성능 개선
- `ci:` - CI/CD 설정 변경

### 메시지 작성 예시

```
feat: 사용자 로그인 기능 추가

로그인 폼 컴포넌트와 인증 로직을 구현했습니다.
- React Hook Form을 사용한 폼 검증
- JWT 토큰 기반 인증
- 로그인 상태 관리
```

## PR 작성 가이드

PR 생성 시 자동으로 템플릿이 적용되며, 다음 항목들을 확인해주세요:

- **Summary**: 변경사항 간략 설명
- **Type of Change**: 적절한 변경 유형 선택
- **Test Plan**: 테스트 완료 여부 체크
- **Checklist**: 코드 리뷰 준비사항 확인

## 컴포넌트 네이밍 규칙

### shadcn/ui 컴포넌트

- 모든 컴포넌트는 **PascalCase**로 명명
- 파일명과 컴포넌트명 모두 동일하게 적용

```typescript
// ✅ 올바른 사용법
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

// ❌ 잘못된 사용법
import { Button } from "@/components/ui/button"; // 소문자
import { card } from "@/components/ui/card"; // 소문자
```

### 설치된 컴포넌트 목록

- `Button` - 다양한 버튼 스타일과 크기
- `Input` - 입력 필드 컴포넌트
- `Card` - 카드 레이아웃 컴포넌트
- `Checkbox` - 체크박스 컴포넌트
- `Sheet` - 사이드바/오버레이 컴포넌트
- `Typography` - 텍스트 스타일링 컴포넌트 (커스텀)

## 개발 명령어

- 기본적으로 pnpm을 사용합니다.
- `pnpm run dev` - 개발 서버 실행
- `pnpm run lint:fix` - ESLint 실행 및 자동 수정
- `pnpm dlx shadcn@latest add [component]` - shadcn/ui 컴포넌트 추가

# MCP 서버

## Figma Dev Mode MCP 규칙

- Figma Dev Mode MCP 서버는 이미지 및 SVG 에셋을 제공할 수 있는 끝점을 제공합니다.
- 중요: Figma Dev Mode MCP 서버가 이미지 또는 SVG에 대한 로컬 호스트 소스를 반환하는 경우 해당 이미지 또는 SVG 소스를 직접 사용하세요.
- 중요: 새로운 아이콘 패키지를 가져오거나 추가하지 마세요. 모든 에셋은 Figma 페이로드에 있어야 합니다.
- 중요: 로컬 호스트 소스가 제공되는 경우 입력 예시를 사용하거나 생성하지 마세요.
