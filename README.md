# 커피 주문 앱 (COZY)

React와 Express.js를 사용한 커피 주문 관리 애플리케이션입니다.

## 프로젝트 구조

```
order-app/
├── server/          # 백엔드 서버 (Express.js)
├── ui/              # 프런트엔드 (React + Vite)
└── docs/            # 문서
```

## 빠른 시작

### 백엔드 실행
```bash
cd server
npm install
npm run dev
```

### 프런트엔드 실행
```bash
cd ui
npm install
npm run dev
```

## 배포

- 백엔드: Render.com에 배포
- 프런트엔드: Render.com에 배포

자세한 배포 방법은 `docs/` 폴더의 문서를 참고하세요.

## 주요 기능

- 커피 메뉴 주문
- 주문 관리
- 재고 관리
- 관리자 대시보드

## 기술 스택

- **백엔드**: Node.js, Express.js, PostgreSQL
- **프런트엔드**: React, Vite
- **배포**: Render.com

## 문서

- [프로젝트 요구사항 (PRD)](docs/PRD.md)
- [백엔드 배포 가이드](docs/RENDER_SETUP.md)
- [프런트엔드 배포 가이드](docs/RENDER_FRONTEND_DEPLOYMENT.md)
