// components/feature/debate/DebateCard.tsx
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import { MessageSquareText, ThumbsDown, ThumbsUp } from 'lucide-react'

const PLACEHOLDER = 'https://placehold.co/600x600'

const Wrapper = styled(BaseContainer)`
  width: 100%;
  max-width: 800px;
  min-height: 100px;
  margin: 5px auto;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`

const DebateTitle = styled.h3`
  color: #fe6a3c;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 15px 5px 15px;
  word-wrap: break-word;
  line-height: 1.4;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
`

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const UserAvatar = styled.div<{ $backgroundImage?: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage ? `url(${$backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const Username = styled.div`
  font-size: 12px;
  font-weight: 500;
`

const CreatedAt = styled.div`
  font-size: 8px;
  color: #aaa;
`

const BodyContents = styled.div<{ $blur?: boolean }>`
  padding: 15px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  position: relative;

  ${({ $blur }) =>
    $blur &&
    css`
      filter: blur(6px);
      pointer-events: none;
      user-select: none;
    `}
`

const SpoilerWarning = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  z-index: 2;
  font-size: 14px;
  text-align: center;
  backdrop-filter: blur(4px);
  border: 1px solid #fe6a3c;
`

const SpoilerButton = styled.button`
  background: none;
  border: none;
  color: #fe6a3c;
  cursor: pointer;
  margin-left: 8px;
  font-weight: 600;
  text-decoration: underline;

  &:hover {
    color: #ff8c42;
  }
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
`

const LikeHateCommentWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 12px;
  color: white;
`

const LikeHateNumbers = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`

const LikeNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ff6b9d;
  font-size: 14px;
  font-weight: 500;
`

const HateNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4ecdc4;
  font-size: 14px;
  font-weight: 500;
`

const CommentsWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 14px;
  color: white;
  font-weight: 500;
`

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: #fe6a3c;
  cursor: pointer;
  margin: 8px 0 0 0;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: #ff8c42;
  }
`

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px auto;
`

const ThumbnailsWrapper = styled.div`
  max-width: 600px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
`

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  object-fit: cover;
`

const MainImage = styled.img`
  max-width: 400px;
  max-height: 400px;
  border-radius: 8px;
  object-fit: cover;
`

const SpoilerBadge = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
  margin-left: auto;
`

interface DebateCardProps {
  debateId: number
  title: string
  content: string
  username: string
  createdAt: string
  likes: number
  hates: number
  comments: number
  isMyPost?: boolean
  isSpoiler?: boolean
  profileImage?: string | null
  images?: string[]
  onClick?: () => void
  maxLength?: number
  previewLength?: number
}

const DebateCard: React.FC<DebateCardProps> = ({
  debateId,
  title,
  content,
  username,
  createdAt,
  likes,
  hates,
  comments,
  isMyPost = false,
  isSpoiler = false,
  profileImage,
  images = [],
  onClick,
  maxLength = 300,
  previewLength = 150,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [spoilerRevealed, setSpoilerRevealed] = useState(false)

  // HTML 태그 제거
  const stripHtmlTags = (html: string): string => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // 텍스트 콘텐츠 처리
  const textContent = stripHtmlTags(content)
  const limitedContent = textContent.slice(0, maxLength)
  const isLong = limitedContent.length > previewLength
  const displayContent = expanded ? limitedContent : limitedContent.slice(0, previewLength)

  // 스포일러 처리
  const isBlur = isSpoiler && !spoilerRevealed

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼 클릭 시에는 카드 클릭 이벤트 방지
    if ((e.target as HTMLElement).tagName === 'BUTTON') {
      return
    }
    onClick?.()
  }

  const handleSpoilerReveal = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSpoilerRevealed(true)
  }

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <Wrapper onClick={handleCardClick}>
      <Header>
        <UserCard>
          <UserAvatar $backgroundImage={profileImage} />
          <UserInfo>
            <Username>{username}</Username>
            <CreatedAt>{createdAt}</CreatedAt>
          </UserInfo>
        </UserCard>
        {isSpoiler && <SpoilerBadge>스포일러</SpoilerBadge>}
      </Header>

      <DebateTitle>{title}</DebateTitle>

      {/* 이미지 렌더링 */}
      {images.length === 1 && (
        <ImageWrapper>
          <MainImage src={images[0] || PLACEHOLDER} alt="debate" />
        </ImageWrapper>
      )}
      {images.length > 1 && (
        <ImageWrapper>
          <MainImage src={images[0] || PLACEHOLDER} alt="debate" />
          <ThumbnailsWrapper>
            {images.slice(1, 5).map((img, idx) => (
              <Thumbnail key={idx} src={img || PLACEHOLDER} alt={`thumb${idx}`} />
            ))}
          </ThumbnailsWrapper>
        </ImageWrapper>
      )}

      {/* 본문 */}
      <BodyContents $blur={isBlur}>
        {displayContent}
        {isLong && !expanded && '...'}

        {isBlur && (
          <SpoilerWarning>
            ⚠️ 스포일러 주의!
            <SpoilerButton onClick={handleSpoilerReveal}>내용 보기</SpoilerButton>
          </SpoilerWarning>
        )}
      </BodyContents>

      {/* 더보기/접기 버튼 */}
      {isLong && !isBlur && (
        <ShowMoreButton onClick={handleToggleExpand}>
          {expanded ? '접기' : '...더보기'}
        </ShowMoreButton>
      )}

      <Footer>
        <LikeHateCommentWrapper>
          <LikeHateNumbers>
            <LikeNumber>
              <ThumbsUp size={16} />
              <span>{likes}</span>
            </LikeNumber>
            <HateNumber>
              <ThumbsDown size={16} />
              <span>{hates}</span>
            </HateNumber>
          </LikeHateNumbers>

          <CommentsWrapper>
            <MessageSquareText size={16} />
            <span>{comments}</span>
          </CommentsWrapper>
        </LikeHateCommentWrapper>
      </Footer>
    </Wrapper>
  )
}

export default DebateCard
