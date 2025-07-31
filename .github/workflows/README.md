# GitHub Actions 워크플로우 설정 가이드

## PR 코멘트 자동 처리 기능

이 워크플로우는 PR에서 `@claude PR 작성해줘`라고 코멘트하면 Claude API를 사용해 PR 제목과 설명을 자동으로 개선해주는 기능입니다.

### 필요한 설정

#### 1. GitHub 비밀 키 추가

Repository → Settings → Secrets and variables → Actions → Repository secrets에서 다음 키를 추가해주세요:

- **`CLAUDE_API_KEY`**: Anthropic Claude API 키
  - [Anthropic Console](https://console.anthropic.com)에서 API 키를 생성하세요
  - API 키는 `sk-`로 시작합니다

#### 2. 사용 방법

1. PR을 생성합니다
2. PR 코멘트에 `@claude PR 작성해줘`라고 입력합니다
3. GitHub Actions가 자동으로 실행되어 PR 내용을 개선합니다
4. 워크플로우 완료 후 PR 제목과 설명이 업데이트됩니다

#### 3. 작동 조건

- PR에서만 작동합니다 (일반 이슈에서는 작동하지 않음)
- 코멘트에 `@claude`와 `PR 작성해줘`가 모두 포함되어야 합니다
- Repository의 Actions가 활성화되어 있어야 합니다

#### 4. Claude가 분석하는 정보

- 현재 PR 제목과 설명
- 변경된 파일 목록과 변경 내용
- 커밋 메시지들
- 파일 diff 정보

#### 5. 보안 고려사항

- `CLAUDE_API_KEY`는 반드시 GitHub Secrets에 저장하세요
- API 키를 코드에 직접 포함하지 마세요
- 필요한 최소한의 권한만 부여하세요 (contents: read, pull-requests: write, issues: write)

#### 6. 비용 안내

- Claude API 사용량에 따라 비용이 발생할 수 있습니다
- API 사용량은 [Anthropic Console](https://console.anthropic.com)에서 확인할 수 있습니다

### 트러블슈팅

- **워크플로우가 실행되지 않는 경우**: Repository Actions 설정이 활성화되어 있는지 확인하세요
- **API 오류가 발생하는 경우**: `CLAUDE_API_KEY`가 올바르게 설정되어 있는지 확인하세요
- **권한 오류가 발생하는 경우**: GitHub Actions의 권한 설정을 확인하세요
