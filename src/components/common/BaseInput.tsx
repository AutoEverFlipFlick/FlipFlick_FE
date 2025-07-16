import { forwardRef, InputHTMLAttributes } from 'react'

import styled, { css } from 'styled-components'

type InputState = 'normal' | 'disable' | 'error' | 'success'
type InputSize = 'small' | 'medium' | 'large'

const colorTheme = {
  normal: {
    background: 'linear-gradient(180deg, #65360B 0%, #65360B 70%, #ff6b3d)',
    color: '#ffff',
  },
  disable: {
    background: 'linear-gradient(180deg, #65360B 0%, #65360B 70%, #ff6b3d)',
    color: '#ffff',
  },
  error: {
    background: 'linear-gradient(180deg, #8D1F05 0%, #8D1F05 70%, #DA3001)',
    color: '#ffff',
  },
  success: {
    background: 'linear-gradient(180deg, #434F1C 0%, #434F1C 70%, #5E8F3C)',
    color: '#ffff',
  },
}

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

const Wrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Container = styled.div<{ $state?: InputState; $inputSize?: InputSize }>`
  display: inline-block;
  border-radius: 15px;
  ${({ $state = 'normal' }) => {
    if ($state === 'disable') {
      return css`
        background: #302f2e;
        cursor: not-allowed;
      `
    }
    return css`
      background: ${colorTheme[$state].background};
    `
  }}
  padding: 2px;
`

const BaseContainer = styled.div<{
  $state?: InputState
  $inputSize?: InputSize
  $iconGap?: string
}>`
  /* 기본 스타일 적용 */
  display: flex;
  align-items: center;

  background: linear-gradient(180deg, #100900 0%, #100900 60%, #230d00);

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
    `
  }}

  /* 사이즈에 따른 크기 변경 */
  ${({ $inputSize = 'medium' }) => css`
    padding: ${sizeStyles[$inputSize].padding};
    font-size: ${sizeStyles[$inputSize].fontSize};
    border-radius: ${sizeStyles[$inputSize].borderRadius};
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

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  state?: InputState
  inputSize?: InputSize
  disabled?: boolean
  icon?: React.ReactNode
  iconGap?: string
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
      ...rest
    },
    ref,
  ) => {
    // disabled가 true일 때 자동으로 state를 'disable'로 전환
    const actualState: InputState = disabled ? 'disable' : state
    return (
      <Wrapper>
        <Container $state={actualState} $inputSize={inputSize}>
          <BaseContainer $state={actualState} $inputSize={inputSize} $iconGap={iconGap}>
            {icon ? icon : <></>}
            {/* $state에 $를 붙이는 이유는 안붙이면 styled-components에서 DOM요소에 직접 지정을 시켜서 warning뜸 */}
            <Base
              ref={ref}
              $state={actualState}
              $inputSize={inputSize}
              disabled={actualState === 'disable'}
              {...rest}
            />
          </BaseContainer>
        </Container>
      </Wrapper>
    )
  },
)

// 디버깅을 위한 이름을 지정 안하면 컴포넌트명이 안뜸
BaseInput.displayName = 'BaseInput'

export default BaseInput
