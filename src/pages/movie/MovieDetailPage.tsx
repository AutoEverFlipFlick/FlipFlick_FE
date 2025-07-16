// MovieDetailPage.tsx
import React from "react";
import styled from "styled-components";
import {Heart} from "lucide-react";

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
    background-color: white;
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
const DetailImageSwiper = styled.div`
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
const DetailReviewContents = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 850px;
    min-width: 850px;
    min-height: 100px;
    justify-content: start;
    align-items: center;
    margin: 0 auto;
    gap: 5px;
`

const DetailDebateContents = styled.div`
    display: flex;
    max-width: 800px;
    min-width: 800px;
    min-height: 100px;
    flex-direction: row-reverse;
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
const DetailRatingWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    max-width: 800px;
    min-width: 800px;
    margin: 0 auto;
    gap: 10px;
`
const TotalRatingContainer = styled.div`
    min-width: 380px;
    height: 150px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #130803;
`
const DetailMyReviewWrapper = styled.div`
    width: 100%;
    min-height: 150px;
    background-color: #ffffff;
    display: flex;
    margin: 5px auto;
    color: #191513;
    justify-content: center;
    align-items: center;
`
const DetailReviewListWrapper = styled.div`
    max-width: 800px;
    width: 100%;
    min-height: 100px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    margin: 10px auto;
`
const DetailReviewList = styled.div`
    width: 100%;
    min-height: 100px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    margin: 5px auto;
`
const DetailReviewCardWrapper = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100px;
    display: flex;
    margin: 5px auto;
`
const DetailReviewCard = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100px;
    background-color: var(--color-primary);
    margin: 5px auto;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
`

const ReviewCardHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 5px;
    color: white;
`

const ReviewCardBody = styled.div`
    width: 100%;
    padding: 10px;
    margin: 5px auto;
    color: white;
    word-wrap: break-word;
    min-height: 50px;
`

const ReviewUserCard = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 5px;
    color: white;
`

const UserImageSmall = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #f0f0f0;
    background-image: url('https://via.placeholder.com/30');
    background-size: cover;
    background-position: center;
`

const UserInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    color: white;
    gap: 2px;
`
const UserMovieRatingWrapper = styled.div`
    display: flex;
    flex-direction: row;
`

const ReviewUserName = styled.div`
    font-size: 12px;
`

const ReviewCreatedAt = styled.div`
    font-size: 8px;
`


const ReviewCardFooter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 5px;
    color: white;
`
const ReviewLikeWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
`

const DetailReviewListOrderTab = styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: end;
    background-color: white;
    align-content: center;

`

const ReviewListOrderDropdown = styled.div`
    width: 80px;
    height: 30px;
    display: flex;
    background-color: #191513;
    text-align: center;
    align-items: center;
    justify-content: center;
`

type StarRatingProps = {
  rating: number; // 0.0 ~ 5.0
};

const StarWrapper = styled.div`
    display: flex;
    gap: 4px;
`;

const StyledSvg = styled.svg`
    width: 24px;
    height: 24px;
    stroke: gold;
    stroke-width: 0.8;
    stroke-linejoin: round;
    stroke-linecap: round;
    shape-rendering: geometricPrecision;
`;

const FilledStar = styled(StyledSvg)`
    fill: gold;
`;

const EmptyStyledSvg = styled(StyledSvg)`
    fill: none;
`;

export const StarRating: React.FC<StarRatingProps> = ({rating}) => {
  const renderStar = (index: number) => {
    const filled = rating - index;
    const starPath = "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21" +
      "L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z";


    if (filled >= 1) {
      // full star
      return (
        <FilledStar viewBox="0 0 24 24" key={index}>
          <path d={starPath}/>
        </FilledStar>
      );
    } else if (filled >= 0.5) {
      // half star using mask
      return (
        <StyledSvg viewBox="0 0 24 24" key={index}>
          <defs>
            <mask id={`half-mask-${index}`}>
              <rect x="0" y="0" width="12" height="24" fill="white"/>
            </mask>
          </defs>

          {/* 빈 별 테두리 */}
          <path
            d={starPath}
            fill="none"
            stroke="gold"
          />

          {/* 반쪽 채워진 별 (mask 적용) */}
          <path
            d={starPath}
            fill="gold"
            stroke="gold"
            mask={`url(#half-mask-${index})`}
          />
        </StyledSvg>
      );
    } else {
      // empty star
      return (
        <EmptyStyledSvg viewBox="0 0 24 24" key={index}>
          <path d={starPath}/>
        </EmptyStyledSvg>
      );
    }
  };

  return <StarWrapper>{[0, 1, 2, 3, 4].map(renderStar)}</StarWrapper>;
};


