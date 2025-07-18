// MovieDetailPage.tsx
import styled from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import ReviewDebateCard from '@/components/feature/movieDetail/ReviewDebateCard'

import { useEffect, useState } from 'react'
import { mockMovieDetailData } from './movieDetail.mock'
import { MovieDetailData } from './movieDetail'

const MovieDetailLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const MovieDetailHeader = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  min-height: 400px;
  padding: 20px 15px 5px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`
const MovieDetailMain = styled.div`
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const MovieDetailHeaderTitle = styled.div`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 10px;
`

const MovieDetailHeaderImageSwiper = styled.div`
  display: flex;
  padding: 10px;
`

const PostImage = styled.div<{ imageUrl: string }>`
  min-width: 320px;
  min-height: 480px;
  max-height: 300px;
  max-width: 450px;
  background-image: url(${({ imageUrl }) => imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
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
const MovieDetailHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  max-width: 600px;
`
const MovieDetailHeaderRating = styled(HeaderContentsContainer)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  font-size: 20px;
  min-height: 50px;
  width: 200px;
`
const MovieDetailRelease = styled(HeaderContentsContainer)`
  width:  200px;
  font-size: 15px;
  justify-content: space-around;
`

const MovieDetailLikeHate = styled(HeaderContentsContainer)`
  max-width: 200px;
  width: 200px;
  height: 40px;
  justify-content: space-around;
  align-items: center;
`
const MovieDetailHeaderPlot = styled(HeaderContentsContainer)`
  font-size: 12px;
  max-width: 480px;
  min-height: 80px;
`

const MovieDetailHeaderActorsSwiper = styled.div`
  margin-bottom: 20px;
  max-width: 490px;
  overflow: scroll;
  height: 200px;
  display: flex;
  justify-content: start;
`
const DetailImage = styled.div`
  margin-bottom: 20px;
  height: 150px;
  display: flex;
  justify-content: start;
