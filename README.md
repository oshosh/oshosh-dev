# 노션 API 기반 기술 블로그

이 프로젝트는 Notion API를 활용한 개인 기술 블로그입니다. Next.js와 React를 기반으로 구축되었으며, 노션 데이터베이스를 CMS(콘텐츠 관리 시스템)로 활용합니다.

## 주요 기능

- 노션 데이터베이스를 활용한 블로그 게시물 관리
- 태그 기반 게시물 필터링
- 반응형 디자인
- 다크 모드 지원
- 댓글 시스템 (Giscus 연동)
- 마크다운 및 코드 하이라이팅 지원
- RSS 피드 생성

## 사용 기술

### 프레임워크 및 핵심 라이브러리

- **Next.js 15.3.0**: React 기반 풀스택 프레임워크, App Router 아키텍처 사용
- **React 19**: UI 컴포넌트 구현
- **TypeScript**: 타입 안정성 확보
- **Tailwind CSS 4.0**: 유틸리티 기반 CSS 프레임워크

### UI 컴포넌트 및 디자인

- **shadcn/ui**: Radix UI 기반 재사용 가능한 컴포넌트 시스템
- **Radix UI**: 접근성이 우수한 헤드리스 UI 컴포넌트
- **Lucide React**: 아이콘 라이브러리
- **Tailwind Merge**: 클래스 병합 유틸리티
- **Class Variance Authority**: 조건부 스타일링
- **Next Themes**: 다크/라이트 모드 전환 기능

### 데이터 관리 및 통신

- **@notionhq/client**: 노션 API 클라이언트
- **notion-to-md**: 노션 콘텐츠를 마크다운으로 변환
- **Tanstack React Query**: 서버 상태 관리 및 캐싱
- ~**React Hook Form**: 폼 관리 및 유효성 검증~
   - **Next JS Server Action**: React Hook Form 대신 사용 (복잡하지 않기 때문에 Server Action 처리로 변경)
- **Zod**: 스키마 검증

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- Notion API 토큰 및 데이터베이스 ID

### 설치 및 설정

1. 저장소 복제

```bash
git clone https://github.com/yourusername/your-blog-repo.git
cd your-blog-repo
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 내용을 추가:

```
NOTION_TOKEN=your_notion_api_token
NOTION_DATABASE_ID=your_notion_database_id
```

4. 개발 서버 실행

```bash
npm run dev
```

5. 브라우저에서 확인
   [http://localhost:3000](http://localhost:3000)에서 블로그 확인
