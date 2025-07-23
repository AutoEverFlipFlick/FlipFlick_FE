// MovieDetailPage.tsx
import styled from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import ReviewDebateCard from '@/components/feature/movieDetail/ReviewDebateCard'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import RatingCard from '@/components/starRating/RatingCard'
import { mapToMovieData } from '@/pages/movie/movieDataMapper'
import MovieDetailHeader from '@/pages/movie/MovieDetailHeader'
import { useAuth } from '@/context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import { useOnClickAuth } from '@/hooks/useOnClickAuth'
import BaseButton from '@/components/common/BaseButton'
import { Eye, EyeOff, Flag, ListPlus, Star, StarOff, ChevronDown } from 'lucide-react'
import {
  bookmarkMovie,
  getMovieDetail,
  getMovieReview,
  getMyMovieReview,
  watchedMovie,
  getMovieReviewByPopular,
  getSimilarReviews,
} from '@/services/movieDetail'
import { mapToMyReviewData, mapToReviewData, Review, ReviewData } from '@/pages/movie/reviewData'
import { MovieData } from '@/pages/movie/movieData'
import ReviewTextArea from '@/pages/movie/ReviewTextArea'
import Swal from 'sweetalert2'
import { getMovieDebates, DebateData } from '@/services/debate'
import DebateCard from '@/components/feature/movieDetail/DebateCard'

const MovieDetailLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const MovieDetailMain = styled.div`
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PlatFormImage = styled.div`
  min-width: 120px;
  min-height: 120px;
`

const HeaderContentsContainer = styled(BaseContainer)`
  margin: 5px 10px;
  padding: 10px 10px;
  display: flex;
`

const DetailImage = styled.div`
  margin-bottom: 20px;
  height: 150px;
  display: flex;
  justify-content: start;
`

const MovieDetailMainAction = styled.div`
  display: flex;
  max-width: 700px;
  margin: 20px auto;
  height: 100%;
  gap: 10px;
`

const MovieDetailMainContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  max-width: 800px;
  min-width: 800px;
  margin: 0 auto;
`

const MovieDetailMainContentTab = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  max-width: 900px;
  min-width: 850px;
  margin: 10px auto;
  height: 30px;
  gap: 50px;
  border-bottom: white 1px solid;
`

const OverViewContents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  max-width: 850px;
  min-width: 800px;
  margin: 0 auto;
  gap: 20px;
`

const OverViewContainerWrapper = styled(HeaderContentsContainer)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  max-width: 850px;
  min-width: 800px;
  margin: 20px auto;
  padding: 30px 20px;
  gap: 20px;
`
const OverViewPlatformWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  max-width: 850px;
  min-width: 800px;
  margin: 0 auto;
  gap: 20px;
`
const OverViewPlatformImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  max-width: 850px;
  min-width: 200px;
  height: 100px;
  margin: 10px auto;
  gap: 20px;
`

const OverViewPlatformTab = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  gap: 20px;
`

const OverViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  min-width: 220px;
  word-wrap: break-word;
  min-height: 40px;
  max-height: 100px;
  box-sizing: border-box;
`
const ContentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  font-weight: bold;
  width: 100%;
  min-height: 50px;
`
const ContentsTitle = styled.div`
  font-size: 25px;
  margin: 20px 0 0 20px;
`

const ReviewDebateContents = styled.div`
  display: flex;
  max-width: 800px;
  min-width: 800px;
  min-height: 100px;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  margin: 0 auto;
  gap: 5px;
`

const DetailImageContents = styled.div`
  display: flex;
  max-width: 800px;
  min-width: 800px;
  min-height: 200px;
  justify-content: start;
  align-items: center;
  margin: 0 auto;
  gap: 5px;
`
const RatingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  max-width: 800px;
  min-width: 800px;
  margin: 0 auto;
  gap: 10px;
