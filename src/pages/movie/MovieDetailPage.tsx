// MovieDetailPage.tsx
import styled from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import ReviewDebateCard from '@/components/feature/movieDetail/ReviewDebateCard'

import React, {useCallback, useEffect, useState} from 'react'
import RatingCard from '@/components/starRating/RatingCard'
import {mapToMovieData} from "@/pages/movie/movieDataMapper";
import MovieDetailHeader from "@/pages/movie/MovieDetailHeader";
import {useAuth} from "@/context/AuthContext";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import {useOnClickAuth} from "@/hooks/useOnClickAuth";
import BaseButton from "@/components/common/BaseButton";
import {Eye, EyeOff, Flag, ListPlus, Star, StarOff} from "lucide-react";
import {bookmarkMovie, getMovieDetail, getMovieReview, watchedMovie} from "@/services/movieDetail";
import {mapToReviewData, ReviewData} from "@/pages/movie/reviewData";
import {MovieData} from "@/pages/movie/movieData";

const MovieDetailLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`

// const MovieDetailHeader = styled.div`
//     max-width: 1000px;
//     margin: 0 auto;
//     min-height: 400px;
//     padding: 20px 15px 5px 15px;
//     display: flex;
//     align-items: center;
//     gap: 10px;
// `
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

const ReviewCard = styled(ReviewDebateCard)`
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
    color: ${({$active}) => ($active ? '#FE6A3C' : '#fff')};
    border-bottom: ${({$active}) => ($active ? '3px solid #FE6A3C' : 'none')};
`

const PlatformTabButton = styled.button<{ $active?: boolean }>`
    all: unset;
    cursor: pointer;
    width: 100px;
    text-align: center;
    font-size: 20px;
    color: ${({$active}) => ($active ? '#FE6A3C' : '#fff')};
    border-bottom: ${({$active}) => ($active ? '1px solid #FE6A3C' : 'none')};
`

const ActionButton = styled(BaseButton).attrs({
  size: 'small',
})`
    align-items: center;
`



