// components/common/ReviewDebateCard.tsx
import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import { MessageSquareText, ThumbsDown, ThumbsUp } from 'lucide-react'
import StarRating from '@/components/starRating/StarRating'
import BaseButton from '@/components/common/BaseButton'
import { useOnClickAuth } from '@/hooks/useOnClickAuth'
import Swal from 'sweetalert2'
import { likeDebate, likeReview } from '@/services/movieDetail'

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
  padding: 10px;
`

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  //margin: 0 5px;
`
const UserImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
`

// const DebateTitle = styled.div`
//     font-size: 14px;
//     font-weight: bold;
//     margin: 0 10px;
//     cursor: pointer;
//     text-align: end;
// `

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

const SpoilerOverlay = styled.button`
  position: absolute;
  top: 55px;
  left: 0;
  width: 100%;
  height: calc(90% - 80px);
  background: rgba(0, 0, 0, 0.6);
  color: var(--color-text);
  border: none;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  z-index: 10;

  &:focus {
    background: rgba(0, 0, 0, 0.3);
  }
`
// const SpoilerWarning = styled.div`
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     background: rgba(0, 0, 0, 0.7);
//     color: #fff;
//     padding: 8px 16px;
//     border-radius: 8px;
//     z-index: 2;
//     font-size: 14px;
//     text-align: center;
// `

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

const ReportDeleteButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: end;
`
// const ImageWrapper = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin: 10px auto;
// `

// const ThumbnailsWrapper = styled.div`
//     width: 600px;
//     display: flex;
//     flex-direction: row;
//     justify-content: start;
//     align-content: start;
//     gap: 10px;
//     margin: 10px 0;
// `

// const Thumbnail = styled.img`
//     width: 100px;
//     height: 100px;
//     border-radius: 4px;
//     object-fit: cover;
// `
// const MainImage = styled.img`
//     width: 400px;
//     height: 400px;
//     border-radius: 8px;
//     object-fit: cover;
// `

const LikeButton = styled(BaseButton)`
  max-height: 30px;
  width: 70px;
  display: flex;
  justify-content: space-between;
  padding: 12px;
  font-size: 14px;
`
const HateButton = styled(BaseButton)`
  max-height: 30px;
  width: 70px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 12px;
`

const HTMLContent = styled.div<{ $blur?: boolean }>`
  width: 90%;
  box-sizing: border-box;
  margin: 0 auto;

  ${({ $blur }) =>
    $blur &&
    css`
      filter: blur(2px);
      pointer-events: none;
    `}
  /* 이미지, 미디어 크기 제한 */
    & img,
    & video,
    & iframe {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 8px 0;
  }

  /* 긴 텍스트 줄바꿈 */

  & p {
    word-break: break-word;
    margin-bottom: 8px;
  }

  /* 테이블 스크롤 */

  & table {
    width: 100%;
    overflow-x: auto;
    display: block;
  }
`

// 콘텐츠 높이 제한용 래퍼
const ContentWrapper = styled.div<{ $expanded: boolean; $maxHeight: number }>`
  max-height: ${({ $expanded, $maxHeight }) => ($expanded ? 'none' : `${$maxHeight}px`)};
  overflow: hidden;
  position: relative;
`
// const LikeHate = styled.div`
//     height: 40px;
//     justify-content: start;
//     align-items: center;
//     display: flex;
//     gap: 10px;
// `

