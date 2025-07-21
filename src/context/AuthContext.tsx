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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin({ email, password })

      if (response.success) {
        const { accessToken, user: userData } = response.data
        localStorage.setItem('accessToken', accessToken)
        setUser(userData)
        return true
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

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
