// MovieDetailPage.tsx
import styled from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import ReviewDebateCard from '@/components/feature/movieDetail/ReviewDebateCard'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import RatingCard from '@/components/starRating/RatingCard'
import MovieDetailHeader from '@/pages/movie/MovieDetailHeader'
import { Eye, EyeOff, Flag, ListPlus, Star, StarOff, ChevronDown } from 'lucide-react'

import { mapToMyReviewData, mapToReviewData, Review, ReviewData } from '@/pages/movie/reviewData'
import { MovieData } from '@/pages/movie/movieData'
import ReviewTextArea from '@/pages/movie/ReviewTextArea'
import { mapToMovieData } from '@/pages/movie/movieDataMapper'
import { useAuth } from '@/context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useOnClickAuth } from '@/hooks/useOnClickAuth'
import BaseButton from '@/components/common/BaseButton'
import {
  bookmarkMovie,
  // getMovieDebate,
  getMovieDetail,
  getMovieReview,
  getMyMovieReview,
  watchedMovie,
  getMovieReviewByPopular,
  getSimilarReviews,
} from '@/services/movieDetail'
import Swal from 'sweetalert2'
import DebateCard from '@/components/feature/movieDetail/DebateCard'
import { DebateData, DebateListResponse, getMovieDebates } from '@/services/debate'
import { Icon } from '@iconify/react'
// import {DebateData, mapToDebateData} from "@/pages/movie/debateData";
import netflixImg from '@/assets/platform/netflix.png'
import watchaImg from '@/assets/platform/watcha.png'
import disneyPlusImg from '@/assets/platform/disney_plus.png'
import wavveImg from '@/assets/platform/wavve.png'
import PlaylistAddModal from '@/components/feature/PlaylistAddModal'

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

const DetailImage = styled.img`
  margin-bottom: 20px;
  height: 200px;
  width: 300px;
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
  font-size: 20px;
  margin: 20px 0 0 20px;
  font-weight: bold;
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

const DetailMediaContents = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  min-width: 800px;
  min-height: 200px;
  align-items: start;
  margin: 0 auto;
  gap: 5px;
`

// 미디어를 2줄 가로로 배열, 좌우로 스크롤
const MediaContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  max-width: 800px;
  min-width: 800px;
  min-height: 200px;
  overflow-x: auto;
  margin: 0 auto;
  gap: 10px;
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
  margin: 0 auto;
`

const ContentsListTitleTab = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
`

// const ContentsListOrderDropdown = styled.div`
//   width: 80px;
//   height: 30px;
//   display: flex;
//   border-radius: 5px;
//   background-color: #191513;
//   text-align: center;
//   align-items: center;
//   justify-content: center;
// `

const TabButton = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  width: 100px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
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
  border: 1px solid ${({ $active, $disabled }) => ($disabled ? '#444' : $active ? '#FE6A3C' : '#666')};

  &:hover {
    background-color: ${({ $disabled, $active }) =>
      $disabled ? '#333' : $active ? '#E55A2B' : 'rgba(254, 106, 60, 0.1)'};
  }
`

const getPlatformSrc = (platformName: string) => {
  console.log('플랫폼 이름 확인 : ', platformName)
  switch (platformName) {
    case 'Netflix':
    case 'Netflix Standard with Ads':
      console.log('Netflix 이미지 반환 : ', netflixImg)
      return netflixImg
    case 'Watcha':
      console.log('Watcha 이미지 반환 : ', watchaImg)
      return watchaImg
    case 'Disney+':
      console.log('Disney+ 이미지 반환 : ', disneyPlusImg)
      return disneyPlusImg
    case 'wavve':
      console.log('wavve 이미지 반환 : ', wavveImg)
      return wavveImg
    default:
      console.log('매칭되지 않는 플랫폼 : ', platformName)
      return null // 기본값 설정
  }
}

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
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  margin-top: 0.25rem;
`