export default function MovieDetailPage() {
  const [movieData, setMovieData] = useState<MovieData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'review' | 'debate' | 'media'>('overview')
  const [activePlatformTab, setActivePlatformTab] = useState<'구매' | '정액제' | '대여'>('구매')
  const [isLiked, setIsLiked] = useState(false)
  const [isWatched, setIsWatched] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const {tmdbId} = useParams<{ tmdbId: string }>()
  const {user, isAuthenticated, loading} = useAuth()

  const onClickAuth = useOnClickAuth()
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [myReview, setMyReview] = useState<ReviewData | null>(null)

  const handleBookmark = useCallback(
    () =>
      onClickAuth(async () => {
        const movieId = movieData?.movieId
        if (!movieId) return
        console.log('Bookmark 눌림', isBookmarked)
        setIsBookmarked(prev => !prev)
        try {
          await bookmarkMovie(movieId)
          toast.success(!isBookmarked ? '찜 완료' : '찜 취소')
        } catch {
          toast.error('처리에 실패했어요.')
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
          toast.success(!isWatched ? '봤어요' : '봤어요 취소')
        } catch {
          toast.error('처리에 실패했어요.')
          setIsWatched(prev => !prev)
        }
      })(),
    [onClickAuth, movieData?.movieId, isWatched],
  )

  useEffect(() => {
      const fetchMovieDetail = async () => {
        try {
          console.log("영화 상세 정보 불러오기 시작, 영화 ID : ", tmdbId, typeof tmdbId)
          const response = await getMovieDetail(tmdbId)
          const data = response.data
          console.log("영화 정보 조회됨 : ", data)
          const mappedData: MovieData = mapToMovieData(data)
          console.log("영화 정보 매핑됨 : ", mappedData)
          setMovieData(mappedData)
          setIsLiked(mappedData.myLike)
          setIsWatched(mappedData.myWatched)
          setIsBookmarked(mappedData.myBookmark)
        } catch (error) {
          console.error('영화 상세 정보 불러오기 실패:', error)
        } finally {
          console.log("영화 상세 정보 불러오기 및 매핑 완료")
        }
      }
      const fetchMovieReview = async () => {
        try {
          console.log("영화 리뷰 불러오기 시작, 영화 ID : ", tmdbId, typeof tmdbId)
          const response = await getMovieReview(tmdbId, 0)
          const data = response.data
          console.log("영화 리뷰 조회됨 : ", data)
          console.log("영화 리뷰 매핑시 사용된 유저 정보 : ", user, isAuthenticated, user?.id)
          const mappedData: ReviewData = mapToReviewData(data, user?.id, user?.nickname)
          console.log("영화 리뷰 매핑됨 : ", mappedData)
          // setMyReview(mappedData)
          setReviewData(mappedData)
        } catch (error) {
          console.error('영화 리뷰 불러오기 실패:', error)
        } finally {
          console.log("영화 리뷰 불러오기 및 매핑 완료")
        }
      }
      // const fetchMyReview = async () => {
      //   if (user) {
      //     try {
      //       console.log("내 리뷰 불러오기 시작", "영화 ID : ", tmdbId, "유저 정보 : ", user, isAuthenticated)
      //       const response = await getUserMovieReview(tmdbId, user)
      //     }
      //   } return;
      // }

      try {
        if (!loading && user) {
          fetchMovieDetail()
          fetchMovieReview()
        }
      } catch (error) {
        console.error('영화 상세 페이지 정보 불러오기 중 오류 발생:', error)
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }

    }
    ,
    [tmdbId, user, loading]
  )


  if (isLoading || !movieData) {
    return (
      <MovieDetailLayout>
        <p style={{color: 'white'}}>로딩 중입니다...</p>
        {/* 페이지 구성 자체에 최소 크기가 정해진 영역이 많음 */}
        {/* 하위 컴포넌트에 예외 처리 추가 필요 */}
        {/* isLoading, 정의되지 않음, 전달 받은 데이터가 특정 조건에 해당 */}
      </MovieDetailLayout>
    )
  }

  return (
    <MovieDetailLayout>
      <MovieDetailHeader movieData={movieData}/>
      <MovieDetailMainAction>
        <ActionButton size='small' icon={isBookmarked ? <StarOff/> : <Star/>}
                      onClick={handleBookmark}>{isBookmarked ? '찜 취소' : '찜하기'}</ActionButton>
        <ActionButton size='small' icon={isWatched ? <EyeOff/> : <Eye/>}
                      onClick={handleView}>{isWatched ? '봤어요 취소' : '봤어요'}</ActionButton>
        <ActionButton size='small' icon={<ListPlus/>}>플레이리스트 추가</ActionButton>
        <ActionButton size='small' icon={<Flag/>}>수정 요청</ActionButton>
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
                  {/*<p>러닝타임: {movieData.overviewData.runtime}분</p>*/}
                </OverViewContainer>
                <OverViewContainer>
                  <p>개봉일: {movieData.productionYear ?? '미정'}</p>
                  <p>제작국가: {movieData.productionCountry ?? '정보 없음'}</p>
                  {/*<p>제작국가: {movieData.overviewData.productionCountry}</p>*/}
                </OverViewContainer>
                <OverViewContainer>
                  <p>연령등급: {movieData.ageRating ?? '정보 없음'}</p>
                  <p>
                    평균 평점: {movieData.voteAverage === 0
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
                    onClick={() => setActivePlatformTab('구매')}>
                    구매</PlatformTabButton>
                  <PlatformTabButton
                    $active={activePlatformTab === '정액제'}
                    onClick={() => setActivePlatformTab('정액제')}>
                    구독</PlatformTabButton>
                  <PlatformTabButton
                    $active={activePlatformTab === '대여'}
                    onClick={() => setActivePlatformTab('대여')}>
                    대여</PlatformTabButton>
                </OverViewPlatformTab>
                <OverViewPlatformImageWrapper>
                  {movieData.providers
                    .filter(provider => provider.type === activePlatformTab)
                    .map(provider => (
                      <PlatFormImage key={provider.name}>
                        <img src={provider.logoUrl} alt={provider.name} style={{width: '100px', height: '100px'}}/>
                      </PlatFormImage>
                    ))}
                </OverViewPlatformImageWrapper>
              </OverViewPlatformWrapper>
            </OverViewContents>
          )}
          {activeTab === 'review' && (
            <ReviewDebateContents>
              <RatingWrapper>
                <RatingCard title="전체 평점" rating={movieData.voteAverage} size={40}/>
                <RatingCard title="평가하기" rating={movieData.myRating} size={40}/>
              </RatingWrapper>
              <DetailMyReviewWrapper>
                <DetailMyReviewCard>
                  {/*<ReviewCard*/}
                  {/*  content={movieData.}*/}
                  {/*  createdAt={'2023-10-01'}*/}
                  {/*  username={'사용자'}*/}
                  {/*  type={'review'}*/}
                  {/*  isMyPost={true}*/}
                  {/*  />*/}
                  {myReview ? (
                    <p>내가 작성한 리뷰 있음</p>
                    // <ReviewCard
                    //   content={myReview.content}
                    //   createdAt={myReview.createdAt}
                    //   username={myReview.member.nickname}
                    //   type={'review'}
                    //   isMyPost={true}
                    //   likes={myReview.likes}
                    //   // hates={myReview.hates}
                    //   rating={myReview.rating}
                    // />
                  ) : (
                    // <ReviewInput />
                    <p></p>
                  )}
                </DetailMyReviewCard>
              </DetailMyReviewWrapper>
              <ContentsListWrapper>
                <ContentsListTitleTab>
                  <ContentsTitle>리뷰</ContentsTitle>
                  <ContentsListOrderDropdown>정렬 순서</ContentsListOrderDropdown>
                </ContentsListTitleTab>
                <ReviewDebateList>
                  <DetailReviewCardWrapper>
                    {/*자기 리뷰는 래퍼에 안뜨게 해야함*/}
                    {reviewData?.reviews.map(review =>
                      <ReviewDebateCard
                        key={review.reviewId}
                        content={review.content}
                        createdAt={review.createdAt}
                        username={review.member.nickname}
                        type={'review'}
                        isMyPost={review.isMyPost}
                        likes={review.likes}
                        // hates={review.hates}
                        rating={review.rating}
                      />
                    )
                    }
                    {/*<ReviewDebateCard />*/}
                  </DetailReviewCardWrapper>
                </ReviewDebateList>
              </ContentsListWrapper>
            </ReviewDebateContents>
          )}
          {activeTab === 'debate' && (
            <ReviewDebateContents>
              <ContentsHeader>
                <ContentsTitle>토론장</ContentsTitle>
              </ContentsHeader>
              <ReviewDebateList>
                <DetailReviewCardWrapper>
                  <ReviewDebateCard
                    content={'토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용토론 내용'}
                    createdAt={'1 시간 전'}
                    likes={100}
                    username={'사용자'}
                    comments={10}
                    images={['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600']}
                    type={'debate'}
                    isMyPost={true}
                  />
                </DetailReviewCardWrapper>
              </ReviewDebateList>
            </ReviewDebateContents>
          )}
          {activeTab === 'media' && (
            <DetailImageContents>
              <DetailImage>영화 이미지 Grid</DetailImage>
            </DetailImageContents>
          )}
        </MovieDetailMainContent>
      </MovieDetailMain>
    </MovieDetailLayout>
  )
}
