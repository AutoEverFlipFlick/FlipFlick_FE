import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  Heart,
  ThumbsDown,
  MessageCircle,
  Clock,
  User,
  Flag,
  Edit,
  Trash2,
  Film,
  Calendar,
  Star,
  Link2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import BaseButton from '@/components/common/BaseButton'
import PopcornIcon from './PopcornIcon'
import Swal from 'sweetalert2'
import {
  getDebateDetail,
  likeHateDebate,
  deleteDebate,
  reportContent,
  createComment,
  getComments,
  deleteComment,
} from '@/services/debate'
import { useAuth } from '@/context/AuthContext'

const PageWrap = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 16px 40px;
`

const DebateHeader = styled.div`
  background: rgba(28, 28, 43, 0.8);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #444;
`

const DebateTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 1rem;
  line-height: 1.3;
`

const DebateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  color: #aaa;
  font-size: 0.9rem;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const SpoilerBadge = styled.span`
  background: #ff4757;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`

const DebateContent = styled.div`
  background: rgba(28, 28, 43, 0.6);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: #fff;
  line-height: 1.7;

  h1,
  h2,
  h3 {
    color: #fff;
    margin: 1.5rem 0 1rem;
  }
  p {
    margin-bottom: 1rem;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
`

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(28, 28, 43, 0.4);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
`

const LeftActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const RightActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const LikeSection = styled.div`
  display: flex;
  gap: 1rem;
`

const LikeButton = styled.button<{ $active?: boolean; $type: 'like' | 'dislike' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props =>
    props.$active ? (props.$type === 'like' ? '#ff6b6b' : '#4834d4') : 'transparent'};
  color: ${props => (props.$active ? '#fff' : '#aaa')};
  border: 1px solid
    ${props => (props.$active ? (props.$type === 'like' ? '#ff6b6b' : '#4834d4') : '#666')};
  border-radius: 6px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;

  &:hover {
    background: ${props =>
      props.$type === 'like' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(72, 52, 212, 0.1)'};
    color: ${props => (props.$type === 'like' ? '#ff6b6b' : '#4834d4')};
  }
`

const ReportButton = styled.button`
  background: transparent;
  color: #aaa;
  border: 1px solid #666;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #ff4757;
    border-color: #ff4757;
  }
`

const CommentSection = styled.div`
  background: rgba(28, 28, 43, 0.4);
  border-radius: 12px;
  padding: 2rem;
`

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
`

const CommentForm = styled.div`
  margin-bottom: 2rem;
`

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  background: rgba(28, 28, 43, 0.6);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box; /* 추가: padding과 border를 width에 포함 */

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: #5025d1;
  }
`

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const CommentItem = styled.div`
  background: rgba(28, 28, 43, 0.6);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #444;
`

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #fff;
  font-weight: 600;
`

const CommentAuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-weight: 600;
`

const CommentTime = styled.span`
  color: #aaa;
  font-size: 0.85rem;
`

const CommentContent = styled.div`
  color: #eee;
  line-height: 1.6;
  margin-bottom: 1rem;
`

const CommentLikes = styled.div`
  display: flex;
  gap: 0.8rem;
`

const SmallLikeButton = styled.button<{ $active?: boolean }>`
  background: transparent;
  color: ${props => (props.$active ? '#ff6b6b' : '#aaa')};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;

  &:hover {
    color: #ff6b6b;
  }
`

// 누락된 styled-components 추가
const AuthorActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`

const EditButton = styled.button`
  background: transparent;
  color: #4ecdc4;
  border: 1px solid #4ecdc4;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    background: rgba(78, 205, 196, 0.1);
  }
`

const DeleteButton = styled.button`
  background: transparent;
  color: #ff4757;
  border: 1px solid #ff4757;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 71, 87, 0.1);
  }
