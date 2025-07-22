import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import { GlobalStyle } from '@/styles/globalStyle'

import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './router'

// styled-components의 GlobalStyle을 사용하여 전역 스타일을 정의
// browser-router를 사용하여 라우팅을 시작,
// AppRoutes(route/index.ts)를 통해 페이지 컴포넌트 및 라우팅 관리

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          {/* <CreatePlaylist/> */}
          <AppRoutes />
          {/* <PlaylistPage /> */}
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