`

const DetailMyReviewCard = styled(BaseContainer)`
  min-width: 800px;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DetailMyReviewWrapper = styled.div`
  width: 100%;
  min-height: 100px;
  max-height: 300px;
  display: flex;
  margin: 0 auto;
  color: #191513;
  justify-content: center;
  align-items: center;
`
const ContentsListWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  margin: 10px auto;
`
const ReviewDebateList = styled.div`
  width: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  margin: 5px auto;
`
const DetailReviewCardWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: column; /* 세로 배치 */
  gap: 20px; /* 카드들 사이 간격 */
  margin: 0 auto;
  padding: 10px 0; /* 상하 패딩 추가 */
`

const ContentsListTitleTab = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
`

const ContentsListOrderDropdown = styled.div`
  width: 80px;
  height: 30px;
  display: flex;
  border-radius: 5px;
  background-color: #191513;
  text-align: center;
  align-items: center;
  justify-content: center;
`

const TabButton = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  width: 100px;
  text-align: center;
  font-size: 20px;
  color: ${({ $active }) => ($active ? '#FE6A3C' : '#fff')};
  border-bottom: ${({ $active }) => ($active ? '3px solid #FE6A3C' : 'none')};
`

const PlatformTabButton = styled.button<{ $active?: boolean }>`
  all: unset;
  cursor: pointer;
  width: 100px;
  text-align: center;
  font-size: 20px;
  color: ${({ $active }) => ($active ? '#FE6A3C' : '#fff')};
  border-bottom: ${({ $active }) => ($active ? '1px solid #FE6A3C' : 'none')};
`

const ActionButton = styled(BaseButton).attrs({
  size: 'small',
})`
  align-items: center;
`

// 스타일드 컴포넌트 추가
const SpoilerToggle = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  gap: 10px;
`

const SpoilerToggleLabel = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
`

const SpoilerToggleSwitch = styled.div<{ $active: boolean }>`
  position: relative;
  width: 50px;
  height: 24px;
  background-color: ${({ $active }) => ($active ? '#FE6A3C' : '#666')};
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#E55A2B' : '#777')};
  }
`

const SpoilerToggleKnob = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $active }) => ($active ? '26px' : '2px')};
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
  transition: left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

const WriteButton = styled(BaseButton)`
  margin-bottom: 20px;
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 20px 0;
`

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  all: unset;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  padding: 8px 12px;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;

  background-color: ${({ $active, $disabled }) =>
    $disabled ? '#333' : $active ? '#FE6A3C' : 'transparent'};
  color: ${({ $active, $disabled }) => ($disabled ? '#666' : $active ? '#fff' : '#fff')};
  border: 1px solid
    ${({ $active, $disabled }) => ($disabled ? '#444' : $active ? '#FE6A3C' : '#666')};

  &:hover {
    background-color: ${({ $disabled, $active }) =>
      $disabled ? '#333' : $active ? '#E55A2B' : 'rgba(254, 106, 60, 0.1)'};
  }
`

// SortContainer와 관련 컴포넌트들 추가
const SortContainer = styled.div`
  position: relative;
`

const SortButton = styled.button`
  background: #2a2a2a;
  border: 1px solid #444;
  color: #ccc;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    color: white;
    border-color: #555;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  min-width: 120px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  margin-top: 0.25rem;
