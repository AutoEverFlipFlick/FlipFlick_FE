import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axiosInstance from '../services/axiosInstance'
import { login as apiLogin } from '../services/member'

interface User {
  id: number
  email: string
  nickname: string
  profileImageUrl?: string
  profileImage?: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  updateUser: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 페이지 로드 시 토큰 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          // 토큰 유효성 확인을 위한 API 호출
          const response = await axiosInstance.get('/api/v1/member/user-info')
          if (response.data.success) {
            setUser(response.data.data)
          }
        } catch (error) {
          console.error('Token validation failed:', error)
          localStorage.removeItem('accessToken')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const fetchUserInfo = async (): Promise<User | null> => {
    try {
      const response = await axiosInstance.get('/api/v1/member/user-info')
      if (response.data.success) {
        return response.data.data
      }
    } catch (error) {
      console.error('유저 정보 조회 실패:', error)
    }
    return null
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin({ email, password })

      if (response.success) {
        const { accessToken } = response.data
        localStorage.setItem('accessToken', accessToken)
        console.log('👤 AuthContext: 유저 정보 조회 중...')
        const userInfo = await fetchUserInfo()

        if (userInfo) {
          console.log('✅ AuthContext: 로그인 성공:', userInfo)
          setUser(userInfo)
          return true
        } else {
          console.log('❌ AuthContext: 유저 정보 조회 실패')
          localStorage.removeItem('accessToken')
          return false
        }
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  // updateUser 함수 추가
  const updateUser = (userData: User) => {
    console.log('👤 유저 정보 업데이트:', userData)
    setUser(userData)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
