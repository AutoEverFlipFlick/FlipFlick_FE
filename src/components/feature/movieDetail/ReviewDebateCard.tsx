// components/common/ReviewDebateCard.tsx
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import { MessageSquareText, ThumbsDown, ThumbsUp } from 'lucide-react'
import StarRating from '@/components/starRating/StarRating'
import BaseButton from '@/components/common/BaseButton'

const PLACEHOLDER = 'https://placehold.co/600x600'

const Wrapper = styled(BaseContainer)<{ $type: 'review' | 'debate' }>`
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
  cursor: ${({ $type }) => ($type === 'debate' ? 'pointer' : 'default')};
`

// 토론 제목 스타일 추가
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

const BodyContents = styled.div<{ $blur?: boolean }>`
  padding: 15px;
  font-size: 12px;
  word-wrap: break-word;
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
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 2;
  font-size: 14px;
  text-align: center;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
`

const LikeHateCommentWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  color: white;
`

const CommentsWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 12px;
  color: white;
`

const ShowMoreButton = styled.div`
  display: inline-block;
  margin-left: 16px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`

const ReportDeleteButton = styled.div`
  font-size: 12px;
  color: white;
  cursor: pointer;
  transition: text-decoration 0.2s ease-in-out;

  &:hover {
    text-decoration: underline;
  }
`

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px auto;
`

const ThumbnailsWrapper = styled.div`
  width: 600px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-content: start;
  gap: 10px;
  margin: 10px 0;
`

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  object-fit: cover;
`
const MainImage = styled.img`
  width: 400px;
  height: 400px;
  border-radius: 8px;
  object-fit: cover;
`

const LikeButton = styled(BaseButton)`
  max-height: 30px;
  width: 90px;
  display: flex;
  justify-content: space-between;
  padding: 15px;
`
const HateButton = styled(BaseButton)`
  max-height: 30px;
  width: 90px;
  display: flex;
  justify-content: space-between;
  padding: 15px;
`
const LikeHate = styled.div`
  height: 40px;
  justify-content: start;
  align-items: center;
  display: flex;
  gap: 10px;
`

interface ReviewDebateCardProps {
  type: 'review' | 'debate'
  username: string
  createdAt: string
  content: string
  rating?: number
  likes: number
  hates: number
  comments?: number
  isMyPost?: boolean
  images?: string[]
  isSpoiler?: boolean
  onClick?: () => void // onClick prop 추가
  maxLength?: number
  previewLength?: number
  title?: string // 이미 있음
  showLikeButtons?: boolean // 좋아요/싫어요 버튼 표시 여부
  showReportDelete?: boolean // 삭제/신고 버튼 표시 여부 추가
}

