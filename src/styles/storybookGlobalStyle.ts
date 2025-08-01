// src/styles/storybookGlobalStyle.ts
import { createGlobalStyle } from 'styled-components'

export const SBGlobalStyle = createGlobalStyle`
  /* 1) box-sizing, margin/padding 초기화 */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* 2) html/body 전역 스타일 (앱 GlobalStyle 참고) */
  html, body {
    font-family: ${({ theme }) => theme.fontFamily};
    font-weight: ${({ theme }) => theme.fontWeight};
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    background-image: ${({ theme }) => theme.backgroundImage};
    line-height: 1.5;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-y: scroll;
  }

  /* 3) 스크롤바 스타일 (WebKit) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* 4) 스크롤바 스타일 (Firefox) */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }

  /* 5) 링크, 문단 초기화 */
  a {
    text-decoration: none;
    color: inherit;
  }
  p {
    margin: 0;
    padding: 0;
  }
`