`

const DropdownItem = styled.button<{ $active: boolean }>`
  width: 100%;
  background: none;
  border: none;
  color: ${props => props.$active ? '#ff7849' : '#ccc'};
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    color: white;
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`

export default function MovieDetailPage() {
  const [movieData, setMovieData] = useState<MovieData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'review' | 'debate' | 'media'>('overview')
  const [activePlatformTab, setActivePlatformTab] = useState<'구매' | '정액제' | '대여'>('구매')
  const [isLiked, setIsLiked] = useState(false)
  const [isWatched, setIsWatched] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { tmdbId } = useParams<{ tmdbId: string }>()
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const onClickAuth = useOnClickAuth()
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [myReview, setMyReview] = useState<Review | null>(null)

  // 토론 관련 state 추가
  const [debates, setDebates] = useState<DebateData[]>([])
  const [debateLoading, setDebateLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // 스포일러 필터 state 추가
  const [showSpoilers, setShowSpoilers] = useState(false)

  // 정렬 방식 관련 state 추가
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'similar'>('latest')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 드롭다운 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleBookmark = useCallback(
    () =>
      onClickAuth(async () => {
        const movieId = movieData?.movieId
        if (!movieId) return
        console.log('Bookmark 눌림', isBookmarked)
        setIsBookmarked(prev => !prev)
        try {
          await bookmarkMovie(movieId)
          await Swal.fire({
            title: !isBookmarked ? '찜 완료' : '찜 취소',
            text: !isBookmarked ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.',
            icon: 'success',
            confirmButtonText: '확인',
          })
        } catch {
          await Swal.fire({
            title: '찜 처리 실패',
            text: '찜 목록에 추가하는 데 실패했습니다. 다시 시도해주세요.',
            icon: 'error',
            confirmButtonText: '확인',
          })
          console.error('찜 처리 실패')

          setIsBookmarked(prev => !prev)
        }
      })(),
    [onClickAuth, movieData?.movieId, isBookmarked],
  )

  const handleView = useCallback(
    () =>
      onClickAuth(async () => {
        const movieId = movieData?.movieId
        if (!movieId) return
        setIsWatched(prev => !prev)
        try {
          await watchedMovie(movieId)
          await Swal.fire({
            title: !isWatched ? '봤어요' : '봤어요 취소',
            text: !isWatched ? '봤어요 목록에 추가되었습니다.' : '봤어요 목록에서 제거되었습니다.',
            icon: 'success',
            confirmButtonText: '확인',
          })
        } catch {
          await Swal.fire({
            title: '봤어요 처리 실패',
            text: '봤어요 목록에 추가하는 데 실패했습니다. 다시 시도해주세요.',
            icon: 'error',
            confirmButtonText: '확인',
          })
          setIsWatched(prev => !prev)
        }
      })(),
    [onClickAuth, movieData?.movieId, isWatched],
  )

  // 토론 목록 가져오기 함수 추가
  const fetchDebates = async (page: number = 0) => {
    if (!tmdbId) return

    setDebateLoading(true)
    try {
      console.log('🎬 토론 목록 조회 시작:', tmdbId)

      const response = await getMovieDebates(tmdbId, page, 10, 'latest')

      if (response.success) {
        console.log('✅ 토론 목록 조회 성공:', response.data)
        setDebates(response.data.content)
        setCurrentPage(response.data.currentPage)
        setTotalPages(response.data.totalPages)
      } else {
        console.error('❌ 토론 목록 조회 실패:', response.message)
      }
    } catch (error) {
      console.error('❌ 토론 목록 조회 에러:', error)
    } finally {
      setDebateLoading(false)
    }
  }

  // 정렬 방식에 따른 리뷰 조회 함수
  const fetchReviewsBySort = async () => {
    try {
      let response
      switch (sortBy) {
        case 'popular':
          response = await getMovieReviewByPopular(tmdbId, currentPage)
          break
        case 'similar':
          response = await getSimilarReviews(tmdbId, currentPage)
          break
        default:
          response = await getMovieReview(tmdbId, currentPage)
      }
      
      if (response.success) {
        const mappedData: ReviewData = mapToReviewData(response.data, user?.id, user?.nickname)
        setReviewData(mappedData)
      }
    } catch (error) {
      console.error('리뷰 조회 실패:', error)
    }
  }

  // sortBy가 변경될 때마다 리뷰 다시 조회
  useEffect(() => {
    if (activeTab === 'review') {
      fetchReviewsBySort()
    }
  }, [sortBy, currentPage, activeTab])

  const getSortLabel = (sort: typeof sortBy) => {
    switch (sort) {
      case 'popular':
        return '인기순'
      case 'similar':
        return '유사한 성향'
      default:
        return '최신순'
    }
  }

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort)
    setIsDropdownOpen(false)
    setCurrentPage(0)
  }

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        console.log('영화 상세 정보 불러오기 시작, 영화 ID : ', tmdbId, typeof tmdbId)
        const response = await getMovieDetail(tmdbId)
        const data = response.data
        console.log('영화 정보 조회됨 : ', data)
        const mappedData: MovieData = mapToMovieData(data)
        console.log('영화 정보 매핑됨 : ', mappedData)
        setMovieData(mappedData)
        setIsLiked(mappedData.myLike)
        setIsWatched(mappedData.myWatched)
        setIsBookmarked(mappedData.myBookmark)
      } catch (error) {
        console.error('영화 상세 정보 불러오기 실패:', error)
      } finally {
        console.log('영화 상세 정보 불러오기 및 매핑 완료')
      }
    }
    const fetchMovieReview = async () => {
      try {
        console.log('영화 리뷰 불러오기 시작, 영화 ID : ', tmdbId, typeof tmdbId)
        const response = await getMovieReview(tmdbId, 0)
        const data = response.data
        console.log('영화 리뷰 조회됨 : ', data)
        console.log('영화 리뷰 매핑시 사용된 유저 정보 : ', user, isAuthenticated, user?.id)
        const mappedData: ReviewData = mapToReviewData(data, user?.id, user?.nickname)
        console.log('영화 리뷰 매핑됨 : ', mappedData)
        // setMyReview(mappedData)
        setReviewData(mappedData)
      } catch (error) {
        console.error('영화 리뷰 불러오기 실패:', error)
      } finally {
        console.log('영화 리뷰 불러오기 및 매핑 완료')
      }
    }

    const fetchMyReview = async () => {
      try {
        console.log('내 리뷰 불러오기 시작, 영화 ID : ', tmdbId, typeof tmdbId)
        const response = await getMyMovieReview(tmdbId)
        const data = response.data
        console.log('내 리뷰 조회됨 : ', data)
        const mappedData: Review | null = mapToMyReviewData(data)
        console.log('내 리뷰 매핑됨 : ', mappedData)
        setMyReview(mappedData)
      } catch (error) {
        console.error('내 리뷰 불러오기 실패:', error)
      } finally {
        console.log('내 리뷰 불러오기 및 매핑 완료')
      }
    }

    try {
      if (loading) return // 로딩 중이면 아무것도 하지 않음

      if (isAuthenticated && user) {
        // 인증된 경우에만 내 리뷰 호출
        console.log('유저 정보 로딩 완료, 영화 상세 정보 및 리뷰 불러오기 시작')
        fetchMovieDetail()
        fetchMovieReview()
        fetchMyReview()
        // 토론 탭이 활성화된 경우에만 토론 로드
        if (activeTab === 'debate') {
          fetchDebates(0)
        }
      } else {
        // 비로그인 상태
        console.log('유저 정보 미인증 상태, 영화 상세 정보 및 리뷰 불러오기 시작')
        fetchMovieDetail()
        fetchMovieReview()
        // 토론 탭이 활성화된 경우에만 토론 로드
        if (activeTab === 'debate') {
          fetchDebates(0)
        }
      }
    } catch (error) {
      console.error('영화 상세 페이지 정보 불러오기 중 오류 발생:', error)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }, [tmdbId, user, loading, isAuthenticated, activeTab]) // activeTab 의존성 추가

  // HTML에서 이미지 URL 추출하는 함수
  const extractImagesFromContent = (htmlContent: string): string[] => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g
    const images: string[] = []
    let match

    while ((match = imgRegex.exec(htmlContent)) !== null) {
      images.push(match[1])
    }

    return images
  }

  // HTML 태그 제거하는 함수
  const stripHtmlTags = (html: string): string => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // 시간 포맷 함수
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}일 전`
    }
  }

  if (isLoading || !movieData) {
    console.debug(isLoading)
    return (
      <MovieDetailLayout>
        <p style={{ color: 'white' }}>로딩 중입니다...</p>
        {/* 페이지 구성 자체에 최소 크기가 정해진 영역이 많음 */}
        {/* 하위 컴포넌트에 예외 처리 추가 필요 */}
        {/* isLoading, 정의되지 않음, 전달 받은 데이터가 특정 조건에 해당 */}
      </MovieDetailLayout>
    )
  }

  // 토론 클릭 핸들러 추가
  const handleDebateClick = (debateId: number) => {
    navigate(`/debate/${debateId}`)
  }

  // 스포일러 필터링된 토론 목록
  const filteredDebates = debates.filter(debate => showSpoilers || !debate.spoiler)

  return (
    <MovieDetailLayout>
      <MovieDetailHeader movieData={movieData} />
      <MovieDetailMainAction>
        <ActionButton
          size="small"
          icon={isBookmarked ? <StarOff /> : <Star />}
          onClick={handleBookmark}
        >
          {isBookmarked ? '찜 취소' : '찜하기'}
        </ActionButton>
        <ActionButton size="small" icon={isWatched ? <EyeOff /> : <Eye />} onClick={handleView}>
          {isWatched ? '봤어요 취소' : '봤어요'}
        </ActionButton>
        {/* TODO : 플레이리스트 모달 호출 구현하기 */}
        <ActionButton size="small" icon={<ListPlus />}>
          플레이리스트 추가
        </ActionButton>
        {/* TODO : 수정/신고 모달 호출 구현하기 */}
        <ActionButton size="small" icon={<Flag />}>
          수정 요청
        </ActionButton>
      </MovieDetailMainAction>
      <MovieDetailMain>
        <MovieDetailMainContentTab>
          <TabButton $active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            개요
          </TabButton>
          <TabButton $active={activeTab === 'review'} onClick={() => setActiveTab('review')}>
            리뷰
          </TabButton>
          <TabButton $active={activeTab === 'debate'} onClick={() => setActiveTab('debate')}>
            토론장
          </TabButton>
          <TabButton $active={activeTab === 'media'} onClick={() => setActiveTab('media')}>
            사진
          </TabButton>
        </MovieDetailMainContentTab>
        <MovieDetailMainContent>
          {activeTab === 'overview' && (
            <OverViewContents>
              <ContentsListTitleTab>
                <ContentsTitle>개요</ContentsTitle>
              </ContentsListTitleTab>
              <OverViewContainerWrapper>
                <OverViewContainer>
                  <p>장르: {movieData.genres.map(genre => genre.genreName).join(', ')}</p>
                  <p>러닝타임: {movieData.runtime ?? '정보 없음'}분</p>
                </OverViewContainer>
                <OverViewContainer>
                  <p>개봉일: {movieData.productionYear ?? '미정'}</p>
                  <p>제작국가: {movieData.productionCountry ?? '정보 없음'}</p>
                  {/*<p>제작국가: {movieData.overviewData.productionCountry}</p>*/}
                </OverViewContainer>
                <OverViewContainer>
                  <p>연령등급: {movieData.ageRating ?? '정보 없음'}</p>
                  <p>
                    평균 평점:{' '}
                    {movieData.voteAverage === 0
                      ? '집계중'
                      : `${movieData.voteAverage.toFixed(1)}점`}
                  </p>
                </OverViewContainer>
              </OverViewContainerWrapper>
              <ContentsListTitleTab>
                <ContentsTitle>플랫폼</ContentsTitle>
              </ContentsListTitleTab>
              <OverViewPlatformWrapper>
                <OverViewPlatformTab>
                  <PlatformTabButton
                    $active={activePlatformTab === '구매'}
                    onClick={() => setActivePlatformTab('구매')}
                  >
                    구매
                  </PlatformTabButton>
                  <PlatformTabButton
                    $active={activePlatformTab === '정액제'}
                    onClick={() => setActivePlatformTab('정액제')}
                  >
                    구독
                  </PlatformTabButton>
                  <PlatformTabButton
                    $active={activePlatformTab === '대여'}
                    onClick={() => setActivePlatformTab('대여')}
                  >
                    대여
                  </PlatformTabButton>
                </OverViewPlatformTab>
                <OverViewPlatformImageWrapper>
                  {movieData.providers
                    .filter(provider => provider.type === activePlatformTab)
                    .map(provider => (
                      <PlatFormImage key={provider.name}>
                        <img
                          src={provider.logoUrl}
                          alt={provider.name}
                          style={{ width: '100px', height: '100px' }}
                        />
                      </PlatFormImage>
                    ))}
                </OverViewPlatformImageWrapper>
              </OverViewPlatformWrapper>
            </OverViewContents>
          )}
          {activeTab === 'review' && (
            <ReviewDebateContents>
              <RatingWrapper>
                <RatingCard title="전체 평점" rating={movieData.voteAverage} size={40} />
                <RatingCard title="평가하기" rating={movieData.myRating} size={40} />
              </RatingWrapper>
              <DetailMyReviewWrapper>
                <DetailMyReviewCard>
                  <ReviewTextArea
                    tmdbId={tmdbId!}
                    myReview={myReview}
                    rating={myReview?.rating || 1}
                    isAuthenticated={isAuthenticated}
                    onSuccess={async () => {
                      try {
                        const myReviewResponse = await getMyMovieReview(tmdbId!)
                        const data = myReviewResponse.data
                        const mappedData: Review | null = mapToMyReviewData(data)
                        setMyReview(mappedData)
                        const reviewResponse = await getMovieReview(tmdbId!, 0)
                        const reviewData = reviewResponse.data
                        const mappedReviewData: ReviewData = mapToReviewData(
                          reviewData,
                          user?.id,
                          user?.nickname,
                        )
                        setReviewData(mappedReviewData)
                      } catch (error) {
                        console.error('내 리뷰 불러오기 실패:', error)
                      }
                    }}
                  />
                </DetailMyReviewCard>
              </DetailMyReviewWrapper>
              <ContentsListWrapper>
                <ContentsListTitleTab>
                  <ContentsTitle>리뷰</ContentsTitle>
                  <SortContainer ref={dropdownRef}>
                    <SortButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                      {getSortLabel(sortBy)} <ChevronDown size={16} />
                    </SortButton>
                    <DropdownMenu $isOpen={isDropdownOpen}>
                      <DropdownItem
                        $active={sortBy === 'latest'}
                        onClick={() => handleSortChange('latest')}
                      >
                        최신순
                      </DropdownItem>
                      <DropdownItem
                        $active={sortBy === 'popular'}
                        onClick={() => handleSortChange('popular')}
                      >
                        인기순
                      </DropdownItem>
                      <DropdownItem
                        $active={sortBy === 'similar'}
                        onClick={() => handleSortChange('similar')}
                      >
                        유사한 성향
                      </DropdownItem>
                    </DropdownMenu>
                    </SortContainer>
                  </ContentsListTitleTab>
                <ReviewDebateList>
                  <DetailReviewCardWrapper>
                    {reviewData?.reviews.length > 0 ? (
                      reviewData.reviews.map(review => (
                        <ReviewDebateCard
                          key={review.contentId}
                          content={review.content}
                          createdAt={review.createdAt}
                          username={review.member.nickname}
                          type={'review'}
                          isMyPost={review.isMyPost}
                          likes={review.likes}
                          hates={review.hates}
                          rating={review.rating}
                        />
                      ))
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666',
                        width: '100%',
                      }}>
                        {sortBy === 'similar' 
                          ? '아직 정보가 부족합니다' 
                          : '작성된 리뷰가 없습니다'}
                      </div>
                    )}
                  </DetailReviewCardWrapper>
                </ReviewDebateList>
              </ContentsListWrapper>
            </ReviewDebateContents>
          )}
          {activeTab === 'debate' && (
            <ReviewDebateContents>
              <ContentsHeader>
                <ContentsTitle>토론장</ContentsTitle>
                {/* 로그인한 사용자만 토론 작성 버튼 표시 */}
                {isAuthenticated && (
                  <WriteButton
                    variant="orange"
                    size="small"
                    onClick={() => navigate(`/debate/write?tmdbId=${tmdbId}`)}
                  >
                    토론 작성하기
                  </WriteButton>
                )}
              </ContentsHeader>

              {/* 스포일러 토글을 별도 영역으로 분리 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: '16px',
                }}
              >
                <SpoilerToggle>
                  <SpoilerToggleLabel>스포일러 포함</SpoilerToggleLabel>
                  <SpoilerToggleSwitch
                    $active={showSpoilers}
                    onClick={() => setShowSpoilers(!showSpoilers)}
                  >
                    <SpoilerToggleKnob $active={showSpoilers} />
                  </SpoilerToggleSwitch>
                </SpoilerToggle>
              </div>

              {debateLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>
                  토론 목록을 불러오는 중...
                </div>
              ) : (
                <>
                  <ReviewDebateList>
                    <DetailReviewCardWrapper>
                      {filteredDebates.length > 0 ? (
                        filteredDebates.map(debate => (
                          <DebateCard
                            key={debate.debateId}
                            debateId={debate.debateId}
                            title={debate.debateTitle}
                            content={debate.content}
                            username={debate.nickname}
                            createdAt={formatTimeAgo(debate.createdAt)}
                            likes={debate.likeCnt}
                            hates={debate.hateCnt}
                            comments={debate.commentCount}
                            isMyPost={user?.id === debate.memberId}
                            isSpoiler={debate.spoiler}
                            profileImage={debate.profileImage}
                            images={extractImagesFromContent(debate.content)}
                            onClick={() => handleDebateClick(debate.debateId)}
                          />
                        ))
                      ) : (
                        <div
                          style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#666',
                            width: '100%',
                          }}
                        >
                          {showSpoilers
                            ? isAuthenticated
                              ? '아직 작성된 토론이 없습니다. 첫 번째 토론을 시작해보세요!'
                              : '아직 작성된 토론이 없습니다.'
                            : isAuthenticated
                              ? '스포일러가 아닌 토론이 없습니다. 스포일러 포함을 선택하거나 새로운 토론을 작성해보세요!'
                              : '스포일러가 아닌 토론이 없습니다. 스포일러 포함을 선택해보세요.'}
                        </div>
                      )}
                    </DetailReviewCardWrapper>
                  </ReviewDebateList>

                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <PaginationWrapper>
                      {/* 이전 페이지 버튼 */}
                      <PageButton
                        $disabled={currentPage === 0}
                        onClick={() => {
                          if (currentPage > 0) {
                            const newPage = currentPage - 1
                            setCurrentPage(newPage)
                            fetchDebates(newPage)
                          }
                        }}
                      >
                        이전
                      </PageButton>

                      {/* 페이지 번호 버튼들 */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5))
                        const pageNum = startPage + i

                        return (
                          <PageButton
                            key={pageNum}
                            $active={pageNum === currentPage}
                            onClick={() => {
                              setCurrentPage(pageNum)
                              fetchDebates(pageNum)
                            }}
                          >
                            {pageNum + 1}
                          </PageButton>
                        )
                      })}

                      {/* 다음 페이지 버튼 */}
                      <PageButton
                        $disabled={currentPage >= totalPages - 1}
                        onClick={() => {
                          if (currentPage < totalPages - 1) {
                            const newPage = currentPage + 1
                            setCurrentPage(newPage)
                            fetchDebates(newPage)
                          }
                        }}
                      >
                        다음
                      </PageButton>
                    </PaginationWrapper>
                  )}
                </>
              )}
            </ReviewDebateContents>
          )}
          {activeTab === 'media' && (
            <DetailImageContents>
              {/* TODO : 영화 이미지와 유튜브 랜더링*/}
              <DetailImage>영화 이미지 Grid</DetailImage>
            </DetailImageContents>
          )}
        </MovieDetailMainContent>
      </MovieDetailMain>
    </MovieDetailLayout>
  )
}
