# Claude 개발 가이드

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

## 개발 명령어

- `pnpm run dev` - 개발 서버 실행
- `pnpm run lint:fix` - ESLint 실행 및 자동 수정
- `pnpm dlx shadcn@latest add [component]` - shadcn/ui 컴포넌트 추가
