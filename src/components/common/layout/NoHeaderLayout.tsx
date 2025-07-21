import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { ReactNode } from 'react'

type NoHeaderLayoutProps = {
  children?: ReactNode
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
`

const Contents = styled.div``

export default function NoHeaderLayout({ children }: NoHeaderLayoutProps) {
  return (
    <Layout>
      <Contents>{children ? children : <Outlet />}</Contents>
    </Layout>
  )
}
