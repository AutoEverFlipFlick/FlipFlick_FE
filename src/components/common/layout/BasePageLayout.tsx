// BasePageLayout.tsx
// 컨텐트 영역 최대크기 800px, 가운데 정렬
// 헤더, 사이드바, 푸터는 필요에 따라 추가
// 라우터에서 사용도 가능하고 컴포넌트처럼도 사용 가능함
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { ReactNode } from 'react'
import BaseHeaderVer2 from '@/components/common/BaseHeaderVer2'
import AlarmListener from '../AlarmListener'

type MyLayoutProps = {
  children?: ReactNode
}
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
`

const Contents = styled.div`
  /* max-width: 800px; */
  /* margin: 0 auto; */
`

const HeaderWrapper = styled.div`
  z-index: 10;
  position: sticky;
  top: 0;
  width: 100%;
`
export default function BasePageLayout({ children }: MyLayoutProps) {
  return (
    <Layout>
      <AlarmListener />
      {/*헤더*/}

      <BaseHeaderVer2 />

      {/*사이드바*/}
      <Contents>
        {/* 라우터에서 사용도 가능하고 컴포넌트처럼도 사용 가능함 */}
        {/*
         * <Outlet />는 라우터에서 사용되는 컴포넌트로, 현재 경로에 해당하는 자식 컴포넌트를 렌더링
         * children은 prop로 선언되어 컴포넌트처럼 사용될 때 자식 요소를 받아 렌더링
         */}
        {children ? children : <Outlet />}
      </Contents>
      {/*푸터*/}
    </Layout>
  )
}
