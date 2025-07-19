import styled, { css } from 'styled-components'
import BaseInput from './common/BaseInput'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Wrapper = styled.header`
  /* 1) 래퍼 자체를 border-box로 지정 */
  box-sizing: border-box;

  /* 2) 자손 · 의사요소까지 상속(inherit)하도록 강제 */
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  display: flex;
  position: relative;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;

  padding: 0 var(--search-padding-inline);

  /* 전제 height 여기서 조정 */
  height: 80px;
  max-width: 1920px;
`

const LogoContainer = styled.a`
  align-items: center;
  vertical-align: middle;
  display: inline-flex;
  z-index: 1;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    box-sizing: border-box;

    right: -12px;
    left: -12px;
    top: 12px;
    bottom: 12px;
  }
`
const Logo = styled.div`
  width: 120px;
  height: 42px;
  background-image: var(--logo-full-image);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
`

const LogoSmall = styled.div`
  background-image: var(--logo-text);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;

  /* later : 모바일 화면일 때 block을 해줘야 한다 */
  display: none;
  cursor: pointer;
`

const AbsoluteContainer = styled.form`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;

  box-sizing: border-box;
  padding-inline: var(--search-padding-inline);
`

const TopSection = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  z-index: 1;
  flex-direction: column;
  align-items: center;

  height: 42px;
  background-color: rgb(255, 255, 255);
`

const BackgroundSection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;

  transform: scaleY(2.5);
  transition: transform var(--search-transition-duration-fast) var(--search-trasitioin-easing-fast);
  transform-origin: top;
`

const CateSection = styled.div`
  width: 500px;
  /* later : 이 값을 수정해야 할지도 */
  margin: 22px auto 24px;
  opacity: 1;

  transition: opacity 0.175s var(--search-trasition-curve);
  will-change: opacity;
`

// 서치바가 커질 때의 크기를 정의하고 있음
const SearchbarSection = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  /* 여기가 크기 지정 */
  max-width: 850px;
  height: 66px;
  align-items: center;
  justify-content: space-between;
  /* 중앙에 배치 */
  left: 50%;

  transform: translateX(-50%);

  /* pointer-events: none; */
`

const ActualSearchbar = styled(BaseInput)``

const MiniSearchbarSection = styled.div<{ $isFocused?: boolean }>`
  position: absolute;
  display: flex;
  max-width: 100%;
  justify-content: center;
  align-items: center;
  left: 50%;
  transform: translateX(-50%);

  ${({ $isFocused = false }) => {
    return css`
      ${$isFocused &&
      css`
        max-width: 850px;
        width: 100%;
      `}
    `
  }}
`

const ActualMiniSearchbar = styled(BaseInput)``

const AnanymouseWrapper = styled.div`
  position: fixed;
  opacity: 0;
  pointer-events: none;

  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
`

const TestBox = styled.nav`
  position: relative;
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: flex-end;
  color: whites;
`
const TestInnerBox = styled.div`
  display: flex;
  flex: auto;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
  margin-right: 12px;
`

const Base = () => {
  const navigate = useNavigate()

  const [searchContext, setSearchContext] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const handleInputFocused = () => {
    console.log('Focused')
    setIsFocused(true)
  }

  const handleInputBlured = () => {
    console.log('Blured')
    setIsFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 검색 키워드로 이동
      navigate(`/totalsearch?query=${encodeURIComponent(searchContext)}&page=1`)
    }
  }

  return (
    <Wrapper>
      {/* a 태그 */}
      <LogoContainer>
        <Logo />
        <LogoSmall />
      </LogoContainer>

      {/* form 태그 */}
      <AbsoluteContainer>
        <TopSection>
          <div>
            {/* 4번 항목 */}
            <CateSection>ㄴㅇㄹㄴㅇㄹ</CateSection>
            {/* 5번 항목 */}
            <SearchbarSection>
              <ActualSearchbar fullWidth />
            </SearchbarSection>
            <MiniSearchbarSection $isFocused={isFocused}>
              <ActualMiniSearchbar
                fullWidth
                onFocus={handleInputFocused}
                onBlur={handleInputBlured}
              />
            </MiniSearchbarSection>
          </div>
        </TopSection>
        <BackgroundSection />
      </AbsoluteContainer>

      <AnanymouseWrapper />

      <TestBox>
        <TestInnerBox>sdfsdf</TestInnerBox>
      </TestBox>
    </Wrapper>
  )
}
export default Base
