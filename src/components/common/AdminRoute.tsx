import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'white',
        }}
      >
        로딩 중...
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ROLE_ADMIN') {
    // 관리자가 아닌 경우 홈 또는 에러 페이지로 이동
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default AdminRoute