export default function MovieDetailPage() {
  return (
    <MovieDetailLayout>
      <MovieDetailHeader>
        <MovieDetailHeaderImageSwiper>
          <PostImage/>
          {/* 여기에 이미지 슬라이더 컴포넌트를 추가할 수 있습니다. */}
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
          <DetailReviewContents>
            <DetailRatingWrapper>
              <TotalRatingContainer>전체 평점</TotalRatingContainer>
              <TotalRatingContainer>평가하기</TotalRatingContainer>
            </DetailRatingWrapper>
            <DetailMyReviewWrapper>
              내 리뷰
            </DetailMyReviewWrapper>
            <DetailReviewListWrapper>
              <DetailReviewListOrderTab>
                <ReviewListOrderDropdown>
                  정렬 순서
                </ReviewListOrderDropdown>
              </DetailReviewListOrderTab>
              <DetailReviewList>

                <DetailReviewCardWrapper>
                  <DetailReviewCard>
                    <ReviewCardHeader>
                      <ReviewUserCard>
                        <UserImageSmall/>
                        <UserInfoWrapper>
                          <ReviewUserName>사용자 이름</ReviewUserName>
                          <ReviewCreatedAt>작성일</ReviewCreatedAt>
                        </UserInfoWrapper>
                        <UserMovieRatingWrapper>
                          <StarRating rating={0.5}/>
                        </UserMovieRatingWrapper>
                      </ReviewUserCard>
                    </ReviewCardHeader>
                    <ReviewCardBody>
                      <p>리뷰 내용 영역</p>
                    </ReviewCardBody>
                    <ReviewCardFooter>
                      <ReviewLikeWrapper>
                        {/*lucid*/}
                        <Heart/>
                        <p>100</p>
                      </ReviewLikeWrapper>
                      <button>...</button>
                    </ReviewCardFooter>
                  </DetailReviewCard>
                </DetailReviewCardWrapper>
                <DetailReviewCardWrapper>
                  <DetailReviewCard>
                    <ReviewCardHeader>
                      <ReviewUserCard>
                        <UserImageSmall/>
                        <UserInfoWrapper>
                          <ReviewUserName>사용자 이름</ReviewUserName>
                          <ReviewCreatedAt>작성일</ReviewCreatedAt>
                        </UserInfoWrapper>
                        <UserMovieRatingWrapper>
                          <StarRating rating={0.5}/>
                        </UserMovieRatingWrapper>
                      </ReviewUserCard>
                    </ReviewCardHeader>
                    <ReviewCardBody>
                      <p>리뷰 내용 영역</p>
                    </ReviewCardBody>
                    <ReviewCardFooter>
                      <ReviewLikeWrapper>
                        {/*lucid*/}
                        <Heart/>
                        <p>100</p>
                      </ReviewLikeWrapper>
                      <button>...</button>
                    </ReviewCardFooter>
                  </DetailReviewCard>
                </DetailReviewCardWrapper>
                <DetailReviewCardWrapper>
                  <DetailReviewCard>
                    <ReviewCardHeader>
                      <ReviewUserCard>
                        <UserImageSmall/>
                        <UserInfoWrapper>
                          <ReviewUserName>사용자 이름</ReviewUserName>
                          <ReviewCreatedAt>작성일</ReviewCreatedAt>
                        </UserInfoWrapper>
                        <UserMovieRatingWrapper>
                          <StarRating rating={0.5}/>
                        </UserMovieRatingWrapper>
                      </ReviewUserCard>
                    </ReviewCardHeader>
                    <ReviewCardBody>
                      <p>리뷰 내용 영역</p>
                    </ReviewCardBody>
                    <ReviewCardFooter>
                      <ReviewLikeWrapper>
                        {/*lucid*/}
                        <Heart/>
                        <p>100</p>
                      </ReviewLikeWrapper>
                      <button>...</button>
                    </ReviewCardFooter>
                  </DetailReviewCard>
                </DetailReviewCardWrapper>

              </DetailReviewList>
            </DetailReviewListWrapper>

          </DetailReviewContents>
          <DetailDebateContents>
            토론장 영역
          </DetailDebateContents>
          <DetailImageContents>
            <DetailImageSwiper>
              영화 이미지 슬라이더 컴포넌트
            </DetailImageSwiper>
          </DetailImageContents>
        </MovieDetailMainContent>

      </MovieDetailMain>

    </MovieDetailLayout>
  )
}
