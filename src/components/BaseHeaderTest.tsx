// BaseHeader.tsx
// -----------------------------------------------------------------------------
// Airbnb 헤더 레이아웃을 참고한 공통 헤더 컴포넌트
// React + styled-components + TypeScript 환경에서 사용한다.
// 모든 코드는 생략 없이 한글 주석과 함께 제공한다.
// -----------------------------------------------------------------------------

import { FC, useState } from 'react'
import styled, { css } from 'styled-components'
import { Menu, User, Globe, Search } from 'lucide-react'

// -----------------------------------------------------------------------------
// ── 타입 정의 ──
// -----------------------------------------------------------------------------
interface BaseHeaderProps {
  /** 로고 클릭 시 호출될 콜백(선택) */
  onLogoClick?: () => void
}

// -----------------------------------------------------------------------------
// ── 컴포넌트 구현 ──
// -----------------------------------------------------------------------------
const BaseHeader: FC<BaseHeaderProps> = ({ onLogoClick }) => {
  // 모바일 메뉴 토글 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <HeaderWrapper>
      {/* 좌측: 로고 */}
      <LogoButton onClick={onLogoClick} aria-label="홈으로 이동">
        <img src="/logo_full.webp" alt="서비스 로고" />
      </LogoButton>

      {/* 중앙: 검색바 */}
      <SearchBar role="search">
        <SearchSegment $first>여행지</SearchSegment>
        <Divider />
        <SearchSegment>언제?</SearchSegment>
        <Divider />
        <SearchSegment>게스트 추가</SearchSegment>
        <SearchButton aria-label="검색">
          <Search size={18} />
        </SearchButton>
      </SearchBar>

      {/* 우측: 유틸리티 영역 */}
      <RightSection>
        <HostButton>호스트가 되어보세요</HostButton>
        <IconButton aria-label="언어 설정">
          <Globe size={20} />
        </IconButton>
        <UserMenuButton aria-label="유저 메뉴" onClick={() => setIsMenuOpen(prev => !prev)}>
          <Menu size={20} />
          <User size={20} />
        </UserMenuButton>

        {/* 드롭다운 메뉴 예시(간단 표시) */}
        {isMenuOpen && (
          <Dropdown role="menu">
            <li>회원 가입</li>
            <li>로그인</li>
            <DividerLine />
            <li>숙소 호스트 되기</li>
            <li>도움말</li>
          </Dropdown>
        )}
      </RightSection>
    </HeaderWrapper>
  )
}

export default BaseHeader

// -----------------------------------------------------------------------------
// ── 스타일 정의 ──
// -----------------------------------------------------------------------------

/* 헤더 전체 래퍼 */
const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 80px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 24px;
  box-sizing: border-box;
`

/* 로고 버튼 */
const LogoButton = styled.button`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  img {
    height: 30px; /* 필요 시 조정 */
  }
`

/* 중앙 검색바 */
const SearchBar = styled.div`
  flex: 1 1 auto;
  max-width: 500px;
  height: 48px;

  display: flex;
  align-items: center;
  border: 1px solid #dddddd;
  border-radius: 9999px;
  padding: 0 8px;
  box-sizing: border-box;

  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }
`

/* 검색 세그먼트(여행지/날짜/게스트) */
const SearchSegment = styled.span<{ $first?: boolean }>`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  padding: 0 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${props =>
    props.$first &&
    css`
      color: #717171;
      font-weight: 500;
    `}
`

/* 세그먼트 구분선 */
const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #dddddd;
`

/* 돋보기 버튼 */
const SearchButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #ff385c; /* Airbnb 메인 컬러 */
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

/* 우측 영역 */
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative; /* 드롭다운 기준 */
`

/* 호스트 버튼 */
const HostButton = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  background: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 22px;
  cursor: pointer;

  &:hover {
    background-color: #f7f7f7;
  }
`

/* 일반 아이콘 버튼 */
const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #f7f7f7;
  }
`

/* 유저 메뉴 버튼(햄버거 + 아바타) */
const UserMenuButton = styled(IconButton)`
  display: flex;
  gap: 8px;
  padding: 0 6px;
  border: 1px solid #dddddd;
`

/* 드롭다운 메뉴 */
const Dropdown = styled.ul`
  position: absolute;
  top: 60px;
  right: 0;
  width: 200px;
  background: #ffffff;
  border: 1px solid #e7e7e7;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  list-style: none;
  padding: 8px 0;
  margin: 0;

  li {
    padding: 12px 20px;
    font-size: 14px;
    color: #333333;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }
  }
`

/* 드롭다운 내부 구분선 */
const DividerLine = styled.div`
  height: 1px;
  background: #dddddd;
  margin: 4px 0;
`
