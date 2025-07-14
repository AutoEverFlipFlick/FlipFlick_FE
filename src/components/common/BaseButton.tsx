import type React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Icon } from '@iconify/react'

// 애니메이션 정의
const bounce = keyframes`
    0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
    }
    40%, 43% {
        transform: translate3d(0, -30px, 0);
    }
    70% {
        transform: translate3d(0, -15px, 0);
    }
    90% {
        transform: translate3d(0, -4px, 0);
    }
`

// const spin = keyframes`
//     from {
//         transform: rotate(0deg);
//     }
//     to {
//         transform: rotate(360deg);
//     }
// `

const ping = keyframes`
    75%, 100% {
        transform: scale(2);
        opacity: 0;
    }
`

// 타입 정의
type ButtonVariant =
  | 'dark'
  | 'orange'
  | 'blue'
  | 'green'
  | 'purple'
  | 'pink'
  | 'cyan'
  | 'yellow'
  | 'red'
  | 'indigo'
type ButtonSize = 'small' | 'medium' | 'large'
type ButtonState = 'normal' | 'disabled' | 'loading' | 'success'
type HoverEffect = 'none' | 'glow' | 'bounce' | 'rotate'

interface StyledButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  state?: ButtonState
  hoverEffect?: HoverEffect
  withIcon?: boolean
  fullWidth?: boolean
}

// 색상 테마 정의
const colorThemes = {
  dark: {
    background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
    color: '#d4b896',
    border: '#404040',
    shadow: 'rgba(0, 0, 0, 0.4)',
    hoverShadow: 'rgba(0, 0, 0, 0.6)',
  },
  orange: {
    background: 'linear-gradient(135deg, #ff7849 0%, #ff6b3d 50%, #e55a2b 100%)',
    color: '#5d2f1a',
    border: '#e55a2b',
    shadow: 'rgba(255, 107, 61, 0.3)',
    hoverShadow: 'rgba(255, 107, 61, 0.5)',
  },
  blue: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
    color: '#ffffff',
    border: '#2563eb',
    shadow: 'rgba(59, 130, 246, 0.3)',
    hoverShadow: 'rgba(59, 130, 246, 0.5)',
  },
  green: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    color: '#ffffff',
    border: '#059669',
    shadow: 'rgba(16, 185, 129, 0.3)',
    hoverShadow: 'rgba(16, 185, 129, 0.5)',
  },
  purple: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
    color: '#ffffff',
    border: '#7c3aed',
    shadow: 'rgba(139, 92, 246, 0.3)',
    hoverShadow: 'rgba(139, 92, 246, 0.5)',
  },
  pink: {
    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
    color: '#ffffff',
    border: '#db2777',
    shadow: 'rgba(236, 72, 153, 0.3)',
    hoverShadow: 'rgba(236, 72, 153, 0.5)',
  },
  cyan: {
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#ffffff',
    border: '#0891b2',
    shadow: 'rgba(6, 182, 212, 0.3)',
    hoverShadow: 'rgba(6, 182, 212, 0.5)',
  },
  yellow: {
    background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    color: '#ffffff',
    border: '#ca8a04',
    shadow: 'rgba(234, 179, 8, 0.3)',
    hoverShadow: 'rgba(234, 179, 8, 0.5)',
  },
  red: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    border: '#dc2626',
    shadow: 'rgba(239, 68, 68, 0.3)',
    hoverShadow: 'rgba(239, 68, 68, 0.5)',
  },
  indigo: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#ffffff',
    border: '#4f46e5',
    shadow: 'rgba(99, 102, 241, 0.3)',
    hoverShadow: 'rgba(99, 102, 241, 0.5)',
  },
}

// 크기 정의
const sizeStyles = {
  small: {
    padding: '8px 24px',
    fontSize: '14px',
    borderRadius: '24px',
  },
  medium: {
    padding: '12px 40px',
    fontSize: '18px',
    borderRadius: '24px',
  },
  large: {
    padding: '16px 64px',
    fontSize: '24px',
    borderRadius: '24px',
  },
}