const DropdownItem = styled.button<{ $active: boolean }>`
  width: 100%;
  background: none;
  border: none;
  color: ${props => (props.$active ? '#ff7849' : '#ccc')};
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

interface MockedMovieData {
  movieData: MovieData
  reviewData: ReviewData
  myReview: Review | null
  debates: DebateData[]
  isLoading: boolean
  isBookmarked: boolean
  isWatched: boolean
  isLiked: boolean
  activeTab: 'overview' | 'review' | 'debate' | 'media'
  activePlatformTab: 'BUY' | 'FLATRATE' | 'RENT'
}

export function mockedData(): MockedMovieData {
  const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

  // TMDB detail API 데이터를 활용한 영화 정보 모킹
  const movieData: MovieData = {
    movieId: 1,
    tmdbId: 803796,
    title: 'KPop Demon Hunters',
    originalTitle: 'KPop Demon Hunters',
    overview: '', // TMDB 데이터에서는 overview가 비어있음
    posterImg: `${BASE_IMAGE_URL}/22AouvwlhlXbe3nrFcjzL24bvWH.jpg`,
    backgroundImg: `${BASE_IMAGE_URL}/l3ycQYwWmbz7p8otwbomFDXIEhn.jpg`,
    releaseDate: '2025-06-20',
    runtime: 96,
    productionYear: 2025,
    productionCountry: 'United States of America',
    ageRating: 'Released',
    voteAverage: 8.411,
    myRating: 0,
    popcorn: 1044, // vote_count를 popcorn으로 사용
    myLike: false,
    myHate: false,
    myWatched: false,
    myBookmark: false,
    likeCnt: 1044, // 임의로 vote_count를 likeCnt로 사용
    hateCnt: 0,
    genres: [
      { tmdbId: 16, genreName: 'Animation' },
      { tmdbId: 10402, genreName: 'Music' },
      { tmdbId: 28, genreName: 'Action' },
      { tmdbId: 14, genreName: 'Fantasy' },
      { tmdbId: 35, genreName: 'Comedy' }
    ],
    providers: [
      { providerName: 'Netflix', providerType: 'FLATRATE' },
      { providerName: 'Disney+', providerType: 'FLATRATE' },
      { providerName: 'Watcha', providerType: 'RENT' },
      { providerName: 'wavve', providerType: 'BUY' }
    ],
    casts: [
      {
        id: 144279,
        name: 'Arden Cho',
        profileImg: `${BASE_IMAGE_URL}/uPtfAFoEYeNGRl6n0GdxLPxdM9u.jpg`
      },
      {
        id: 1948606,
        name: 'May Hong',
        profileImg: `${BASE_IMAGE_URL}/hnWIn2hxnJt16j0rDTiqdbG5LQo.jpg`
      },
      {
        id: 2983147,
        name: 'Ji-young Yoo',
        profileImg: `${BASE_IMAGE_URL}/4jgtqpNWhMx8XOKQ9qQJvDdzbxG.jpg`
      },
      {
        id: 1571598,
        name: '안효섭',
        profileImg: `${BASE_IMAGE_URL}/ynu1x6RQnpKvsOLTvB2WhDo26D9.jpg`
      },
      {
        id: 28662,
        name: '김윤진',
        profileImg: `${BASE_IMAGE_URL}/xS7eco56mUiZGJGWDZ0pwzrUAei.jpg`
      }
    ],
    images: [
      `${BASE_IMAGE_URL}/l3ycQYwWmbz7p8otwbomFDXIEhn.jpg`,
      `${BASE_IMAGE_URL}/rJjhOuRFldNF0OWSuSk4PiCLmeA.jpg`,
      `${BASE_IMAGE_URL}/7FAGQSghu7gNqnza6ZqIfMojk6g.jpg`,
      `${BASE_IMAGE_URL}/nNQ49WWdhJNHn733Zqrb3YXhd7J.jpg`,
      `${BASE_IMAGE_URL}/3ujssVzNMk3ypJaTs3QRywYoQIx.jpg`
    ],
    videos: [
      'qD9QZLnDlSc', // Behind the Lore, Songs & K-Culture
      'Ug_pv5-r1js', // "What It Sounds Like" Song Clip
      '5ZRsEnn2Wxw', // The Saja Boys CRASH Huntrix's Meet & Greet
      'qRl1BdinoHw', // Cast Takes on the SPICY Ramen Challenge
      'CDcEf3bGfcs'  // TWICE Rates Huntrix's Looks [Subtitled]
    ],
  };

  // 리뷰 데이터 모킹
  const reviewData: ReviewData = {
    reviews: [
      {
        member: {
          memberId: 1,
          nickname: '영화팬1',
          profileImage: null,
          popcornScore: 500
        },
        contentId: 1,
        createdAt: '2023-08-15T14:30:00',
        content: '애니메이션과 K-POP이 결합된 신선한 시도! 음악과 액션 씬이 정말 인상적이었습니다.',
        rating: 4.5,
        likes: 120,
        hates: 5,
        isMyPost: false,
        isSpoiler: false
      },
      {
        member: {
          memberId: 2,
          nickname: 'K-POP러버',
          profileImage: null,
          popcornScore: 750
        },
        contentId: 2,
        createdAt: '2023-08-16T09:15:00',
        content: '음악이 정말 좋았어요! 캐릭터 디자인도 매력적이고 스토리도 재미있었습니다.',
        rating: 5.0,
        likes: 200,
        hates: 3,
        isMyPost: false,
        isSpoiler: false
      }
    ],
    totalElements: 2
  };

  // 내 리뷰 데이터 모킹
  const myReview: Review = {
    member: {
      memberId: 3,
      nickname: '내닉네임',
      profileImage: null,
      popcornScore: 1200
    },
    contentId: 3,
    createdAt: '2023-08-17T10:45:00',
    content: '한국 문화와 애니메이션의 만남이 이렇게 멋질 줄이야! 음악과 액션 모두 완벽했습니다.',
    rating: 4.8,
    likes: 50,
    hates: 1,
    isMyPost: true,
    isSpoiler: false
  };

  // 토론 데이터 모킹
  const debates: DebateListResponse = {
    content: [
      {
        debateId: 1,
        memberId: 4,
        tmdbId: 803796,
        movie: null,
        movieTitle: 'KPop Demon Hunters',
        debateTitle: '이 영화의 음악이 K-POP 산업에 미칠 영향은?',
        content: '이 영화가 K-POP의 글로벌 인기에 어떤 영향을 미칠지 토론해봅시다.',
        spoiler: false,
        likeCnt: 85,
        hateCnt: 2,
        createdAt: '2023-08-18T16:20:00',
        updatedAt: '2023-08-18T16:20:00',
        nickname: '문화평론가',
        profileImage: null,
        popcorn: 980,
        commentCount: 15
      },
      {
        debateId: 2,
        memberId: 5,
        tmdbId: 803796,
        movie: null,
        movieTitle: 'KPop Demon Hunters',
        debateTitle: '애니메이션 스타일에 대한 의견',
        content: '이 영화의 애니메이션 스타일이 한국 문화를 잘 표현했다고 생각하시나요?',
        spoiler: false,
        likeCnt: 62,
        hateCnt: 4,
        createdAt: '2023-08-19T11:30:00',
        updatedAt: '2023-08-19T11:30:00',
        nickname: '애니메이션팬',
        profileImage: null,
        popcorn: 820,
        commentCount: 8
      }
    ],
    currentPage: 0,
    totalPages: 1,
    totalElements: 2,
    numberOfElements: 2,
    first: true,
    last: true
  };

  return {
    movieData,
    reviewData,
    myReview,
    debates : debates.content,
    isLoading: false,
    isBookmarked: false,
    isWatched: false,
    isLiked: false,
    activeTab: 'overview',
    activePlatformTab: 'BUY',
  };
}

export default function MovieDetailPage(mockData?: MockedMovieData) {
  const [movieData, setMovieData] = useState<MovieData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'review' | 'debate' | 'media'>('overview')
  const [activePlatformTab, setActivePlatformTab] = useState<'BUY' | 'FLATRATE' | 'RENT'>('BUY')
  // const [isLiked, setIsLiked] = useState(false)
  const [isWatched, setIsWatched] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { tmdbId } = useParams<{ tmdbId: string }>()
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const onClickAuth = useOnClickAuth()
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [myReview, setMyReview] = useState<Review | null | undefined >(null)
  const [myRating, setMyRating] = useState<number |null | undefined >(1) // 내 별점 상태 추가
  // const [debateData, setDebateData] = useState<DebateData | null>(null)

  // 토론 관련 state 추가
  const [debates, setDebates] = useState<DebateData[]>([])
  const [debateLoading, setDebateLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // 스포일러 필터 state 추가
  const [showSpoilers, setShowSpoilers] = useState(false)

  // 플레이리스트 모달 state 추가
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)

  // 정렬 관련 state 추가
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'similar'>('latest')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const handlePlaylistAdd = useCallback(() => {
    if (!isAuthenticated) {
      Swal.fire({
        title: '로그인이 필요합니다',
        text: '플레이리스트에 추가하려면 로그인이 필요합니다.',
        icon: 'warning',
        confirmButtonText: '확인',
        confirmButtonColor: '#fe6a3c',
      })
      return
    }
    setPlaylistModalOpen(true)
  }, [isAuthenticated])

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

  // useEffect로 정렬 기준, 페이지, 탭 변경 시 리뷰 다시 불러오기
  useEffect(() => {
    if (activeTab === 'review') {
      fetchReviewsBySort()
    }
  }, [sortBy, currentPage, activeTab, myReview])

  const fetchMovieDetail = async () => {
    try {
      // setIsLoading(true)
      console.log('영화 상세 정보 불러오기 시작, 영화 ID : ', tmdbId, typeof tmdbId)
      const response = await getMovieDetail(tmdbId)
      const data = response.data
      console.log('영화 정보 조회됨 : ', data)
      const mappedData: MovieData = mapToMovieData(data)
      console.log('영화 정보 매핑됨 : ', mappedData)
      console.log('영화 providers 확인 : ', mappedData.providers)
      setMovieData(mappedData)
      // setIsLiked(mappedData.myLike)
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
      setMyRating(mappedData ? mappedData.rating : 1) // 내 별점 설정
    } catch (error) {
      console.error('내 리뷰 불러오기 실패:', error)
    } finally {
      console.log('내 리뷰 불러오기 및 매핑 완료')
    }
  }
  useEffect(() => {

    if (mockData) {
      setMovieData(mockData.movieData);
      setReviewData(mockData.reviewData);
      setMyReview(mockData.myReview);
      setDebates(mockData.debates);
      setIsLoading(false);
      setDebateLoading(false);
      return;
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
  }, [tmdbId, user, loading, isAuthenticated, activeTab, isLoading]) // activeTab 의존성 추가




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

  // // HTML 태그 제거하는 함수
  // const stripHtmlTags = (html: string): string => {
  //   const tmp = document.createElement('div')
  //   tmp.innerHTML = html
  //   return tmp.textContent || tmp.innerText || ''
  // }

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
        <Icon icon="line-md:loading-twotone-loop" fontSize={100} />
      </MovieDetailLayout>
    )
  }

  // 토론 클릭 핸들러 추가
  const handleDebateClick = (debateId: number) => {
    navigate(`/debate/${debateId}`)
  }

  // 스포일러 필터링된 토론 목록
  const filteredDebates = debates.filter(debate => showSpoilers || !debate.spoiler)

  // 정렬 라벨 반환 함수
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

  // 정렬 변경 핸들러
  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort)
    setIsDropdownOpen(false)
    setCurrentPage(0)
  }

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
        {/* 플레이리스트 추가 버튼 수정 */}
        <ActionButton size="small" icon={<ListPlus />} onClick={handlePlaylistAdd}>
          플레이리스트 추가
        </ActionButton>
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
                    $active={activePlatformTab === 'BUY'}
                    onClick={() => setActivePlatformTab('BUY')}
                  >
                    구매
                  </PlatformTabButton>
                  <PlatformTabButton
                    $active={activePlatformTab === 'FLATRATE'}
                    onClick={() => setActivePlatformTab('FLATRATE')}
                  >
                    구독
                  </PlatformTabButton>
                  <PlatformTabButton
                    $active={activePlatformTab === 'RENT'}
                    onClick={() => setActivePlatformTab('RENT')}
                  >
                    대여
                  </PlatformTabButton>
                </OverViewPlatformTab>
                <OverViewPlatformImageWrapper>
                  {movieData.providers
                    .filter(provider => provider.providerType === activePlatformTab)
                    .map((provider, index) => {
                      const imageSrc = getPlatformSrc(provider.providerName)
                      return imageSrc ? (
                        <PlatFormImage key={index}>
                          <img
                            src={imageSrc}
                            alt={provider.providerName}
                            style={{ width: '100px', height: '100px' }}
                            onError={e => {
                              console.error(`이미지 로드 실패: ${provider.providerName}`)
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </PlatFormImage>
                      ) : null
                    })}
                </OverViewPlatformImageWrapper>
              </OverViewPlatformWrapper>
            </OverViewContents>
          )}
          {activeTab === 'review' && (
            <ReviewDebateContents>
              <RatingWrapper>
                <RatingCard
                  key={`vote-${movieData.voteAverage}`}
                  title="전체 평점"
                  rating={movieData.voteAverage}
                  size={40}
                  editable={false}
                />

                <RatingCard
                  title="내 평점"
                  rating={myRating}
                  size={40}
                  editable={true}
                  onRate={(value) => {
                    setMyRating(value)
                  }}
                />

              </RatingWrapper>
              <p>리뷰를 저장해야 별점이 적용됩니다!</p>
              <DetailMyReviewWrapper>
                <DetailMyReviewCard>
                  <ReviewTextArea
                    tmdbId={tmdbId!}
                    myReview={myReview}
                    rating={myRating}
                    isAuthenticated={isAuthenticated}
                    onSuccess={async () => {
                      try {
                        console.log('리뷰 저장 후 갱신 시작')
                        await new Promise(resolve => setTimeout(resolve, 500)) // 응답 대기는 유지
                        console.log('대기 시간 후 갱신 시작')
                        await fetchMovieDetail() // 전체 평점 다시 받아오기
                        await fetchMyReview()    // 내 평점/리뷰도 다시 받아오기
                      } catch (error) {
                        console.error('리뷰 저장 후 갱신 실패:', error)
                      }
                    }}
                  />
                </DetailMyReviewCard>
              </DetailMyReviewWrapper>
              <ContentsListWrapper>
                <ContentsListTitleTab>
                  <ContentsTitle>리뷰 ({reviewData?.totalElements})</ContentsTitle>
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
                  {reviewData?.reviews.map((review, index) => (
                    <DetailReviewCardWrapper key={index}>
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
                        isSpoiler={review.isSpoiler}
                        profileImage={review.member.profileImage}
                        contentId={review.reviewId || review.contentId || 0}
                        memberId={review.member.memberId}
                      />
                    </DetailReviewCardWrapper>
                  ))}
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
                    {filteredDebates.length > 0 ? (
                        filteredDebates.map(debate => (
                          <DetailReviewCardWrapper key={debate.debateId}>
                            <DebateCard
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
                          </DetailReviewCardWrapper>)))
                      : (
                        <div style={{
                          textAlign: 'center',
                          padding: '40px',
                          color: '#666',
                          width: '100%',
                        }}> {showSpoilers
                          ? isAuthenticated
                            ? '아직 작성된 토론이 없습니다. 첫 번째 토론을 시작해보세요!'
                            : '아직 작성된 토론이 없습니다.'
                          : isAuthenticated
                            ? '스포일러가 아닌 토론이 없습니다. 스포일러 포함을 선택하거나 새로운 토론을 작성해보세요!'
                            : '스포일러가 아닌 토론이 없습니다. 스포일러 포함을 선택해보세요.'}
                        </div>
                      )}
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
            <DetailMediaContents>
              <ContentsTitle>유튜브 ({movieData.videos.length})</ContentsTitle>
              {/* 영화 유튜브 랜더링*/}
              <MediaContents>
                {movieData.videos.length === 0 ? (
                  <p>유튜브 영상이 없습니다.</p>
                ) : (
                  movieData.videos.map((video) => (
                  // movieData.videos.map((video, index) => (
                    // <iframe
                    //   width={300}
                    //   height={200}
                    //   style={{
                    //     width: '300px',
                    //     height: '200px',
                    //     marginBottom: '10px',
                    //     border: 'none',
                    //   }}
                    //   key={index}
                    //   src={video.replace('watch?v=', 'embed/')}
                    //   title={`YouTube video player ${index + 1}`}
                    //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    //   allowFullScreen
                    // />
                    <div
                      key={video}
                      style={{
                          width: '300px',
                          height: '200px',
                          marginBottom: '10px',
                          border: 'none',
                        }}
                          > </div>
                  ))
                )}
              </MediaContents>
              {/* 영화 이미지 */}
              <ContentsTitle>이미지 ({movieData.images.length})</ContentsTitle>
              <MediaContents>
                {movieData.images.length === 0 ? (
                  <p>이미지가 없습니다.</p>
                ) : (
                  movieData.images.map((image, index) => (
                    <DetailImage
                      key={index}
                      src={image}
                      alt={`Movie image ${index + 1}`}
                      style={{ width: '300px', height: 'auto', marginBottom: '10px' }}
                      onError={e => {
                        console.error(`이미지 로드 실패: ${image}`)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ))
                )}
              </MediaContents>
            </DetailMediaContents>
          )}
        </MovieDetailMainContent>
      </MovieDetailMain>
      {/* 플레이리스트 추가 모달 추가 */}
      <PlaylistAddModal
        isOpen={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        movieId={movieData.tmdbId}
        movieTitle={movieData.title}
        moviePosterUrl={movieData.posterImg}
        movieReleaseDate={movieData.productionYear?.toString()} // number를 string으로 변환
      />
    </MovieDetailLayout>
  )
}
