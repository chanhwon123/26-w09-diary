# 감정 일기 — React + Supabase (`26-w09-diary`)

> 이 프로젝트는 React와 Supabase를 활용하여 제작한 감정 일기 웹 애플리케이션입니다.

## 소개

감정 일기는 하루 동안 느꼈던 감정과 생각을 기록하고 관리할 수 있는 웹 애플리케이션입니다.

사용자는 기쁨, 평온, 슬픔, 화남, 불안의 다섯 가지 감정 중 하나를 선택하고 일기를 작성할 수 있습니다.

주요 기능은 다음과 같습니다.

- 5가지 감정 선택 및 일기 작성
- 작성한 일기 저장 및 최신순 조회
- 감정별 일기 필터링
- 작성한 일기 삭제
- Supabase를 활용한 데이터 저장
- PC와 스마트폰에서 동일한 일기 조회
- 책과 독서 노트를 연상시키는 감성적인 UI 디자인

## 어떻게 만들었나요

GitHub Codespaces 환경에서 GitHub Copilot의 Plan 모드와 Agent를 활용하여 개발했습니다.

1. Copilot Plan 모드를 통해 프로젝트의 요구사항과 구현 계획을 정리했습니다.
2. React와 Vite를 기반으로 프로젝트를 구성했습니다.
3. Supabase 클라이언트를 초기화하고 데이터 조회, 추가, 삭제 기능을 API 모듈로 분리했습니다.
4. 감정 선택, 일기 작성, 목록 조회, 감정 필터 및 삭제 기능을 구현했습니다.
5. Tailwind CSS와 CSS를 활용하여 UI를 구성하고 반응형 디자인을 적용했습니다.
6. Codespaces에서 실행 및 기능을 확인하고 README와 배포 준비를 진행했습니다.

## 데이터는 어디에 저장되나요

일기 데이터는 Supabase의 `diaries` 테이블에 저장됩니다.

| 컬럼 | 설명 |
|---|---|
| `id` | 일기 고유 번호 |
| `content` | 일기 본문 |
| `emotion` | 일기에 기록한 감정 |
| `created_at` | 일기 작성 날짜 및 시간 |

8주차 To-Do 실습에서는 `localStorage`를 사용하여 브라우저 내부에 데이터를 저장했습니다.

이번 프로젝트에서는 Supabase 데이터베이스를 사용하여 서버에 데이터를 저장한다는 차이가 있습니다.

따라서 같은 Supabase 데이터베이스에 연결하는 다른 기기나 브라우저에서도 데이터를 조회할 수 있습니다. 단, 인터넷 연결과 데이터베이스 접근 권한이 필요합니다.

일기 작성 및 삭제 후 목록을 다시 조회하는 방식으로 데이터를 갱신하며, Realtime 웹소켓 기능은 사용하지 않았습니다.

## 보안에서 확인한 것 (사이버보안과 체크포인트)

### 1. Supabase 키 관리

Supabase URL과 Publishable Key를 `.env.local` 파일에 보관했습니다.

`.env.local` 파일은 `.gitignore`에 등록하여 GitHub 저장소에 업로드되지 않도록 관리했습니다.

환경변수를 사용하면 설정값을 코드와 분리하여 관리할 수 있습니다.

### 2. 공개 키의 특성과 보안

Vite의 환경변수는 `VITE_` 접두사가 붙은 경우 브라우저에 전달되므로 Supabase Publishable Key는 개발자 도구의 Network 탭이나 배포된 코드에서 확인될 수 있습니다.

Publishable Key는 공개적으로 사용하도록 설계된 키이므로, 키 자체를 숨기는 것만으로 데이터가 보호되지는 않습니다.

실제 데이터 보호를 위해서는 Supabase의 RLS(Row Level Security) 정책과 적절한 접근 권한 설정이 중요합니다.

Secret Key 또는 Service Role Key는 클라이언트 코드에 포함하면 안 됩니다.

### 3. RLS 정책의 한계와 위험성

## 실행 및 배포 링크

- Netlify 배포 URL: https://luxury-cheesecake-53ccb5.netlify.app/
- GitHub Pages 배포 URL: 
- GitHub 저장소: [26-w09-diary