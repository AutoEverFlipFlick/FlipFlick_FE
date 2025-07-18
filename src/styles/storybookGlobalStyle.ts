// src/styles/storybookGlobalStyle.ts
import { createGlobalStyle } from 'styled-components'

export const SBGlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-base);
    background-color: transparent; /* background는 preview.ts에서 설정 */
    color: inherit;
  }

`
