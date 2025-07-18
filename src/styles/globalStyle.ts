// src/styles/globalStyle.ts
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
   

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
  }
  /* Webkit 스크롤바 */
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

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }

  body {
    overflow-y: scroll;
  }

    a {
        text-decoration: none;
        color: inherit;
    }
    
    p {
        margin: 0;
        padding: 0;
    }
    
    html, body, #root {
    }
`
