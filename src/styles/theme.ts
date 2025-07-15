// ✅ styles/theme.ts
export const theme = {
  fontFamily: 'var(--font-base)', // 또는 직접 문자열 지정
  fontWeight: 400,
  colors: {
    text: 'var(--color-text)',
    background: 'var(--color-background)',
  },
  backgroundImage: 'var(--background-pattern)',
} as const
