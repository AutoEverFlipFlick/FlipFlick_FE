import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

  html, body {
    font-family: ${({ theme }) => theme.fontFamily};
    font-weight: ${({ theme }) => theme.fontWeight};
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    line-height: 1.5;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`