const ReviewDebateCard: React.FC<ReviewDebateCardProps> = ({
  title,
  username,
  createdAt,
  content,
  rating,
  likes,
  hates,
  comments,
  isMyPost,
  images,
  type,
  isSpoiler,
  maxLength = type === 'review' ? 500 : 5000,
  previewLength = 200,
  onClick,
  showLikeButtons = true, // 기본값은 true
  showReportDelete = true, // 기본값은 true (리뷰에서는 표시)
}) => {
  const [expanded, setExpanded] = useState(false)
  const [spoilerRevealed, setSpoilerRevealed] = useState(false)

  const [isLiked, setIsLiked] = useState(false)
  const [isHated, setIsHated] = useState(false)
  const [likeCnt, setLikeCnt] = useState(likes)
  const [hateCnt, setHateCnt] = useState(hates)

  const handleLikeClick = () => {
    setIsLiked(!isLiked)
    setLikeCnt(prev => (!isLiked ? prev + 1 : prev - 1))
    if (isHated) {
      setIsHated(false)
      setHateCnt(prev => prev - 1)
    }
  }
  const handleHateClick = () => {
    setIsHated(!isHated)
    setHateCnt(prev => (!isHated ? prev + 1 : prev - 1))
    if (isLiked) {
      setIsLiked(false)
      setLikeCnt(prev => prev - 1)
    }
  }

  // 콘텐츠 처리
  const snippet = content.slice(0, maxLength)
  const isOverflow = snippet.length > previewLength
  const displayText = expanded ? snippet : snippet.slice(0, previewLength)
  const blur = type === 'review' && isSpoiler && !spoilerRevealed

  // const commentCount = comments?.length ?? 0
  // const imageList = props.images ?? []

  // 본문 길이 제한
  const limitedContent = content.slice(0, maxLength)
  const isLong = limitedContent.length > previewLength
  const displayContent = expanded ? limitedContent : limitedContent.slice(0, previewLength)

  // 스포일러 처리
  const isBlur = isSpoiler && !spoilerRevealed

  // TODO : 카드 클릭 핸들러 (토론장 이동)

  const imageList = images && images.length > 0 ? images : []

  return (
    <Wrapper
      $type={type}
      onClick={type === 'debate' ? onClick : undefined} // 토론일 때만 클릭 가능
      style={{
        cursor: type === 'debate' ? 'pointer' : 'default',
      }}
    >
      {/* 토론 제목 표시 (토론일 때만) */}

      <Header>
        <UserCard>
          <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#f0f0f0' }} />
          <div>
            <div style={{ fontSize: 12 }}>{username}</div>
            <div style={{ fontSize: 8 }}>{createdAt}</div>
          </div>
          {rating !== undefined && (
            <div style={{ marginLeft: 8 }}>
              <StarRating rating={rating} />
            </div>
          )}
        </UserCard>
      </Header>
      {type === 'debate' && title && <DebateTitle>{title}</DebateTitle>}

      {/* 이미지 렌더링 */}
      {imageList.length === 1 && (
        <ImageWrapper>
          <MainImage src={imageList[0] || PLACEHOLDER} alt="review" />
        </ImageWrapper>
      )}
      {imageList.length > 1 && (
        <ImageWrapper>
          <MainImage src={imageList[0] || PLACEHOLDER} alt="review" style={{ marginTop: 4 }} />
          <ThumbnailsWrapper>
            {imageList.slice(1, 5).map((img, idx) => (
              <Thumbnail key={idx} src={img || PLACEHOLDER} alt={`thumb${idx}`} />
            ))}
          </ThumbnailsWrapper>
        </ImageWrapper>
      )}

      {/* 본문 */}
      <BodyContents $blur={isBlur}>
        {displayContent}
        {isBlur && (
          <SpoilerWarning>
            스포일러 주의!{' '}
            <ShowMoreButton
              onClick={e => {
                e.stopPropagation()
                setSpoilerRevealed(true)
              }}
            >
              내용 보기
            </ShowMoreButton>
          </SpoilerWarning>
        )}
      </BodyContents>

      {/* 더보기/접기 버튼 */}
      {isLong && !expanded && !isBlur && (
        <ShowMoreButton
          style={{ marginLeft: 16, marginBottom: 8 }}
          onClick={e => {
            e.stopPropagation()
            setExpanded(true)
          }}
        >
          ...더보기
        </ShowMoreButton>
      )}
      {isLong && expanded && !isBlur && (
        <ShowMoreButton
          style={{ marginLeft: 16, marginBottom: 8 }}
          onClick={e => {
            e.stopPropagation()
            setExpanded(false)
          }}
        >
          접기
        </ShowMoreButton>
      )}

      <Footer>
        <LikeHateCommentWrapper>
          {showLikeButtons ? (
            // 기존 버튼 방식 (리뷰용)
            <LikeHate>
              <LikeButton
                icon={<ThumbsUp size={20} />}
                size="small"
                variant={isLiked ? 'pink' : 'dark'}
                onClick={handleLikeClick}
              >
                {likeCnt}
              </LikeButton>
              <HateButton
                icon={<ThumbsDown size={20} />}
                size="small"
                variant={isHated ? 'blue' : 'dark'}
                onClick={handleHateClick}
              >
                {hateCnt}
              </HateButton>
            </LikeHate>
          ) : (
            // 숫자만 표시 (토론용)
            <LikeHateNumbers>
              <LikeNumber>
                <ThumbsUp size={16} color="#ff6b9d" />
                <span>{likes}</span>
              </LikeNumber>
              <HateNumber>
                <ThumbsDown size={16} color="#4ecdc4" />
                <span>{hates}</span>
              </HateNumber>
            </LikeHateNumbers>
          )}

          {comments !== undefined && (
            <CommentsWrapper>
              <MessageSquareText size={15} color="white" />
              <span>{comments}</span>
            </CommentsWrapper>
          )}
        </LikeHateCommentWrapper>

        {/* 조건부로 삭제/신고 버튼 표시 */}
        {showReportDelete && <ReportDeleteButton>{isMyPost ? '삭제' : '신고'}</ReportDeleteButton>}
      </Footer>
    </Wrapper>
  )
}

// 새로운 스타일드 컴포넌트 추가
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

export default ReviewDebateCard
