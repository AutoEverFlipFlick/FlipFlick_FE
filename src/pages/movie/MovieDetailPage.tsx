// MovieDetailPage.tsx
import React from "react";
import styled from "styled-components";
import BaseContainer from "@/components/common/BaseContainer";
import ReviewDebateCard from "@/components/feature/movieDetail/ReviewDebateCard";


const MovieDetailLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const MovieDetailHeader = styled.div`
    max-width: 900px;
    margin: 0 auto;
    min-height: 400px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px
`;
const MovieDetailMain = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const MovieDetailHeaderTitle = styled.div`
    font-size: 40px;
    margin-bottom: 20px;
`

const MovieDetailHeaderImageSwiper = styled.div`
    display: flex;
    padding: 10px;
`

const PostImage = styled.div`
    min-width: 240px;
    min-height: 360px;
    background-image: url(postImage);
    background-size: cover;
`

const PlatFormImage = styled.div`
    min-width: 120px;
    min-height: 120px;
    background-color: white;
`
const MovieDetailHeaderContents = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 720px;

`
const MovieDetailHeaderRating = styled.div`
    font-size: 20px;
`
const MovieDetailRelease = styled.div`
    font-size: 20px;
    margin-bottom: 20px;
`;

const MovieDetailLikeHate = styled.div`
    max-width: 400px;
    width: 400px;
    height: 40px;
    margin-bottom: 20px;
`
const MovieDetailHeaderPlot = styled.div`
    margin-bottom: 20px;
`

const MovieDetailHeaderActorsSwiper = styled.div`
    margin-bottom: 20px;
    height: 150px;
    display: flex;
    justify-content: start;
`
const DetailImage = styled.div`
    margin-bottom: 20px;
    height: 150px;
    display: flex;
    justify-content: start;
`


const ActorsImageCard = styled.div`
    width: 110px;
    height: 165px;
    background-color: white;
    margin-right: 10px;
`
const MovieDetailMainAction = styled.div`
    max-width: 600px;
    margin: 0 auto;
    height: 60px;
    background-color: #fff;
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
    margin: 10px auto;
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
    //min-width: 300px;
    margin: 0 auto;
    gap: 20px;


    //display: flex;
    //justify-content: space-evenly;
    //flex-direction: row;
    //max-width: 900px;
    //min-width: 850px;
    //margin: 30px auto;
    //height: 30px;
    //gap: 50px;
    //border-bottom: white 1px solid;
`

const OverViewContainer = styled.div`
    display: flex;
    color: #130803;
    max-width: 800px;
    min-width: 220px;
    word-wrap: break-word;
    min-height: 100px;
    background-color: #f0f0f0;
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


