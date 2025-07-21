import styled from 'styled-components'
// 필요한 styled-components와 타입, 예: MovieData
import { MovieData } from '@/pages/movie/movieData'
import BaseContainer from "@/components/common/BaseContainer";


const MovieDetailHeaderImageSwiper = styled.div`
    display: flex;
    padding: 10px;
`

const PostImage = styled.div<{ $imageUrl: string }>`
    min-width: 320px;
    min-height: 480px;
    max-height: 300px;
    max-width: 450px;
    background-image: url(${prop => prop.$imageUrl});
    background-size: cover;
    background-position: center;
    border-radius: 8px;
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
    width: 200px;
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

const ActorsImageCard = styled(BaseContainer)`
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 10px;
`


const ActorImage = styled.div<{ $imageUrl: string }>`
    background-image: url(${({$imageUrl}) => $imageUrl});
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

const MovieDetailHeaderTitle = styled.div`
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 10px;
`

const HeaderWrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    min-height: 400px;
    padding: 20px 15px 5px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
`

type Props = {
  movieData: MovieData
}


const MovieDetailHeader = ({ movieData }: Props) => {
  return (
    <HeaderWrapper>
      <MovieDetailHeaderImageSwiper>
        <PostImage $imageUrl={movieData.posterImg || 'https://placehold.co'}/>
      </MovieDetailHeaderImageSwiper>
      <MovieDetailHeaderContainer>
        <MovieDetailHeaderTitle>
          <p>{movieData.title ?? '제목 정보 없음'}</p>
        </MovieDetailHeaderTitle>
        <MovieDetailRelease>
          <p style={{fontWeight: "bold"}}>개봉일</p> <p> {movieData.releaseDate ?? '미정'}</p>
        </MovieDetailRelease>
        <MovieDetailHeaderRating>
          <p>🌽</p> <p>{movieData.popcorn === 0 ? '집계중' : `${movieData.popcorn} 점`}</p>
          <p>/</p>
          <p>⭐</p> <p>{movieData.voteAverage === 0 ? '집계중' : `${movieData.voteAverage.toFixed(1)} 점`}</p>
        </MovieDetailHeaderRating>
        <MovieDetailLikeHate>
          <p>👍</p>
          <p>{movieData.likeCnt}</p>
          <p>/</p>
          <p>👎</p>
          <p>{movieData.hateCnt}</p>
        </MovieDetailLikeHate>
        <MovieDetailHeaderPlot>
          <p>{movieData.overview}</p>
        </MovieDetailHeaderPlot>
        <MovieDetailHeaderActorsSwiper>
          {movieData.casts.map(actor => (
            <ActorsImageCard key={actor.id}>
              <ActorImage $imageUrl={actor.profileImg || 'https://placehold.co'}/>
              <ActorName>{actor.name}</ActorName>
            </ActorsImageCard>
          ))}
        </MovieDetailHeaderActorsSwiper>
      </MovieDetailHeaderContainer>
    </HeaderWrapper>
  )
}

export default MovieDetailHeader