`
interface Comment {
  id: number
  content: string
  memberNickname: string
  createdAt: string
}

interface DebateData {
  debateId: number
  memberId: number
  tmdbId: number
  movie: {
    tmdbId: number
    title: string
    posterImg: string
    releaseDate: string
    rating: number
  }
  movieTitle: string
  debateTitle: string
  content: string
  spoiler: boolean
  likeCnt: number
  hateCnt: number
  createdAt: string
  updatedAt: string
  nickname: string
  profileImage: string | null
  popcorn: number
}

interface DebateDetailPageProps {}

const DebateDetailPage: React.FC<DebateDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth() // AuthContext에서 사용자 정보 가져오기

  const [debate, setDebate] = useState<DebateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  // 댓글 페이지네이션 관련 state
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  // 페이지네이션 state
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [isLastPage, setIsLastPage] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // 모바일 무한스크롤용
  const [isMobile, setIsMobile] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 토론 상세 데이터 가져오기 (기존 코드 유지)
  useEffect(() => {
    const fetchDebateDetail = async () => {
      try {
        if (!id) return

        setLoading(true)
        const response = await getDebateDetail(parseInt(id))

        if (response.success) {
          setDebate(response.data)
        }
      } catch (error) {
        console.error('토론 상세 조회 실패:', error)
        Swal.fire({
          title: '오류',
          text: '토론을 불러오는데 실패했습니다.',
          icon: 'error',
          background: '#1e1e2f',
          color: '#fff',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDebateDetail()
  }, [id])

  // 댓글 목록 가져오기 (페이지네이션)
  const fetchComments = useCallback(
    async (page = 0, append = false) => {
      try {
        if (!id) return

        if (!append) {
          setCommentsLoading(true)
        } else {
          setLoadingMore(true)
        }

        const response = await getComments(parseInt(id), page, 10)

        if (response.success) {
          const data: CommentPageResponse = response.data

          if (append) {
            setComments(prev => [...prev, ...data.content])
          } else {
            setComments(data.content)
          }

          setTotalPages(data.totalPages)
          setTotalComments(data.totalElements)
          setIsLastPage(data.last)
          setCurrentPage(data.number)
        }
      } catch (error) {
        console.error('댓글 조회 실패:', error)
      } finally {
        setCommentsLoading(false)
        setLoadingMore(false)
      }
    },
    [id],
  )

  // 초기 댓글 로드
  useEffect(() => {
    fetchComments(0, false)
  }, [fetchComments])

  // 무한스크롤 설정 (모바일)
  useEffect(() => {
    if (!isMobile || isLastPage) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore && !isLastPage) {
          fetchComments(currentPage + 1, true)
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (triggerRef.current) {
      observerRef.current.observe(triggerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isMobile, currentPage, loadingMore, isLastPage, fetchComments])

  // 페이지 변경 (데스크톱)
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      fetchComments(page, false)
    }
  }

  // 더보기 버튼 클릭 (모바일 대체)
  const handleLoadMore = () => {
    if (!isLastPage && !loadingMore) {
      fetchComments(currentPage + 1, true)
    }
  }

  // 자신의 글인지 확인하는 함수 (AuthContext 사용)
  const isMyDebate = debate && user && debate.memberId === user.id

  const handleEdit = () => {
    navigate(`/debate/${debate?.debateId}/edit`)
  }

  const handleDelete = () => {
    if (!debate) return

    Swal.fire({
      title: '토론 삭제',
      text: '정말로 이 토론을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: '#ff4757',
      background: '#1e1e2f',
      color: '#fff',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const response = await deleteDebate(debate.debateId)

          if (response.success) {
            Swal.fire({
              title: '삭제 완료',
              text: '토론이 삭제되었습니다.',
              icon: 'success',
              background: '#1e1e2f',
              color: '#fff',
            }).then(() => {
              navigate('/') // 메인 페이지로 이동
            })
          }
        } catch (error) {
          console.error('삭제 실패:', error)
          Swal.fire({
            title: '오류',
            text: '토론 삭제에 실패했습니다.',
            icon: 'error',
            background: '#1e1e2f',
            color: '#fff',
          })
        }
      }
    })
  }

  const handleLike = async () => {
    // 로그인 확인
    if (!isAuthenticated) {
      Swal.fire({
        title: '로그인 필요',
        text: '좋아요를 누르려면 로그인이 필요합니다.',
        icon: 'warning',
        background: '#1e1e2f',
        color: '#fff',
      })
      return
    }

    if (!debate || isMyDebate) return // 자신의 글이면 차단

    try {
      const response = await likeHateDebate({
        debateId: debate.debateId,
        type: 'LIKE',
      })

      if (response.success) {
        setDebate(prev =>
          prev
            ? {
                ...prev,
                likeCnt: isLiked ? prev.likeCnt - 1 : prev.likeCnt + 1,
                hateCnt: isDisliked ? prev.hateCnt - 1 : prev.hateCnt,
              }
            : null,
        )

        setIsLiked(!isLiked)
        setIsDisliked(false)
      }
    } catch (error) {
      console.error('좋아요 실패:', error)
      Swal.fire({
        title: '오류',
        text: '좋아요 처리에 실패했습니다.',
        icon: 'error',
        background: '#1e1e2f',
        color: '#fff',
      })
    }
  }

  const handleDislike = async () => {
    // 로그인 확인
    if (!isAuthenticated) {
      Swal.fire({
        title: '로그인 필요',
        text: '싫어요를 누르려면 로그인이 필요합니다.',
        icon: 'warning',
        background: '#1e1e2f',
        color: '#fff',
      })
      return
    }

    if (!debate || isMyDebate) return // 자신의 글이면 차단

    try {
      const response = await likeHateDebate({
        debateId: debate.debateId,
        type: 'HATE',
      })

      if (response.success) {
        setDebate(prev =>
          prev
            ? {
                ...prev,
                hateCnt: isDisliked ? prev.hateCnt - 1 : prev.hateCnt + 1,
                likeCnt: isLiked ? prev.likeCnt - 1 : prev.likeCnt,
              }
            : null,
        )

        setIsDisliked(!isDisliked)
        setIsLiked(false)
      }
    } catch (error) {
      console.error('싫어요 실패:', error)
      Swal.fire({
        title: '오류',
        text: '싫어요 처리에 실패했습니다.',
        icon: 'error',
        background: '#1e1e2f',
        color: '#fff',
      })
    }
  }

  const handleReport = () => {
    // 로그인 확인
    if (!isAuthenticated) {
      Swal.fire({
        title: '로그인 필요',
        text: '신고하려면 로그인이 필요합니다.',
        icon: 'warning',
        background: '#1e1e2f',
        color: '#fff',
      })
      return
    }

    if (!debate || isMyDebate) return // 자신의 글이면 차단

    Swal.fire({
      title: '신고하기',
      html: `
      <div style="text-align: left; margin: 20px 0;">
        <p style="margin-bottom: 15px; color: #aaa;">신고 사유를 입력해주세요:</p>
        <textarea 
          id="reportDetail" 
          placeholder="신고 사유를 상세히 입력해주세요" 
          style="
            width: calc(100% - 4px); 
            height: 120px; 
            margin-top: 10px; 
            padding: 15px; 
            border: 1px solid #555; 
            border-radius: 8px; 
            resize: vertical;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            box-sizing: border-box;
            background: #2a2a3a;
            color: #fff;
          "
        ></textarea>
      </div>
    `,
      background: '#1e1e2f',
      color: '#fff',
      showCancelButton: true,
      confirmButtonText: '신고하기',
      cancelButtonText: '취소',
      confirmButtonColor: '#ff4757',
      cancelButtonColor: '#666',
      preConfirm: () => {
        const detail = (document.getElementById('reportDetail') as HTMLTextAreaElement).value

        if (!detail.trim()) {
          Swal.showValidationMessage('신고 사유를 입력해주세요.')
          return false
        }

        return {
          detail: detail.trim(),
        }
      },
    }).then(async result => {
      if (result.isConfirmed && result.value && user) {
        const { detail } = result.value

        try {
          const reportData = {
            reporterId: user.id,
            targetId: debate.memberId,
            type: '토론', // 토론 신고
            content: detail,
            targetTitle: debate.debateTitle,
            targetContent: debate.content,
            targetEntityId: debate.debateId,
          }

          const response = await reportContent(reportData)

          if (response.success) {
            Swal.fire({
              title: '신고 완료',
              text: '신고가 접수되었습니다.',
              icon: 'success',
              background: '#1e1e2f',
              color: '#fff',
              confirmButtonColor: '#5025d1',
            })
          }
        } catch (error) {
          console.error('신고 실패:', error)
          Swal.fire({
            title: '오류',
            text: '신고 처리에 실패했습니다.',
            icon: 'error',
            background: '#1e1e2f',
            color: '#fff',
          })
        }
      }
    })
  }

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: '로그인 필요',
        text: '댓글을 작성하려면 로그인이 필요합니다.',
        icon: 'warning',
        background: '#1e1e2f',
        color: '#fff',
      })
      return
    }

    if (!newComment.trim()) {
      Swal.fire({
        title: '알림',
        text: '댓글을 입력해주세요.',
        icon: 'warning',
        background: '#1e1e2f',
        color: '#fff',
      })
      return
    }

    if (!debate) return

    try {
      setSubmittingComment(true)

      const response = await createComment({
        debateId: debate.debateId,
        content: newComment.trim(),
      })

      if (response.success) {
        // 댓글 작성 후 첫 페이지로 새로고침
        await fetchComments(0, false)
        setNewComment('')

        Swal.fire({
          title: '댓글 작성 완료',
          text: '댓글이 성공적으로 작성되었습니다.',
          icon: 'success',
          background: '#1e1e2f',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false,
        })
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      Swal.fire({
        title: '오류',
        text: '댓글 작성에 실패했습니다.',
        icon: 'error',
        background: '#1e1e2f',
        color: '#fff',
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  // 댓글 삭제
  const handleCommentDelete = async (commentId: number, commentAuthor: string) => {
    // 자신의 댓글인지 확인
    if (!user || commentAuthor !== user.nickname) {
      Swal.fire({
        title: '권한 없음',
        text: '본인의 댓글만 삭제할 수 있습니다.',
        icon: 'warning',
        background: '#1e1e2f',
        color: '#fff',
      })
      return
    }

    Swal.fire({
      title: '댓글 삭제',
      text: '정말로 이 댓글을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: '#ff4757',
      background: '#1e1e2f',
      color: '#fff',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const response = await deleteComment(commentId)

          if (response.success) {
            // 현재 페이지 새로고침
            await fetchComments(currentPage, false)

            Swal.fire({
              title: '삭제 완료',
              text: '댓글이 삭제되었습니다.',
              icon: 'success',
              background: '#1e1e2f',
              color: '#fff',
              timer: 1500,
              showConfirmButton: false,
            })
          }
        } catch (error) {
          console.error('댓글 삭제 실패:', error)
          Swal.fire({
            title: '오류',
            text: '댓글 삭제에 실패했습니다.',
            icon: 'error',
            background: '#1e1e2f',
            color: '#fff',
          })
        }
      }
    })
  }

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <PageWrap>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#fff' }}>로딩 중...</div>
      </PageWrap>
    )
  }

  if (!debate) {
    return (
      <PageWrap>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#fff' }}>
          토론을 찾을 수 없습니다.
        </div>
      </PageWrap>
    )
  }

  return (
    <PageWrap>
      <DebateHeader>
        <DebateTitle>{debate.debateTitle}</DebateTitle>
        <DebateInfo>
          <InfoItem>
            {/* 프로필 이미지 또는 텍스트 아바타 표시 */}
            {debate.profileImage ? (
              <ProfileAvatar src={debate.profileImage} alt="프로필 이미지" />
            ) : (
              <TextAvatar>{debate.nickname?.charAt(0) || '익'}</TextAvatar>
            )}
            {debate.nickname}
          </InfoItem>
          <InfoItem>
            <Clock size={16} />
            {formatDate(debate.createdAt)}
          </InfoItem>
          <InfoItem>
            {/* 팝콘 이모지를 PopcornIcon 컴포넌트로 교체 */}
            <PopcornIcon score={debate.popcorn} size={20} />
            {debate.popcorn}
          </InfoItem>
          {debate.spoiler && <SpoilerBadge>스포일러 포함</SpoilerBadge>}

          {/* 자신의 글인 경우 수정/삭제 버튼 표시 */}
          {isMyDebate && (
            <AuthorActions>
              <EditButton onClick={handleEdit}>
                <Edit size={16} />
                수정
              </EditButton>
              <DeleteButton onClick={handleDelete}>
                <Trash2 size={16} />
                삭제
              </DeleteButton>
            </AuthorActions>
          )}
        </DebateInfo>
      </DebateHeader>

      <DebateContent dangerouslySetInnerHTML={{ __html: debate.content }} />

      <ActionBar>
        <LeftActions>
          {/* 자신의 글이 아닌 경우에만 좋아요/싫어요 버튼 표시 */}
          {!isMyDebate && (
            <>
              <LikeButton $active={isLiked} $type="like" onClick={handleLike}>
                <Heart size={18} />
                좋아요 {debate.likeCnt}
              </LikeButton>
              <LikeButton $active={isDisliked} $type="dislike" onClick={handleDislike}>
                <ThumbsDown size={18} />
                싫어요 {debate.hateCnt}
              </LikeButton>
            </>
          )}

          {/* 자신의 글인 경우 비활성화된 버튼 표시 */}
          {isMyDebate && (
            <>
              <LikeButton
                $active={false}
                $type="like"
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <Heart size={18} />
                좋아요 {debate.likeCnt}
              </LikeButton>
              <LikeButton
                $active={false}
                $type="dislike"
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <ThumbsDown size={18} />
                싫어요 {debate.hateCnt}
              </LikeButton>
            </>
          )}
        </LeftActions>

        <RightActions>
          {/* 자신의 글이 아닌 경우에만 신고 버튼 표시 */}
          {!isMyDebate && (
            <ReportButton onClick={handleReport}>
              <Flag size={16} />
              신고
            </ReportButton>
          )}
        </RightActions>
      </ActionBar>

      {/* 영화 정보 섹션 */}
      <MovieInfoSection>
        <MovieInfoHeader>
          <Film size={20} />
          토론 영화 정보
        </MovieInfoHeader>
        <MovieContent>
          <MoviePoster>
            <img
              src={debate.movie.posterImg}
              alt={debate.movie.title}
              onError={e => {
                e.currentTarget.src = '/placeholder-movie.jpg'
              }}
            />
          </MoviePoster>
          <MovieDetails>
            <MovieTitle>{debate.movie.title}</MovieTitle>
            <MovieMeta>
              <MetaItem>
                <Calendar size={16} />
                {formatReleaseDate(debate.movie.releaseDate)}
              </MetaItem>
              {debate.movie.rating > 0 && (
                <MetaItem>
                  <RatingBadge>
                    <Star size={14} />
                    {debate.movie.rating.toFixed(1)}
                  </RatingBadge>
                </MetaItem>
              )}
              <MetaItem>
                <Link2 size={16} />
                TMDB ID: {debate.movie.tmdbId}
              </MetaItem>
            </MovieMeta>
            <MovieDescription>
              이 영화에 대한 다양한 의견을 나누어보세요. 스포일러가 포함된 토론이니 아직 영화를 보지
              않으셨다면 주의해주세요!
              {/* 여기도 팝콘 아이콘으로 변경할 수 있습니다 */}
              <PopcornIcon score={75} size={16} />
            </MovieDescription>
          </MovieDetails>
        </MovieContent>
      </MovieInfoSection>

      <CommentSection>
        <CommentHeader>
          <MessageCircle size={20} />
          댓글 {totalComments}개
        </CommentHeader>

        <CommentForm>
          <CommentTextarea
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            disabled={submittingComment}
          />
          <CommentActions>
            <BaseButton
              variant="purple"
              size="small"
              onClick={handleCommentSubmit}
              disabled={submittingComment || !newComment.trim()}
            >
              {submittingComment ? '작성 중...' : '댓글 작성'}
            </BaseButton>
          </CommentActions>
        </CommentForm>

        <CommentList>
          {commentsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
              댓글을 불러오는 중...
            </div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
              첫 번째 댓글을 작성해보세요!
            </div>
          ) : (
            comments.map(comment => (
              <CommentItem key={comment.id}>
                <CommentAuthor>
                  <CommentAuthorInfo>
                    <CommentTextAvatar>
                      {comment.memberNickname?.charAt(0) || '익'}
                    </CommentTextAvatar>
                    {comment.memberNickname}
                  </CommentAuthorInfo>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <CommentTime>{formatDate(comment.createdAt)}</CommentTime>
                    {user && comment.memberNickname === user.nickname && (
                      <button
                        onClick={() => handleCommentDelete(comment.id, comment.memberNickname)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ff4757',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </CommentAuthor>
                <CommentContent>{comment.content}</CommentContent>
              </CommentItem>
            ))
          )}
        </CommentList>

        {/* 무한스크롤 트리거 (모바일) */}
        {isMobile && !isLastPage && <InfiniteScrollTrigger ref={triggerRef} />}

        {/* 더보기 버튼 (모바일에서 무한스크롤 대체) */}
        {isMobile && !isLastPage && (
          <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? '로딩 중...' : '더보기'}
          </LoadMoreButton>
        )}

        {/* 로딩 중 표시 (모바일 무한스크롤) */}
        {isMobile && loadingMore && (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#aaa' }}>
            댓글을 더 불러오는 중...
          </div>
        )}

        {/* 페이지네이션 (데스크톱) */}
        {!isMobile && totalPages > 1 && (
          <PaginationWrapper>
            <PageButton
              onClick={() => handlePageChange(currentPage - 1)}
              $disabled={currentPage === 0}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={16} />
            </PageButton>

            {getPageNumbers().map(pageNum => (
              <PageButton
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                $active={pageNum === currentPage}
              >
                {pageNum + 1}
              </PageButton>
            ))}

            <PageButton
              onClick={() => handlePageChange(currentPage + 1)}
              $disabled={currentPage === totalPages - 1}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight size={16} />
            </PageButton>
          </PaginationWrapper>
        )}
      </CommentSection>
    </PageWrap>
  )
}

export default DebateDetailPage

const MovieInfoSection = styled.div`
  background: rgba(28, 28, 43, 0.6);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #444;
