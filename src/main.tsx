import { createRoot } from 'react-dom/client'

// --- 정적 스타일 파일 import --- (그외 글로벌 스타일은 App.tsx에)
// nomalize.css 설명
// 브라우저의 내장 스타일을 최대한 건들지 않는 선에서
// 브라우저간 상이한 스타일 통일
import '@/styles/normalize.css'
import '@/styles/variables.css'

import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
