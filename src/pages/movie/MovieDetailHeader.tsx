import styled from 'styled-components'
// 필요한 styled-components와 타입, 예: MovieData
import {MovieData} from '@/pages/movie/movieData'
import BaseContainer from "@/components/common/BaseContainer";
import BaseButton from "@/components/common/BaseButton";
import {ThumbsDown, ThumbsUp} from "lucide-react";
import popcornImg from '@/assets/popcorn/popcorn7.png'
import {useCallback, useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useOnClickAuth} from "@/hooks/useOnClickAuth";
import {hateMovie, likeMovie} from "@/services/movieDetail";

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
    font-size: 15px;
    min-height: 30px;
    width: 200px;
`

const MovieDetailRelease = styled(HeaderContentsContainer)`
    width: 200px;
    font-size: 15px;
    justify-content: space-around;
`

const MovieDetailLikeHate = styled(HeaderContentsContainer)`
    width: 500px;
    height: 40px;
    justify-content: space-evenly;
    align-items: center;
    display: flex;
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

const LikeButton = styled(BaseButton)`
    max-height: 40px;
    width: 150px;
    display: flex;
    justify-content: space-evenly;
`
const HateButton = styled(BaseButton)`
    max-height: 40px;
    width: 150px;
    display: flex;
    justify-content: space-evenly;
`
const FFPopcorn = styled.div`
    background-image: url(${popcornImg});
    background-size: cover;
    width: 20px;
    height: 20px;
`

type Props = {
  movieData: MovieData
}


const MovieDetailHeader = ({movieData}: Props) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isHated, setIsHated] = useState(false)
  const [likeCnt, setLikeCnt] = useState(0)
  const [hateCnt, setHateCnt] = useState(0)

  const onclickAuth = useOnClickAuth()


  useEffect(() => {
    const setMyLikeHate = () => {
      setIsLiked(movieData.myLike)
      setIsHated(movieData.myHate)
      setLikeCnt(movieData.likeCnt)
      setHateCnt(movieData.hateCnt)
    }
    setMyLikeHate()
  }, [movieData])

  const handleLikeClick = useCallback(
    () => onclickAuth(async () => {
      const movieId = movieData?.movieId
      if (!movieId) return
      console.log('Like 눌림', isLiked)
      setIsLiked(!isLiked)
      if (!isLiked) {
        setLikeCnt(prev => prev + 1)
      } else {
        setLikeCnt(prev => prev - 1)
      }
      if (isHated) {
        setIsHated(false)
        setHateCnt(prev => prev - 1)
      }
      try {
        await likeMovie(movieId)
        toast.success(!isLiked ? '좋아요 완료' : '좋아요 취소')
      } catch {
        toast.error('처리에 실패했어요.')
        setIsLiked(prev => !prev)
      }
    })(), [isLiked, isHated, movieData?.movieId, onclickAuth],
  )
  const handleHateClick = useCallback(
    () => onclickAuth(async () => {
      const movieId = movieData?.movieId
      if (!movieId) return
      console.log('Hate 눌림', isLiked)
      setIsHated(!isHated)
      if (!isHated) {
        setHateCnt(prev => prev + 1)
      } else {
        setHateCnt(prev => prev - 1)
      }
      if (isLiked) {
        setIsLiked(false)
        setLikeCnt(prev => prev - 1)
      }
      try {
        await hateMovie(movieId)
        toast.success(!isLiked ? '좋아요 완료' : '좋아요 취소')
      } catch {
        toast.error('처리에 실패했어요.')
        setIsLiked(prev => !prev)
      }
    })(), [isLiked, isHated, movieData?.movieId, onclickAuth],
  )

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
          <p> {movieData.releaseDate ?? '미정'}</p>
        </MovieDetailRelease>
        <MovieDetailHeaderRating>
          <FFPopcorn/> <p>{movieData.popcorn === 0 ? '집계중' : `${movieData.popcorn} 점`}</p>
          <p>/</p>
          <p>⭐</p> <p>{movieData.voteAverage === 0 ? '집계중' : `${movieData.voteAverage.toFixed(1)} 점`}</p>
        </MovieDetailHeaderRating>
        {movieData.myLike}
        <MovieDetailLikeHate>
          <LikeButton icon={<ThumbsUp/>} size='small' variant={isLiked ? 'pink' : 'dark'}
                      onClick={handleLikeClick}>{likeCnt}</LikeButton>
          <HateButton icon={<ThumbsDown/>} size='small' variant={isHated ? 'blue' : 'dark'}
                      onClick={handleHateClick}>{hateCnt}</HateButton>
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