`

const ActorsImageCard = styled(BaseContainer)`
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
`
const ActorImage = styled.div<{ imageUrl: string }>`
  background-image: url(${({ imageUrl }) => imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  width: 110px;
  height: 165px;
  margin: 10px 10px 0 10px;
`
const ActorName = styled.div`
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  text-wrap: wrap;
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
  margin: 0 auto;
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

const OverViewContainerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  max-width: 850px;
  min-width: 800px;
  margin: 30px auto;
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
  margin: 0 20px;
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
const TotalRatingContainer = styled(BaseContainer)`
  min-width: 380px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
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

const TabButton = styled.button<{ active: boolean }>`
  all: unset;
  cursor: pointer;
  width: 100px;
  text-align: center;
  font-size: 20px;
  color: ${({ active }) => (active ? '#FE6A3C' : '#fff')};
  border-bottom: ${({ active }) => (active ? '3px solid #FE6A3C' : 'none')};
`

const PlatformTabButton = styled.button<{ active?: boolean }>`
  all: unset;
  cursor: pointer;
  width: 100px;
  text-align: center;
  font-size: 20px;
  color: ${({ active }) => (active ? '#FE6A3C' : '#fff')};
  border-bottom: ${({ active }) => (active ? '1px solid #FE6A3C' : 'none')};
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
  const [movieData, setMovieData] = useState<MovieDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'review' | 'debate' | 'media'>('overview')

  useEffect(() => {
    // 실제 API 대체용
    const timer = setTimeout(() => {
      setMovieData(mockMovieDetailData)
      setIsLoading(false)
    }, 500) // 0.5초 후 mock 주입

    return () => clearTimeout(timer)
  }, [])

  if (isLoading || !movieData) {
    return (
      <MovieDetailLayout>
        <p style={{ color: 'white' }}>로딩 중입니다...</p>
        {/* 페이지 구성 자체에 최소 크기가 정해진 영역이 많음 */}
        {/* 하위 컴포넌트에 예외 처리 추가 필요 */}
        {/* isLoading, 정의되지 않음, 전달 받은 데이터가 특정 조건에 해당 */}
      </MovieDetailLayout>
    )
  }

  return (
    <MovieDetailLayout>
      <MovieDetailHeader>
        <MovieDetailHeaderImageSwiper>
          <PostImage imageUrl={movieData.posterImg} />
        </MovieDetailHeaderImageSwiper>
        <MovieDetailHeaderContainer>
          <MovieDetailHeaderTitle>
            <p>{movieData.title}</p>
          </MovieDetailHeaderTitle>
          <MovieDetailRelease>
            <p style={{fontWeight: "bold"}}>개봉일</p> <p> {movieData.releaseDate}</p>
          </MovieDetailRelease>
          <MovieDetailHeaderRating>
            <p>🌽</p> <p> {movieData.popcorn} 점</p>
            <p>/</p>
            <p>⭐</p> <p> {movieData.voteAverage.toFixed(1)} 점</p>
          </MovieDetailHeaderRating>
          <MovieDetailLikeHate>
            <p>👍</p>
            <p>{movieData.likes}</p>
            <p>/</p>
            <p>👎</p>
            <p>{movieData.dislikes}</p>
          </MovieDetailLikeHate>
          <MovieDetailHeaderPlot>
            <p>{movieData.overview}</p>
          </MovieDetailHeaderPlot>
          <MovieDetailHeaderActorsSwiper>
            {movieData.actors.map(actor => (
              <ActorsImageCard key={actor.name}>
                <ActorImage imageUrl={actor.imageUrl} title={actor.name} />
                <ActorName>{actor.name}</ActorName>
              </ActorsImageCard>
            ))}
          </MovieDetailHeaderActorsSwiper>
        </MovieDetailHeaderContainer>
      </MovieDetailHeader>
      <MovieDetailMainAction>
        <ActionButton>찜하기</ActionButton>
        <ActionButton>봤어요</ActionButton>
        <ActionButton>플레이리스트 추가</ActionButton>
        <ActionButton>수정 요청</ActionButton>
      </MovieDetailMainAction>
      <MovieDetailMain>
        <MovieDetailMainContentTab>
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            개요
          </TabButton>
          <TabButton active={activeTab === 'review'} onClick={() => setActiveTab('review')}>
            리뷰
          </TabButton>
          <TabButton active={activeTab === 'debate'} onClick={() => setActiveTab('debate')}>
            토론장
          </TabButton>
          <TabButton active={activeTab === 'media'} onClick={() => setActiveTab('media')}>
            사진
          </TabButton>
        </MovieDetailMainContentTab>
        <MovieDetailMainContent>
          {activeTab === 'overview' && (
            <OverViewContents>
              <OverViewContainerWrapper>
                <OverViewContainer>
                  <p>장르: {movieData.genres.map(genre => genre.name).join(', ')}</p>
                  <p>러닝타임: {movieData.runtime}분</p>
                </OverViewContainer>
                <OverViewContainer>
                  <p>제작년도: {movieData.productionYear}</p>
                  <p>제작국가: {movieData.productionCountry}</p>
                </OverViewContainer>
                <OverViewContainer>
                  <p>연령등급: {movieData.ageRating}</p>
                  <p>평균 평점: {movieData.voteAverage.toFixed(1)}점</p>
                </OverViewContainer>
              </OverViewContainerWrapper>
              <OverViewPlatformWrapper>
                <OverViewPlatformTab>
                  <PlatformTabButton active>구매</PlatformTabButton>
                  <PlatformTabButton>정액제</PlatformTabButton>
                  <PlatformTabButton>대여</PlatformTabButton>
                </OverViewPlatformTab>
                <OverViewPlatformImageWrapper>
                  <PlatFormImage />
                </OverViewPlatformImageWrapper>
              </OverViewPlatformWrapper>
            </OverViewContents>
          )}
          {activeTab === 'review' && (
            <ReviewDebateContents>
              <ContentsHeader>
                <ContentsTitle></ContentsTitle>
              </ContentsHeader>
              <RatingWrapper>
                <TotalRatingContainer>전체 평점</TotalRatingContainer>
                <TotalRatingContainer>평가하기</TotalRatingContainer>
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
                      content={'리뷰 내용 리뷰 내용 리뷰 내용 '}
                      createdAt={'1 시간 전'}
                      likes={100}
                      username={'사용자'}
                      comments={10}
                    />
                  </DetailReviewCardWrapper>
                  <DetailReviewCardWrapper>
                    <ReviewDebateCard
                      rating={4.0}
                      content={'리뷰 내용 리뷰 내용 리뷰 내용 '}
                      createdAt={'1 시간 전'}
                      likes={100}
                      username={'사용자'}
                      comments={10}
                    />
                  </DetailReviewCardWrapper>
                  <DetailReviewCardWrapper>
                    <ReviewDebateCard
                      rating={4.0}
                      content={'리뷰 내용 리뷰 내용 리뷰 내용 '}
                      createdAt={'1 시간 전'}
                      likes={100}
                      username={'사용자'}
                      comments={10}
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
                    rating={4.0}
                    content={'리뷰 내용 리뷰 내용 리뷰 내용 '}
                    createdAt={'1 시간 전'}
                    likes={100}
                    username={'사용자'}
                    comments={10}
                  />
                </DetailReviewCardWrapper>
                <DetailReviewCardWrapper>
                  <ReviewDebateCard
                    rating={4.0}
                    content={'리뷰 내용 리뷰 내용 리뷰 내용 '}
                    createdAt={'1 시간 전'}
                    likes={100}
                    username={'사용자'}
                    comments={10}
                  />
                </DetailReviewCardWrapper>
                <DetailReviewCardWrapper>
                  <ReviewDebateCard
                    rating={4.0}
                    content={'리뷰 내용 리뷰 내용 리뷰 내용 '}
                    createdAt={'1 시간 전'}
                    likes={100}
                    username={'사용자'}
                    comments={10}
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
