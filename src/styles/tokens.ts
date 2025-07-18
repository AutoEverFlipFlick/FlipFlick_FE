// src/styles/tokens.ts
// --------------------------------------------------
// ① 디자인 토큰(색상·타이포·라운드·쉐도우 등) 중앙집중 파일
// --------------------------------------------------

/* 색상 팔레트(8 단계) -------------------------------------------------- */
export const colors = {
  // 무채계열 ------------------------------------------------------------
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#0f172a',
  },

  // 브랜드/테마 ---------------------------------------------------------
  orange: {
    100: '#ffe4d5',
    200: '#ffc6ad',
    300: '#ffa585',
    400: '#ff845c',
    500: '#ff6b3d', // 기준색
    600: '#e55a2b',
    700: '#c24a1f',
    800: '#9f3915',
  },
  blue: {
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
  },
  green: {
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
  },
  /* 필요 시 purple / pink / cyan / yellow / red / indigo 추가 */
} as const

/* 그라데이션 ----------------------------------------------------------- */
export const gradients = {
  orange: `linear-gradient(135deg, ${colors.orange[500]} 0%, ${colors.orange[600]} 50%, ${colors.orange[700]} 100%)`,
  blue: `linear-gradient(135deg, ${colors.blue[500]}   0%, ${colors.blue[600]}   50%, ${colors.blue[700]}   100%)`,
  green: `linear-gradient(135deg, ${colors.green[500]}  0%, ${colors.green[600]}  50%, ${colors.green[700]}  100%)`,
  /* … */
}

/* 그림자(여러 단계로 구분) -------------------------------------------- */
export const shadows = {
  xs: `0 1px 2px rgba(0,0,0,.15)`,
  sm: `0 2px 4px rgba(0,0,0,.20)`,
  md: `0 4px 12px rgba(0,0,0,.25)`,
  lg: `0 8px 24px rgba(0,0,0,.35)`,
}

/* 라운드 · 스페이싱 · 폰트 -------------------------------------------- */
export const radii = { xs: 4, sm: 8, md: 12, lg: 24 } as const
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const
export const fonts = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '2rem',
} as const

export default {
  colors,
  gradients,
  shadows,
  radii,
  spacing,
  fonts,
}
