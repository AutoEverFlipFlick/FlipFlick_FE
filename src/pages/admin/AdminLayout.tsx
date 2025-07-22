import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { LayoutDashboard, Users, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { logout } from '@/services/member'
import { useNavigate } from 'react-router-dom'

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
  flex: 1;
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

const ProfileContainer = styled.div`
  position: relative;
  cursor: pointer;
  margin-top: auto;
  padding-top: 1rem;
`

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`

const DropdownMenu = styled.ul`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 0.5rem 0;
  z-index: 999;
  color: black;
`

const DropdownItem = styled.li`
  list-style: none;
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f2f2f2;
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

const TextAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #666;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
`

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const { user, logout: authLogout } = useAuth() // AuthContext의 logout 함수 추가
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev)
  }

  // 로그아웃 함수 수정
  const handleLogout = async () => {
    try {
      console.log('🔧 관리자 페이지에서 로그아웃 시도')

      // 백엔드 로그아웃 API 호출
      await logout()

      // AuthContext의 logout 함수 호출 (localStorage 정리 + user 상태 초기화)
      authLogout()

      // 드롭다운 닫기
      setDropdownVisible(false)

      // 메인 페이지로 이동
      navigate('/')

      console.log('✅ 관리자 로그아웃 완료')
    } catch (err) {
      console.error('❌ 관리자 로그아웃 실패:', err)

      // 백엔드 로그아웃이 실패해도 프론트엔드 상태는 초기화
      authLogout()
      setDropdownVisible(false)
      navigate('/')
    }
  }

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

        <ProfileContainer ref={dropdownRef} onClick={toggleDropdown}>
          {user?.profileImage ? (
            <Avatar src={user.profileImage} alt="프로필 이미지" />
          ) : (
            <TextAvatar>{user?.nickname?.charAt(0) || '유'}</TextAvatar>
          )}

          {dropdownVisible && (
            <DropdownMenu>
              <DropdownItem onClick={() => navigate('/')}>홈으로 이동</DropdownItem>
              <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
            </DropdownMenu>
          )}
        </ProfileContainer>
      </Sidebar>

      <ContentWrapper>
        <Main>{children}</Main>
      </ContentWrapper>
    </LayoutWrapper>
  )
}

export default AdminLayout
