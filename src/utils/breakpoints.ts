import { css } from 'styled-components'

// 1) 반응형 기준 해상도
const sizes = {
  mobile: 640,
  tablet: 767,
  notebook: 1024,
  desktop: 1440,
  letina: 2560, // 오타가 아니라면 그대로 둔다
} as const

// 2) 헬퍼 타입
type MediaFn = (...args: Parameters<typeof css>) => ReturnType<typeof css>
type MediaQueries = { readonly [K in keyof typeof sizes]: MediaFn }

// 3) media 유틸
//   사용 예:
//   ${({ theme }) => media.mobile`
//     color: ${theme.colors.primary};
//   `}
export const media = Object.fromEntries(
  Object.entries(sizes).map(([key, value]) => [
    key,
    (...args: Parameters<typeof css>) => css`
      @media (max-width: ${value}px) {
        ${css(...args)}
      }
    `,
  ]),
) as MediaQueries

export default media
