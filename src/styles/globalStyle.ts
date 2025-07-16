import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    html {
        height: 100%;
        font-family: var(--font-base), serif;
        //font-weight: var(--font-weight-base);
        color: var(--color-text);
        background-color: var(--color-background);

    }

    body {
        height: 100%;
        //font-weight: var(--font-weight-base);
        color: var(--color-text);
        //background-color: var(--color-background);
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
