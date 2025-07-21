import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { LayoutDashboard, Users, AlertTriangle } from 'lucide-react'

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const Sidebar = styled.aside`
  width: 180px;
  background: linear-gradient(135deg, #1e1e2f, #29293d);
  color: white;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
`

const LogoImage = styled.img`
  width: 100px;
  margin-bottom: 2.5rem;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
`

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => (props.$active ? '#ffcc00' : 'white')};
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: ${props => (props.$active ? 600 : 400)};
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffcc00;
  }
`

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
`

const Main = styled.main`
  flex: 1;
  overflow-y: auto;
`

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation()

  return (
    <LayoutWrapper>
      <Sidebar>
        <Link to="/">
          <LogoImage src="/logo_full.webp" alt="로고" />
        </Link>
        <Nav>
          <NavLink to="/admin/dashboard" $active={location.pathname.includes('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/user" $active={location.pathname.includes('user')}>
            <Users size={18} /> User
          </NavLink>
          <NavLink to="/admin/report" $active={location.pathname.includes('report')}>
            <AlertTriangle size={18} /> Report
          </NavLink>
        </Nav>
      </Sidebar>

      <ContentWrapper>
        <Main>{children}</Main>
      </ContentWrapper>
    </LayoutWrapper>
  )
}

export default AdminLayout
