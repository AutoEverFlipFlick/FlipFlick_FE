// MovieDetailPage.tsx
import styled from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import ReviewDebateCard from '@/components/feature/movieDetail/ReviewDebateCard'

import {useEffect, useState} from 'react'
import {MovieData} from './movieData'
import RatingCard from '@/components/starRating/RatingCard'
import axios from "axios";
import {mapToMovieData} from "@/pages/movie/movieDataMapper";
import MovieDetailHeader from "@/pages/movie/MovieDetailHeader";
import {useAuth} from "@/context/AuthContext";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import BasePageLayout from "@/components/common/layout/BasePageLayout";

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
    max-width: 600px;
    margin: 20px auto;
    height: 100%;
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

const ActionButton = styled.button`
    all: unset;
    cursor: pointer;
    background-color: #fe6a3c;
    color: white;
    padding: 5px 10px;
    margin-right: 10px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #ff854e;
    }
`

export default function MovieDetailPage() {
  const [movieData, setMovieData] = useState<MovieData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'review' | 'debate' | 'media'>('overview')
  const { isAuthenticated } = useAuth()
  const { movieId } = useParams<{ movieId: string }>()

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        console.log("영화 상세 정보 불러오기 시작, 영화 ID : ", movieId)
        const response = await axios.post('http://localhost:8080/api/v1/movie/view', {
          tmdbId: movieId,
        })
        const data = response.data.data
        const mappedData: MovieData = mapToMovieData(data)
        setMovieData(mappedData)
      } catch (error) {
        console.error('영화 상세 정보 불러오기 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovieDetail()
  }, [])


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
    <BasePageLayout>
    <MovieDetailLayout>
      <MovieDetailHeader movieData={movieData}/>
      <MovieDetailMainAction>
        <ActionButton>찜하기</ActionButton>
        <ActionButton>봤어요</ActionButton>
        <ActionButton>플레이리스트 추가</ActionButton>
        <ActionButton>수정 요청</ActionButton>
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
                  <PlatformTabButton $active>구매</PlatformTabButton>
                  <PlatformTabButton>정액제</PlatformTabButton>
                  <PlatformTabButton>대여</PlatformTabButton>
                </OverViewPlatformTab>
                <OverViewPlatformImageWrapper>
                  <PlatFormImage/>
                </OverViewPlatformImageWrapper>
              </OverViewPlatformWrapper>
            </OverViewContents>
          )}
          {activeTab === 'review' && (
            <ReviewDebateContents>
              <RatingWrapper>
                <RatingCard title="전체 평점" rating={movieData.voteAverage} size={40}/>
                <RatingCard title="평가하기" rating={0} size={40}/>
              </RatingWrapper>
              <DetailMyReviewWrapper>
                <DetailMyReviewCard>내 리뷰</DetailMyReviewCard>
              </DetailMyReviewWrapper>
              <ContentsListWrapper>
                <ContentsListTitleTab>
                  <ContentsTitle>리뷰</ContentsTitle>
                  <ContentsListOrderDropdown>정렬 순서</ContentsListOrderDropdown>
                </ContentsListTitleTab>
                <ReviewDebateList>
                  <DetailReviewCardWrapper>
                    <ReviewDebateCard
                      rating={4.0}
                      content={'리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용리뷰 내용'}
                      createdAt={'1 시간 전'}
                      likes={100}
                      username={'사용자'}
                      type={'review'}
                    />
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
    </BasePageLayout>
  )
}