interface ReviewDebateCardProps {
  profileImage: string | null // 프로필 이미지 URL
  type: 'review' | 'debate'
  username: string
  createdAt: string
  content: string
  rating?: number
  likes: number
  hates: number
  title?: string
  comments?: number
  isMyPost: boolean
  images?: string[] // 이미지 url 배열
  isSpoiler?: boolean // 리뷰에서만 사용
  maxLength?: number // 기본값: 리뷰 500, 토론 5000
  previewLength?: number // 기본값: 200
  contentId: number // 리뷰 ID, 토론 ID
  memberId?: number // 리뷰 작성자 ID, 토론 작성자 ID
  onClick?: () => void // onClick prop 추가
  showLikeButtons?: boolean // 좋아요/싫어요 버튼 표시 여부
  showReportDelete?: boolean // 삭제/신고 버튼 표시 여부 추가
  isLiked?: boolean // 현재 사용자의 좋아요 상태
  isHated?: boolean // 현재 사용자의 싫어요 상태
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
  type,
  isSpoiler,
  maxLength = type === 'review' ? 500 : 5000,
  profileImage,
  contentId,
  memberId,
  isLiked: initialIsLiked = false,
  isHated: initialIsHated = false,
}) => {
  const onclickAuth = useOnClickAuth()

  const [expanded, setExpanded] = useState(false)
  const [spoilerRevealed, setSpoilerRevealed] = useState(false)

  // props에서 받은 초기값으로 state 설정
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isHated, setIsHated] = useState(initialIsHated)
  const [likeCnt, setLikeCnt] = useState(likes)
  const [hateCnt, setHateCnt] = useState(hates)

  const [hasOverflow, setHasOverflow] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleLike = onclickAuth(async () => {
    // 자기의 게시물에 좋아요를 누를 수 없도록 처리
    if (isMyPost) {
      await Swal.fire({
        icon: 'warning',
        title: '자신의 게시물에는 좋아요를 누를 수 없어요.',
        confirmButtonText: '확인',
      })
      return
    }

    try {
      console.log('👍 Like API 호출 시작:', { contentId, isLiked, isHated })

      // API 호출 (await 추가!)
      const response = type === 'review' ? await likeReview(contentId) : await likeDebate(contentId)

      console.log('👍 Like API 응답:', response)

      if (response.success) {
        // API 응답에서 실제 상태를 받아와서 설정
        if (response.data) {
          // 서버에서 현재 상태와 카운트를 받아온다고 가정
          setIsLiked(response.data.isLiked || !isLiked) // 토글
          setLikeCnt(response.data.likeCount || (isLiked ? likeCnt - 1 : likeCnt + 1))

          // 좋아요를 누르면 싫어요는 자동 해제
          if (!isLiked && isHated) {
            setIsHated(false)
            setHateCnt(prev => prev - 1)
          }
        } else {
          // 기존 로직 (API에서 상태를 안주는 경우)
          const newIsLiked = !isLiked
          setIsLiked(newIsLiked)
          setLikeCnt(prev => (newIsLiked ? prev + 1 : prev - 1))

          if (newIsLiked && isHated) {
            setIsHated(false)
            setHateCnt(prev => prev - 1)
          }
        }

        await Swal.fire({
          icon: 'success',
          title: !isLiked ? '좋아요 완료' : '좋아요 취소',
          confirmButtonText: '확인',
          timer: 1500,
          showConfirmButton: false, // 자동으로 닫히게
        })
      }
    } catch (error: any) {
      console.error('❌ Like API 호출 실패:', error)
      await Swal.fire({
        icon: 'error',
        title: '처리에 실패했어요.',
        text: error.response?.data?.message || '네트워크 오류가 발생했습니다.',
        confirmButtonText: '확인',
      })
    }
  })
  const handleHate = onclickAuth(async () => {
    // 자기의 게시물에 싫어요를 누를 수 없도록 처리
    if (isMyPost) {
      await Swal.fire({
        icon: 'warning',
        title: '자신의 게시물에는 싫어요를 누를 수 없어요.',
        confirmButtonText: '확인',
      })
      return
    }

    try {
      console.log('👎 Hate API 호출 시작:', { contentId, isLiked, isHated })

      const response = type === 'review' ? await hateReview(contentId) : await likeDebate(contentId) // 토론 싫어요 API 필요시 별도 함수

      console.log('👎 Hate API 응답:', response)

      if (response.success) {
        // API 응답에서 실제 상태를 받아와서 설정
        if (response.data) {
          setIsHated(response.data.isHated || !isHated) // 토글
          setHateCnt(response.data.hateCount || (isHated ? hateCnt - 1 : hateCnt + 1))

          // 싫어요를 누르면 좋아요는 자동 해제
          if (!isHated && isLiked) {
            setIsLiked(false)
            setLikeCnt(prev => prev - 1)
          }
        } else {
          // 기존 로직
          const newIsHated = !isHated
          setIsHated(newIsHated)
          setHateCnt(prev => (newIsHated ? prev + 1 : prev - 1))

          if (newIsHated && isLiked) {
            setIsLiked(false)
            setLikeCnt(prev => prev - 1)
          }
        }

        await Swal.fire({
          icon: 'success',
          title: !isHated ? '싫어요 완료' : '싫어요 취소',
          confirmButtonText: '확인',
          timer: 1500,
          showConfirmButton: false,
        })
      }
    } catch (error: any) {
      console.error('❌ Hate API 호출 실패:', error)
      await Swal.fire({
        icon: 'error',
        title: '처리에 실패했어요.',
        text: error.response?.data?.message || '네트워크 오류가 발생했습니다.',
        confirmButtonText: '확인',
      })
    }
  })

  // 콘텐츠 처리
  const previewHeight = 65

  useEffect(() => {
    const el = wrapperRef.current
    if (el) {
      setHasOverflow(el.scrollHeight > previewHeight)
    }
  }, [content, previewHeight])
  // const commentCount = comments?.length ?? 0
  // const imageList = props.images ?? []

  // 본문 길이 제한
  // const limitedContent = content.slice(0, maxLength)
  // const isLong = limitedContent.length > previewLength
  // const displayContent = expanded ? limitedContent : limitedContent.slice(0, previewLength)

  // 스포일러 처리
  const isBlur = isSpoiler && !spoilerRevealed

  return (
    <Wrapper>
      <Header>
        <UserCard>
          <UserImage
            style={{
              backgroundImage: `url(${profileImage})`,
            }}
          />
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
        {type === 'debate' && (
          <DebateTitle style={{ fontSize: 14, fontWeight: 'bold' }}>{title}</DebateTitle>
        )}
      </Header>
      <BodyContents
        onClick={() => {
          if (isBlur) {
            setSpoilerRevealed(true)
          } else if (type === 'debate') {
            // 토론 카드 클릭 시 토론 상세 페이지로 이동
            // 아니면 제목?
          }
        }}
      >
        {isBlur && (
          <SpoilerOverlay onClick={() => setSpoilerRevealed(true)}>
            스포일러 클릭 시 공개
          </SpoilerOverlay>
        )}

        <ContentWrapper $expanded={expanded} $maxHeight={previewHeight} ref={wrapperRef}>
          <HTMLContent $blur={isBlur} dangerouslySetInnerHTML={{ __html: content }} />
        </ContentWrapper>

        {hasOverflow && (
          <ShowMoreButton
            onClick={e => {
              e.stopPropagation()
              setExpanded(prev => !prev)
            }}
          >
            {expanded ? '접기' : '더 보기'}
          </ShowMoreButton>
        )}
      </BodyContents>

      <Footer>
        <LikeHateCommentWrapper>
          <LikeButton variant={isLiked ? 'pink' : 'dark'} onClick={handleLike}>
            <ThumbsUp size={16} />
            {likeCnt}
          </LikeButton>
          <HateButton variant={isHated ? 'blue' : 'dark'} onClick={handleHate}>
            <ThumbsDown size={16} />
            {hateCnt}
          </HateButton>
          {comments !== undefined && (
            <CommentsWrapper>
              <MessageSquareText size={16} />
              {comments}
            </CommentsWrapper>
          )}
        </LikeHateCommentWrapper>
        <ReportDeleteButtonWrapper>
          {isMyPost && type === 'debate' && (
            <ReportDeleteButton
              onClick={() => {
                // 토론 수정 API 호출 및 라우팅
                console.log('Edit Debate API')
              }}
            >
              수정
            </ReportDeleteButton>
          )}
          <ReportDeleteButton
            onClick={() => {
              console.log(isMyPost ? 'Delete API' : 'Report API')
              Swal.fire({
                icon: 'warning',
                title: isMyPost ? '정말 삭제하시겠습니까?' : '신고하시겠습니까?',
                text: isMyPost
                  ? '삭제된 데이터는 복구할 수 없습니다.'
                  : '신고는 관리자에게 전달됩니다.',
                showCancelButton: true,
                input: isMyPost ? undefined : 'text',
                confirmButtonText: isMyPost ? '삭제' : '신고',
                cancelButtonText: '취소',
              }).then(result => {
                if (result.isConfirmed) {
                  // API 호출 및 파라미터 전달
                  if (isMyPost) {
                    // 삭제 API 호출
                    console.log('Deleting post...')
                  } else {
                    // 신고 API 호출
                    console.log(
                      'Reporting post with reason:',
                      result.value,
                      contentId,
                      type,
                      memberId,
                    )
                  }
                }
              })
            }}
          >
            {isMyPost ? '삭제' : '신고'}
          </ReportDeleteButton>
        </ReportDeleteButtonWrapper>
      </Footer>
    </Wrapper>
  )
}

export default ReviewDebateCard