export default function MovieDetailPage() {
  return (
    <MovieDetailLayout>
      <MovieDetailHeader>
        <MovieDetailHeaderImageSwiper>
          <PostImage/>
          {/* 여기에 이미지 슬라이더 컴포넌트를 추가*/}
        </MovieDetailHeaderImageSwiper>
        <MovieDetailHeaderContents>
          <MovieDetailHeaderTitle>
            <p>영화 제목 영역</p>
          </MovieDetailHeaderTitle>
          <MovieDetailRelease>
            <p>출시일 영역</p>
          </MovieDetailRelease>
          <MovieDetailHeaderRating>
            <p>평점 영역 - 평점 영역</p>
          </MovieDetailHeaderRating>
          <MovieDetailLikeHate>
            <p>좋아요 / 싫어요 영역</p>
          </MovieDetailLikeHate>
          <MovieDetailHeaderPlot>
            <p>영화 줄거리 영역</p>
          </MovieDetailHeaderPlot>
          <MovieDetailHeaderActorsSwiper>
            <ActorsImageCard>
              <p style={{color: 'black'}}>배우 이미지 카드 영역</p>
            </ActorsImageCard>
            <ActorsImageCard>
              <p style={{color: 'black'}}>배우 이미지 카드 영역</p>
            </ActorsImageCard>
            <ActorsImageCard>
              <p style={{color: 'black'}}>배우 이미지 카드 영역</p>
            </ActorsImageCard>
            <ActorsImageCard>
              <p style={{color: 'black'}}>배우 이미지 카드 영역</p>
            </ActorsImageCard>
          </MovieDetailHeaderActorsSwiper>

        </MovieDetailHeaderContents>
      </MovieDetailHeader>
      <MovieDetailMainAction>
        <button>찜하기</button>
        <button>봤어요</button>
        <button>플레이리스트 추가</button>
        <button>수정 요청</button>
      </MovieDetailMainAction>
      <MovieDetailMain>
        <MovieDetailMainContentTab>
          <button style={{
            all: 'unset', cursor: 'pointer',
            borderBottom: '1px solid #FE6A3C',
            color: '#FE6A3C',
            width: '100px', textAlign: 'center',
            fontSize: '20px'
          }}>개요
          </button>
          <button style={{
            all: 'unset', cursor: 'pointer',
            // borderBottom: '1px solid',
            // color:'#FE6A3C',
            width: '100px', textAlign: 'center',
            fontSize: '20px'
          }}>리뷰
          </button>
          <button style={{
            all: 'unset', cursor: 'pointer',
            // borderBottom: '1px solid',
            // color:'#FE6A3C',
            width: '100px', textAlign: 'center',
            fontSize: '20px'
          }}>토론장
          </button>
          <button style={{
            all: 'unset', cursor: 'pointer',
            // borderBottom: '1px solid',
            // color:'#FE6A3C',
            width: '100px', textAlign: 'center',
            fontSize: '20px'
          }}>사진
          </button>
        </MovieDetailMainContentTab>
        <MovieDetailMainContent>
          <OverViewContents>
            <OverViewContainerWrapper>
              <OverViewContainer>개요 내용 1</OverViewContainer>
              <OverViewContainer>개요 내용 2</OverViewContainer>
              <OverViewContainer>개요 내용 3</OverViewContainer>
            </OverViewContainerWrapper>
            <OverViewPlatformWrapper>
              <OverViewPlatformTab>
                <button style={{
                  all: 'unset', cursor: 'pointer',
                  borderBottom: '1px solid #FE6A3C',
                  color: '#FE6A3C',
                  width: '100px', textAlign: 'center',
                  fontSize: '20px'
                }}>구매
                </button>
                <button style={{
                  all: 'unset', cursor: 'pointer',
                  // color:'#FE6A3C',
                  width: '100px', textAlign: 'center',
                  fontSize: '20px'
                }}>정액제
                </button>
                <button style={{
                  all: 'unset', cursor: 'pointer',
                  // color:'#FE6A3C',
                  width: '100px', textAlign: 'center',
                  fontSize: '20px'
                }}>대여
                </button>
              </OverViewPlatformTab>
              <OverViewPlatformImageWrapper>
                <PlatFormImage>
                  애플
                </PlatFormImage>
                <PlatFormImage>
                  구글
                </PlatFormImage>
                <PlatFormImage>
                  넷플릭스
                </PlatFormImage>

              </OverViewPlatformImageWrapper>
            </OverViewPlatformWrapper>
          </OverViewContents>
          <ReviewDebateContents>
            <ContentsHeader>
              <ContentsTitle></ContentsTitle>
            </ContentsHeader>
            <RatingWrapper>
              <TotalRatingContainer>전체 평점</TotalRatingContainer>
              <TotalRatingContainer>평가하기</TotalRatingContainer>
            </RatingWrapper>
            <DetailMyReviewWrapper>
              <DetailMyReviewCard>
                내 리뷰
              </DetailMyReviewCard>

            </DetailMyReviewWrapper>
            <ContentsListWrapper>
              <ContentsListTitleTab>
                <ContentsTitle>리뷰</ContentsTitle>
                <ContentsListOrderDropdown>
                  정렬 순서
                </ContentsListOrderDropdown>
              </ContentsListTitleTab>
              <ReviewDebateList>

                <DetailReviewCardWrapper>
                  <ReviewDebateCard rating={4.0} content={'리뷰 내용 리뷰 내용 리뷰 내용 '} createdAt={'1 시간 전'} likes={100}
                                    username={'사용자'} comments={10}/>
                </DetailReviewCardWrapper>
                <DetailReviewCardWrapper>
                  <ReviewDebateCard rating={4.0} content={'리뷰 내용 리뷰 내용 리뷰 내용 '} createdAt={'1 시간 전'} likes={100}
                                    username={'사용자'} comments={10}/>
                </DetailReviewCardWrapper><DetailReviewCardWrapper>
                <ReviewDebateCard rating={4.0} content={'리뷰 내용 리뷰 내용 리뷰 내용 '} createdAt={'1 시간 전'} likes={100}
                                  username={'사용자'} comments={10}/>
              </DetailReviewCardWrapper>
              </ReviewDebateList>
            </ContentsListWrapper>

          </ReviewDebateContents>

          <ReviewDebateContents>
            <ContentsHeader>
              <ContentsTitle>토론장</ContentsTitle>
            </ContentsHeader>
            <ReviewDebateList>
              <DetailReviewCardWrapper>
                <ReviewDebateCard rating={4.0} content={'리뷰 내용 리뷰 내용 리뷰 내용 '} createdAt={'1 시간 전'} likes={100}
                                  username={'사용자'} comments={10}/>
              </DetailReviewCardWrapper>
              <DetailReviewCardWrapper>
                <ReviewDebateCard rating={4.0} content={'리뷰 내용 리뷰 내용 리뷰 내용 '} createdAt={'1 시간 전'} likes={100}
                                  username={'사용자'} comments={10}/>
              </DetailReviewCardWrapper><DetailReviewCardWrapper>
              <ReviewDebateCard rating={4.0} content={'리뷰 내용 리뷰 내용 리뷰 내용 '} createdAt={'1 시간 전'} likes={100}
                                username={'사용자'} comments={10}/>
            </DetailReviewCardWrapper>
            </ReviewDebateList>
          </ReviewDebateContents>
          <DetailImageContents>
            <DetailImage>
              영화 이미지 Grid
            </DetailImage>
          </DetailImageContents>
        </MovieDetailMainContent>

      </MovieDetailMain>

    </MovieDetailLayout>
  )
}
