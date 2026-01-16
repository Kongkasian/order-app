# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 환경 변수 설정

### 개발 환경
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```
VITE_API_URL=http://localhost:3001
```

### 배포 환경 (Render)
Render 대시보드에서 Environment Variables 섹션에 다음을 추가하세요:

```
Key: VITE_API_URL
Value: https://your-backend-service.onrender.com
```

> **참고**: `env.example` 파일을 참고하세요.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