`

const MovieInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
`

const MovieContent = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`

const MoviePoster = styled.div`
  flex-shrink: 0;

  img {
    width: 200px;
    height: 300px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    text-align: center;

    img {
      width: 150px;
      height: 225px;
    }
  }
`

const MovieDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const MovieTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.3;
`

const MovieMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: #aaa;
  font-size: 0.9rem;
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MovieDescription = styled.div`
  color: #ddd;
  line-height: 1.6;
  font-size: 0.95rem;
`

const RatingBadge = styled.span`
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`

// 프로필 이미지 관련 styled-components 추가
const ProfileAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #444;
`

const TextAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #5025d1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  border: 1px solid #444;
`

const CommentProfileAvatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #444;
`

const CommentTextAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #5025d1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.7rem;
  border: 1px solid #444;
`

// 페이지네이션 관련 styled-components 추가
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 숨김 */
  }
`

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  background: ${props => (props.$active ? '#5025d1' : 'transparent')};
  color: ${props => (props.$active ? '#fff' : '#aaa')};
  border: 1px solid ${props => (props.$active ? '#5025d1' : '#666')};
  border-radius: 6px;
  padding: 0.5rem 0.8rem;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  font-size: 0.9rem;
  opacity: ${props => (props.$disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: ${props => (props.$active ? '#5025d1' : 'rgba(80, 37, 209, 0.1)')};
    color: ${props => (props.$active ? '#fff' : '#5025d1')};
    border-color: #5025d1;
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const LoadMoreButton = styled.button`
  display: none;
  width: 100%;
  background: rgba(28, 28, 43, 0.6);
  color: #5025d1;
  border: 1px solid #5025d1;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  margin-top: 1rem;

  &:hover {
    background: rgba(80, 37, 209, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    display: block; /* 모바일에서만 표시 */
  }
`

const InfiniteScrollTrigger = styled.div`
  height: 1px;
  margin-bottom: 2rem;
`

// 페이지네이션 응답 인터페이스
interface CommentPageResponse {
  content: Comment[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

interface Comment {
  id: number
  content: string
  memberNickname: string
  createdAt: string
}
