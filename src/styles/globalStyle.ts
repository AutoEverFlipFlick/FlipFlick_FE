import { createGlobalStyle } from 'styled-components'
import { reset } from './reset'

export const GlobalStyle = createGlobalStyle`
  /* CSS Reset - Josh Comeau 스타일 기반 css 초기화 */
  ${reset}
  
  /* Global Styles */
  /* 이하에 전역 스타일 styled-components 형식으로 정의 */
`
