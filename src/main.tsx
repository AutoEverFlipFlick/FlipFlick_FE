import { createRoot } from 'react-dom/client'

// nomalize.css 설명
// 브라우저의 내장 스타일을 최대한 건들지 않는 선에서
// 브라우저간 상이한 스타일 통일
import '@/styles/normalize.css'

// 프로젝트 전역 스타일 부분
// 폰트, 컬러팔레트, 간격 등
import '@/styles/base.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(<App />)