// 메인 버튼 컴포넌트
const StyledButton = styled.button<{
  $variant?: ButtonVariant
  $size?: ButtonSize
  $state?: ButtonState
  $hoverEffect?: HoverEffect
  $fullWidth?: boolean
}>`
  /* 기본 스타일 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: bold;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;

  /* 크기 적용 */
  ${({ $size = 'medium' }) => css`
    padding: ${sizeStyles[$size].padding};
    font-size: ${sizeStyles[$size].fontSize};
    border-radius: ${sizeStyles[$size].borderRadius};
  `} /* 색상 테마 적용 */ ${({ $variant = 'orange' }) => {
    const theme = colorThemes[$variant]
    return css`
      background: ${theme.background};
      color: ${theme.color};
      border-color: ${theme.border};
      /* 별로 안어울리는 것 같아서 뺌 */
      /* box-shadow: 0 4px 12px ${theme.shadow}; */
    `
  }} /* 전체 너비 */ ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `} /* 상태별 스타일 */ ${({ $state }) => {
    switch ($state) {
      case 'disabled':
        return css`
          background: #374151 !important;
          color: #9ca3af !important;
          border-color: #4b5563 !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
          cursor: not-allowed;
          opacity: 0.5;

          &:hover {
            transform: none !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
          }
        `
      case 'loading':
        return css`
          cursor: wait;
        `
      case 'success':
        return css`
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
          border-color: #16a34a !important;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3) !important;
        `
      default:
        return ''
    }
  }} /* 호버 효과 */ ${({ $hoverEffect = 'none', $variant = 'orange', $state }) => {
    if ($state === 'disabled') return ''

    const theme = colorThemes[$variant]
    const baseHover = css`
      &:hover {
        transform: scale(1.05);

        box-shadow:
          0 0 30px ${theme.hoverShadow},
          0 6px 20px ${theme.hoverShadow};
      }

      &:active {
        transform: scale(0.95);
      }
    `

    switch ($hoverEffect) {
      case 'glow':
        return css`
          ${baseHover}
          &:hover {
            transform: scale(1.05);
            box-shadow:
              0 0 30px ${theme.hoverShadow},
              0 6px 20px ${theme.hoverShadow};
          }
        `
      case 'bounce':
        return css`
          &:hover {
            animation: ${bounce} 1s;
            box-shadow:
              0 0 30px ${theme.hoverShadow},
              0 6px 20px ${theme.hoverShadow};
          }

          &:active {
            transform: scale(0.95);
          }
        `
      case 'rotate':
        return css`
          &:hover {
            transform: scale(1.05) rotate(3deg);
            box-shadow:
              0 0 30px ${theme.hoverShadow},
              0 6px 20px ${theme.hoverShadow};
          }

          &:active {
            transform: scale(0.95) rotate(1deg);
          }
        `
      default:
        return baseHover
    }
  }}
`

// // 로딩 스피너 컴포넌트
// const LoadingSpinner = styled(IconLucideLoader2)`
//     animation: ${spin} 1s linear infinite;
// `

// 파티클 효과를 위한 컴포넌트
const Particle = styled.div<{
  $delay: number
  $top: string
  $left: string
}>`
  position: absolute;
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.3;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  animation: ${ping} 2s infinite;
  animation-delay: ${({ $delay }) => $delay}ms;
`

// 버튼 컴포넌트 인터페이스
interface ButtonProps extends StyledButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  className?: string
}

// 메인 버튼 컴포넌트
const BaseButton: React.FC<ButtonProps> = ({
  children = '찜하기',
  onClick,
  disabled,
  loading,
  icon,
  variant = 'orange',
  size = 'medium',
  hoverEffect = 'none',
  fullWidth = false,
  className,
  ...props
}) => {
  const getState = (): ButtonState => {
    if (disabled) return 'disabled'
    if (loading) return 'loading'
    return 'normal'
  }

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $state={getState()}
      $hoverEffect={hoverEffect}
      $fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {/* 파티클 효과 (glow 효과일 때만) */}
      {hoverEffect === 'glow' && (
        <>
          <Particle $delay={0} $top="20%" $left="30%" />
          <Particle $delay={200} $top="60%" $left="70%" />
          <Particle $delay={400} $top="80%" $left="20%" />
        </>
      )}

      {loading ? (
        <>
          <Icon icon="line-md:loading-loop" width="16" height="16" />
          로딩중
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </StyledButton>
  )
}
export default BaseButton
