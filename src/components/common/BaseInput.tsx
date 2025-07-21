import { forwardRef, HTMLAttributes, InputHTMLAttributes, useState } from 'react'

import styled, { css, keyframes } from 'styled-components'

type InputState = 'normal' | 'disable' | 'error' | 'success'
type InputSize = 'small' | 'medium' | 'large'

const colorTheme = {
  normal: {
    background: 'linear-gradient(180deg, #65360B 0%, #65360B 70%, #ff6b3d)',
    color: '#ffff',
    shadow: '0 4px 15px rgba(255, 107, 61, 0.3)',
    hoverShadow: '0 6px 20px rgba(255, 107, 61, 0.4)',
    focusShadow: '0 0 0 2px rgba(255, 107, 61, 0.3)',
    underline: '#ff6b3d',
  },
  disable: {
    background: 'linear-gradient(180deg, #3a3a3a 0%, #3a3a3a 70%, #5a5a5a)',
    color: '#9e9e9e',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    hoverShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    focusShadow: 'none',
    underline: '#5a5a5a',
  },
  error: {
    background: 'linear-gradient(180deg, #8D1F05 0%, #8D1F05 70%, #DA3001)',
    color: '#ffff',
    shadow: '0 4px 15px rgba(218, 48, 1, 0.3)',
    hoverShadow: '0 6px 20px rgba(218, 48, 1, 0.4)',
    focusShadow: '0 0 0 2px rgba(218, 48, 1, 0.3)',
    underline: '#DA3001',
  },
  success: {
    background: 'linear-gradient(180deg, #434F1C 0%, #434F1C 70%, #5E8F3C)',
    color: '#ffff',
    shadow: '0 4px 15px rgba(94, 143, 60, 0.3)',
    hoverShadow: '0 6px 20px rgba(94, 143, 60, 0.4)',
    focusShadow: '0 0 0 2px rgba(94, 143, 60, 0.3)',
    underline: '#5E8F3C',
  },
}

// 펄스 애니메이션
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(94, 143, 60, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 107, 61, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 61, 0);
  }
`

// 글로우 애니메이션
// const glow = keyframes`
//   0%, 100% {
//     filter: brightness(1);
//   }
//   50% {
//     filter: brightness(1.1);
//   }
// `

// 쉐이크 애니메이션 (에러 상태용)
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`

// 성공 체크 애니메이션
// const checkmark = keyframes`
//  0% {
//    transform: scale(0) rotate(45deg);
//    opacity: 0;
//  }
//  50% {
//    transform: scale(1.2) rotate(45deg);
//    opacity: 1;
//  }
//  100% {
//    transform: scale(1) rotate(45deg);
//    opacity: 1;
//  }
// `

// 크기 정의
const sizeStyles = {
  small: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '14px',
  },
  medium: {
    padding: '12px 20px',
    fontSize: '18px',
    borderRadius: '14px',
  },
  large: {
    padding: '16px 32px',
    fontSize: '24px',
    borderRadius: '14px',
  },
}

const Container = styled.div<{
  $state?: InputState
  $inputSize?: InputSize
  $fullWidth?: boolean
  $isFocused?: boolean
}>`
  display: inline-block;
  transition: all 0.2s ease-in-out;
  border-radius: 15px;
  ${({ $fullWidth = false }) => {
    return $fullWidth
      ? css`
          width: 100%;
        `
      : null
  }}

  // 상태와 포커스에 따른 색상 변화와 트랜지션, 애니메이션
  // { $state = 'normal' } : undefined일 경우 기본값 normal
  ${({ $state = 'normal', $isFocused = false }) => {
    if ($state === 'disable') {
      return css`
        background: #302f2e;
        cursor: not-allowed;
        box-shadow: ${colorTheme[$state].shadow};
      `
    }
    return css`
      background: ${colorTheme[$state].background};

      // input이 포커스 되었을 때
      box-shadow: ${$isFocused ? colorTheme[$state].focusShadow : colorTheme[$state].shadow};

      // 내부 input이 포커스 상태가 아닌 조건에서
      // 마우스만 hover되어 있을 때
      &:hover:not(:focus-within) {
        box-shadow: ${colorTheme[$state].hoverShadow};
        transform: translateY(-1px);
      }

      // error 상태일 때는 가볍게 흔듦
      ${$state === 'error' &&
      css`
        animation: ${shake} 0.5s ease-in-out;
      `}

      // success 상태일 때는 윙윙
      ${$state === 'success' &&
      css`
        animation: ${pulse} 2s infinite;
      `}
    `
  }}
  padding: 2px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 0;
    border-radius: inherit;
    /* 포커스 칼라 ver1 */
    /* background: linear-gradient(90deg, #ff6b3d, #ffaa3d); */
    opacity: 0;
    background: #ff6b3d;
    transition: opacity var(--transition-duration-normal) ease;
  }

  &:hover::before {
    opacity: 1;
  }
`

