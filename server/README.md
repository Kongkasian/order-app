# 커피 주문 앱 백엔드 서버

Express.js를 사용한 RESTful API 서버입니다.

## 설치

```bash
npm install
```

## 실행

### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

## 환경 변수

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

기본 포트는 3000이며, `.env` 파일에서 `PORT` 환경 변수로 변경할 수 있습니다.

## API 엔드포인트

- `GET /` - 서버 상태 확인
- `GET /api/menus` - 메뉴 목록 조회 (추후 구현)
- `POST /api/orders` - 주문 생성 (추후 구현)
- `GET /api/orders` - 주문 목록 조회 (추후 구현)
- 기타 API는 PRD.md 문서를 참고하세요.

## 포트

기본 포트: 3000
환경 변수 `PORT`로 변경 가능합니다.
