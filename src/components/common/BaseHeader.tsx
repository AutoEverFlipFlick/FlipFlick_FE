import styled, { css } from 'styled-components'
import { CircleUserRound, Search } from 'lucide-react'
import BaseInput from './BaseInput'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const FixedWrapper = styled.header`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
`

/* 래퍼: 헤더 전체 틀 */
const Wrapper = styled.div`
  max-width: 100%;
  height: 70px;
  /* background-color: ${({ theme }) => theme.colors.background}; */
  /* background-color: white; */
  display: flex;
  align-items: center;

  /* 헤더 내부요소 padding */
  padding: 0 var(--spacing-4);

  position: relative;
`

/* 로고 영역 */
const LogoWrapper = styled.div`
  padding-left: var(--spacing-8);

  &:hover {
    cursor: pointer;
  }

  z-index: 600;
`

const Logo = styled.div`
  width: 120px;
  height: 42px;
  background-image: var(--logo-full-image);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
`

/* 네비게이션 메뉴 */
// const Nav = styled.nav`
//   display: flex;
//   align-items: center;
//   gap: 24px;
//   font-size: var(--font-size-xl);
//   color: var(--text-color);
//   white-space: nowrap; /* 메뉴 줄바꿈 방지 */
// `

const CenterArea = styled.div`
  flex-grow: 1;
`

// SearchBar를 위한 absolute
const SearchArea = styled.div<{ $isFocused?: boolean }>`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;

  background: rgba(19, 8, 3, 0.8);
  backdrop-filter: blur(8px);

  display: flex;
  flex-direction: column;
  justify-content: center;

  ${({ $isFocused = false }) => {
    return css`
      ${$isFocused &&
      css`
        height: calc(100% + 50px);
      `}
    `
  }}

  transition: height var(--transition-duration-fast) var(--transition-easing);

  z-index: inherit;
`

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  /* 데스크탑 최대 크기 지정 */
  max-width: 540px;
`

/* 우측 액션 영역 */
const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  z-index: 600;

  cursor: pointer;
`

const ActionText = styled.div`
  display: inline-block;
  font-weight: 900;
`

/* 최종 헤더 컴포넌트 */
const BaseHeader = () => {
  const navigate = useNavigate()

  const [searchContext, setSearchContext] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const handleInputFocused = () => {
    console.log('Focused')
    // setIsFocused(true)
  }

  const handleInputBlured = () => {
    console.log('Blured')
    // setIsFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 검색 키워드로 이동
      navigate(`/totalsearch?query=${encodeURIComponent(searchContext)}&page=1`)
    }
  }

  return (
    <FixedWrapper>
      <Wrapper>
        {/* 로고 */}
        <LogoWrapper
          onClick={() => {
            navigate('/')
          }}
        >
          <Logo />
        </LogoWrapper>

        {/* 메뉴 */}
        {/* <Nav></Nav> */}
        <CenterArea />

        {/* 우측 아이콘 */}
        <ActionArea
          onClick={() => {
            navigate('/login')
          }}
        >
          <ActionText>로그인</ActionText>
          <CircleUserRound size={36} />
        </ActionArea>
      </Wrapper>

      {/* 중앙 서치바 */}
      <SearchArea $isFocused={isFocused}>
        <SearchInputWrapper>
          <BaseInput
            icon={<Search size={20} />}
            fullWidth
            inputSize={isFocused ? 'large' : 'small'}
            onFocus={handleInputFocused}
            onBlur={handleInputBlured}
            enterKeyHint="search"
            onChange={e => setSearchContext(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </SearchInputWrapper>
      </SearchArea>
    </FixedWrapper>
  )
}

export default BaseHeader
