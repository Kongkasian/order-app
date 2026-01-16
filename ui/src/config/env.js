/**
 * 환경 변수 설정 유틸리티
 * Vite의 환경 변수에 안전하게 접근하는 함수들을 제공합니다.
 */

/**
 * API 기본 URL을 반환합니다.
 * @returns {string} API 서버 URL
 */
export const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // 환경 변수가 설정되지 않았을 때 기본값 반환
  if (!apiUrl || apiUrl === 'undefined') {
    // 개발 환경인지 프로덕션 환경인지 확인
    const isDevelopment = import.meta.env.DEV;
    return isDevelopment ? 'http://localhost:3001' : '';
  }
  
  // 환경 변수가 설정되어 있으면 그대로 반환
  return apiUrl;
};

/**
 * 현재 환경이 개발 환경인지 확인합니다.
 * @returns {boolean} 개발 환경 여부
 */
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

/**
 * 현재 환경이 프로덕션 환경인지 확인합니다.
 * @returns {boolean} 프로덕션 환경 여부
 */
export const isProduction = () => {
  return import.meta.env.PROD;
};

/**
 * 현재 환경 모드를 반환합니다.
 * @returns {string} 'development' | 'production'
 */
export const getEnvMode = () => {
  return import.meta.env.MODE;
};

/**
 * 모든 환경 변수를 반환합니다 (디버깅용).
 * @returns {object} 환경 변수 객체
 */
export const getAllEnvVars = () => {
  return {
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    VITE_API_URL: import.meta.env.VITE_API_URL,
  };
};

// 기본 API URL 내보내기
export const API_BASE_URL = getApiBaseUrl();