const BaseContainer = styled.div<{
  $state?: InputState
  $inputSize?: InputSize
  $iconGap?: string
  $isFocused?: boolean
}>`
  /* 기본 스타일 적용 */
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, #100900 0%, #100900 60%, #230d00);
  position: relative;
  overflow: hidden;

  /* 아이콘과 인풋사이의 거리 조절 */
  ${({ $iconGap }) => {
    return css`
      gap: ${$iconGap};
    `
  }};

  /* state에 따른 스타일 적용 */
  ${({ $state = 'normal' }) => {
    if ($state === 'disable') {
      return css`
        cursor: not-allowed;
        color: #9e9e9e;
        background: #191816;
      `
    }

    return css`
      color: ${colorTheme[$state].color};

      &::after {
        background: ${colorTheme[$state].underline};
      }
    `
  }}

  /* 사이즈에 따른 크기 변경 */
  ${({ $inputSize = 'medium' }) => css`
    padding: ${sizeStyles[$inputSize].padding};
    font-size: ${sizeStyles[$inputSize].fontSize};
    border-radius: ${sizeStyles[$inputSize].borderRadius};
  `}

  /* input이 focus 상태일 때 밑줄 긋기 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    transition: width 0.3s ease;
  }

  ${({ $isFocused }) =>
    $isFocused &&
    css`
      &::after {
        width: 100%;
      }
    `}
`

const Base = styled.input<{
  $state?: InputState
  $inputSize?: InputSize
}>`
  /* 기본 서식 지정 */

  /* 기본 input 스타일 제거 */
  all: unset;
  background: transparent;

  /* fullWidth를 위해 추가한 것 이상하면 수정하기 */
  width: 100%;
  transition: all 0.2s ease;

  /* number 타입 스핀 버튼 제거 */
  &[type='number'] {
    appearance: none;
    -moz-appearance: textfield;
  }
  &[type='number']::-webkit-outer-spin-button,
  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

type Divprops = HTMLAttributes<HTMLDivElement>
interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  state?: InputState
  inputSize?: InputSize
  disabled?: boolean
  icon?: React.ReactNode
  iconGap?: string
  fullWidth?: boolean

  baseContainerStyle?: Divprops
}

// 기획의도 : 고정된 스타일이 있으면서 기존 input과 똑같이
// input 요소는 focus에 대한 스타일 지정 같은 input 만의 특별한 요소들이 있기 때문에
// 기존의 BaseButton과는 구조를 다르게 짤 수 밖에 없었음
const BaseInput = forwardRef<Omit<HTMLInputElement, 'dangerouslySetInnerHTML'>, BaseInputProps>(
  (
    {
      state = 'normal',
      inputSize = 'medium',
      disabled = false,
      icon = null,
      iconGap = '10px',
      fullWidth = false,
      children, // 이거 설명은 추창우에게 질문
      onFocus, // 포커스 이벤트 핸들링을 위해서
      onBlur, // 포커스 풀리는 이벤트 핸들링을 위해서

      /* 최외각 컨테이너의 스타일을 넣기 위한 부분 */
      baseContainerStyle = {},

      /* 나머지 input 전용 스타일을 넘기는 부분 */
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    // disabled가 true일 때 자동으로 state를 'disable'로 전환
    const actualState: InputState = disabled ? 'disable' : state

    const isFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const isBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    // fullWidth
    const actualWidth = fullWidth ? true : false
    return (
      <Container
        $state={actualState}
        $inputSize={inputSize}
        $fullWidth={actualWidth}
        $isFocused={isFocused}
        {...baseContainerStyle}
      >
        <BaseContainer
          $state={actualState}
          $inputSize={inputSize}
          $iconGap={iconGap}
          $isFocused={isFocused}
        >
          {icon ? icon : <></>}
          {/* $state에 $를 붙이는 이유는 안붙이면 styled-components에서 DOM요소에 직접 지정을 시켜서 warning뜸 */}
          <Base
            ref={ref}
            $state={actualState}
            $inputSize={inputSize}
            disabled={actualState === 'disable'}
            onFocus={isFocus}
            onBlur={isBlur}
            {...rest}
          />
        </BaseContainer>
      </Container>
    )
  },
)

// 디버깅을 위한 이름을 지정 안하면 컴포넌트명이 안뜸
BaseInput.displayName = 'BaseInput'

export default BaseInput
