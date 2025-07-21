import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { getActorDetail, ActorDetail, FilmographyItem } from '../services/filmography';

// 애니메이션 키프레임 정의
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const FilmographyContainer = styled.div`
  color: white;
  padding: 1rem;
  font-family: 'Arial', sans-serif;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  animation: ${fadeIn} 0.6s ease-out;
`;

const BackButton = styled.button`
  position: relative;
  top: -40px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  color: #fff;
  animation: ${slideInLeft} 0.6s ease-out 0.1s both;

  &:hover {
    background: rgba(255, 120, 73, 0.8);
    border-color: #ff7849;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #ccc;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #ff4444;
  text-align: center;
  animation: ${slideUp} 0.8s ease-out;
`;

const ActorInfo = styled.div`
  margin-left: 2rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  min-height: 120px;
  position: relative;
  box-sizing: border-box;
  animation: ${slideUp} 0.8s ease-out 0.2s both;
`;

const ActorImageContainer = styled.div`
  margin-right: 1.5rem;
  margin-left: 1rem;
  animation: ${scaleIn} 0.8s ease-out 0.3s both;
`;

const ActorImageSkeleton = styled.div`
  border-radius: 4px;
  width: 100px;
  height: 120px;
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 50%,
    #2a2a2a 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.8rem;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const ActorImage = styled.img`
  border-radius: 4px;
  width: 100px;
  height: 120px;
  object-fit: cover;
  transition: opacity 0.3s ease;
`;

const NoImagePlaceholder = styled.div`
  border-radius: 4px;
  width: 100px;
  height: 120px;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.8rem;
  text-align: center;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActorDetails = styled.div`
  animation: ${slideUp} 0.8s ease-out 0.4s both;
  
  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
  }

  p {
    margin: 0.2rem 0;
    font-size: 0.9rem;
    color: #cccccc;
  }
`;

const TimelineWrapper = styled.div<{ $needsScroll: boolean }>`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  padding: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$needsScroll ? 'flex-start' : 'center'};
  min-height: 0;
  box-sizing: border-box;
  cursor: ${props => props.$needsScroll ? 'grab' : 'default'};
  animation: ${fadeIn} 1s ease-out 0.5s both;

  &::-webkit-scrollbar {
    display: none;
  }

  &:active {
    cursor: ${props => props.$needsScroll ? 'grabbing' : 'default'};
  }
`;

const Timeline = styled.div<{ $needsScroll: boolean }>`
  position: relative;
  min-width: max-content;
  display: flex;
  justify-content: ${props => props.$needsScroll ? 'flex-start' : 'center'};
  padding: 6rem 0;
  height: 100%;
  min-height: 300px;
  margin-left: ${props => props.$needsScroll ? '2rem' : '0'};
  width: ${props => props.$needsScroll ? 'fit-content' : '100%'};

  @media (max-height: 800px) {
    padding: 4rem 0;
    min-height: 250px;
  }
`;

const TimelineLine = styled.div<{ $needsScroll: boolean }>`
  position: absolute;
  top: 50%;
  left: ${props => props.$needsScroll ? '0' : '10%'};
  right: ${props => props.$needsScroll ? '0' : '10%'};
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 120, 73, 0.1) 0%,
    rgba(255, 120, 73, 0.6) 10%,
    rgba(255, 120, 73, 1) 50%,
    rgba(255, 120, 73, 0.6) 90%,
    rgba(255, 120, 73, 0.1) 100%
  );
  border-radius: 1px;
  z-index: 1;
  animation: ${slideUp} 0.8s ease-out 0.6s both;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 120, 73, 0.1) 20%,
      rgba(255, 120, 73, 0.3) 50%,
      rgba(255, 120, 73, 0.1) 80%,
      transparent 100%
    );
    filter: blur(2px);
    border-radius: 2px;
  }
`;

const TimelineItem = styled.div<{ $isOdd: boolean; $needsScroll: boolean; $index: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${props => props.$needsScroll ? '0 2rem' : '0 3rem'};
  min-width: 90px;
  animation: ${slideUp} 0.6s ease-out ${props => 0.7 + (props.$index * 0.1)}s both;

  @media (max-height: 800px) {
    margin: ${props => props.$needsScroll ? '0 1.5rem' : '0 2.5rem'};
  }
`;

const TimelinePoint = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff7849;
  position: absolute;
  top: calc(50% - 5px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 
    0 0 6px #ff7849,
    0 0 12px rgba(255, 120, 73, 0.5),
    inset 0 0 4px rgba(255, 255, 255, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 1px solid rgba(255, 120, 73, 0.3);
    border-radius: 50%;
    animation: ripple 2s infinite;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

const TimelineVerticalLine = styled.div<{ $isOdd: boolean }>`
  width: ${props => props.$isOdd ? '1.9px' : '2.2px'};
  height: 25px;
  background: linear-gradient(
    ${props => props.$isOdd ? '180deg' : '0deg'},
    rgba(255, 120, 73, 0.3) 0%,
    rgba(255, 120, 73, 1) 50%,
    rgba(255, 120, 73, 0.3) 100%
  );
  position: absolute;
  top: 50%;
  left: ${props => props.$isOdd ? '50.2%' : '50%'};
  margin-left: -1px;
  margin-top: ${props => props.$isOdd ? '-25px' : '0'};
  z-index: 2;
  border-radius: 1px;
  box-shadow: 0 0 3px rgba(255, 120, 73, 0.4);
`;
const FilmCard = styled.div<{ $isOdd: boolean; $needsScroll: boolean }>`
  position: absolute;
  ${props => props.$isOdd ? 'bottom: calc(50% + 35px);' : 'top: calc(50% + 35px);'}
  width: ${props => props.$needsScroll ? '140px' : '160px'};
  max-width: ${props => props.$needsScroll ? '140px' : '160px'};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: ${props => props.$isOdd ? 'column' : 'column-reverse'};
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(-50%) scale(1.05);
  }

  @media (max-height: 800px) {
    width: ${props => props.$needsScroll ? '120px' : '140px'};
    max-width: ${props => props.$needsScroll ? '120px' : '140px'};
    ${props => props.$isOdd ? 'bottom: calc(50% + 25px);' : 'top: calc(50% + 25px);'}
  }
`;

const PosterContainer = styled.div<{ $isOdd: boolean }>`
  margin-bottom: ${props => props.$isOdd ? '0.5rem' : '0'};
  margin-top: ${props => props.$isOdd ? '0' : '0.5rem'};
`;

const PosterSkeleton = styled.div<{ $needsScroll: boolean }>`
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  width: ${props => props.$needsScroll ? '140px' : '160px'};
  height: ${props => props.$needsScroll ? '200px' : '220px'};
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 50%,
    #2a2a2a 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.8rem;

  @media (max-height: 800px) {
    width: ${props => props.$needsScroll ? '120px' : '140px'};
    height: ${props => props.$needsScroll ? '160px' : '180px'};
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const PosterImage = styled.img<{ $needsScroll: boolean }>`
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  width: ${props => props.$needsScroll ? '140px' : '160px'};
  height: ${props => props.$needsScroll ? '200px' : '220px'};
  object-fit: cover;
  transition: opacity 0.3s ease;

  @media (max-height: 800px) {
    width: ${props => props.$needsScroll ? '120px' : '140px'};
    height: ${props => props.$needsScroll ? '160px' : '180px'};
  }
`;

const NoPosterPlaceholder = styled.div<{ $needsScroll: boolean }>`
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  width: ${props => props.$needsScroll ? '140px' : '160px'};
  height: ${props => props.$needsScroll ? '200px' : '220px'};
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.8rem;
  text-align: center;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-height: 800px) {
    width: ${props => props.$needsScroll ? '120px' : '140px'};
    height: ${props => props.$needsScroll ? '160px' : '180px'};
  }
`;

const FilmDetails = styled.div`
  h3 {
    margin: 0.5rem 0 0.2rem;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    max-height: 2.4em; /* line-height * 2 */
    min-height: 1.2em; /* 최소 1줄 높이 보장 */
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    color: #aaaaaa;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-top: 2rem;
  animation: ${fadeIn} 1s ease-out;
`;

const Filmography: React.FC = () => {
  const { tmdbId } = useParams<{ tmdbId: string }>();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [actorData, setActorData] = useState<ActorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: number]: boolean }>({});
  const [actorImageLoading, setActorImageLoading] = useState(true);

  // 포스터 이미지 로딩 핸들러
  const handleImageLoad = (filmId: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [filmId]: false
    }));
  };

  const handleImageError = (filmId: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [filmId]: false
    }));
  };

  // 배우 이미지 로딩 핸들러
  const handleActorImageLoad = () => {
    setActorImageLoading(false);
  };

  const handleActorImageError = () => {
    setActorImageLoading(false);
  };

  // 배우 정보 및 필모그래피 로드
  useEffect(() => {
    const fetchActorData = async () => {
      if (!tmdbId) {
        setError('배우 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 상태 초기화
        setActorImageLoading(true);
        setImageLoadingStates({});
        
        const response = await getActorDetail(parseInt(tmdbId));

        if (response.success) {
          setActorData(response.data);
          
          // 배우 이미지가 없으면 즉시 로딩 상태 false
          if (!response.data.profileImage) {
            setActorImageLoading(false);
          }
          
          // 필모그래피 이미지 로딩 상태 설정
          if (response.data.filmographies && response.data.filmographies.length > 0) {
            const initialLoadingStates = response.data.filmographies.reduce((acc, film) => {
              // 이미지가 있는 경우에만 로딩 상태 true
              acc[film.tmdbId] = !!film.posterImage;
              return acc;
            }, {} as { [key: number]: boolean });
            
            setImageLoadingStates(initialLoadingStates);
          }
        } else {
          setError(response.message || '배우 정보를 불러올 수 없습니다.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '배우 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching actor data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActorData();
  }, [tmdbId]);

  // 스크롤 필요 여부 체크
  useEffect(() => {
    const checkScrollNeeded = () => {
      if (timelineRef.current && scrollRef.current) {
        const timelineWidth = timelineRef.current.scrollWidth;
        const containerWidth = scrollRef.current.clientWidth;
        setNeedsScroll(timelineWidth > containerWidth);
      }
    };

    if (actorData?.filmographies.length) {
      setTimeout(checkScrollNeeded, 100);
      window.addEventListener('resize', checkScrollNeeded);
      return () => window.removeEventListener('resize', checkScrollNeeded);
    }
  }, [actorData?.filmographies.length]);

  // 마우스 휠로 가로 스크롤 (스크롤이 필요한 경우에만)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current && needsScroll) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer && needsScroll) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, [needsScroll]);

  // 영화 클릭 핸들러
  const handleMovieClick = (movieTmdbId: number) => {
    navigate(`/movie/${movieTmdbId}`);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '미정';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}.${month}`;
  };

  // 출생지 및 생년월일 포맷팅
  const formatBirthInfo = (birthday: string | null, placeOfBirth: string | null) => {
    const birthDate = birthday ? new Date(birthday).toLocaleDateString('ko-KR') : null;
    const birthPlace = placeOfBirth || null;

    return { birthDate, birthPlace };
  };

  if (loading) {
    return (
      <FilmographyContainer>
        <LoadingContainer>
          배우 정보를 불러오는 중...
        </LoadingContainer>
      </FilmographyContainer>
    );
  }

  if (error || !actorData) {
    return (
      <FilmographyContainer>
        <ErrorContainer>
          <h2>오류가 발생했습니다</h2>
          <p>{error || '배우 정보를 찾을 수 없습니다.'}</p>
        </ErrorContainer>
      </FilmographyContainer>
    );
  }

  const { birthDate, birthPlace } = formatBirthInfo(actorData.birthday, actorData.placeOfBirth);

  return (
    <FilmographyContainer>
      {/* 배우 정보 */}
      <ActorInfo>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </BackButton>
        <ActorImageContainer>
          {actorData.profileImage ? (
            <>
              {actorImageLoading && <ActorImageSkeleton />}
              <ActorImage
                src={actorData.profileImage}
                alt={actorData.name}
                style={{ display: actorImageLoading ? 'none' : 'block' }}
                onLoad={handleActorImageLoad}
                onError={handleActorImageError}
              />
            </>
          ) : (
            <NoImagePlaceholder>
              <ImageIcon size={24} />
              <span>사진 없음</span>
            </NoImagePlaceholder>
          )}
        </ActorImageContainer>
        <ActorDetails>
          <h1>{actorData.name}</h1>
          {birthDate && <p>{birthDate}</p>}
          {birthPlace && <p>{birthPlace}</p>}
          <p>출연작 {actorData.filmographies.length}편</p>
        </ActorDetails>
      </ActorInfo>

      {/* 필모그래피 타임라인 */}
      <TimelineWrapper ref={scrollRef} $needsScroll={needsScroll}>
        {actorData.filmographies.length > 0 ? (
          <Timeline ref={timelineRef} $needsScroll={needsScroll}>
            <TimelineLine $needsScroll={needsScroll} />

            {actorData.filmographies.map((film, index) => {
              const isOdd = (index + 1) % 2 === 1;
              const isImageLoading = imageLoadingStates[film.tmdbId] ?? false; // 기본값 false
              
              return (
                <TimelineItem key={film.tmdbId} $isOdd={isOdd} $needsScroll={needsScroll} $index={index}>
                  <TimelinePoint />
                  <TimelineVerticalLine $isOdd={isOdd} />

                  <FilmCard
                    $isOdd={isOdd}
                    $needsScroll={needsScroll}
                    onClick={() => handleMovieClick(film.tmdbId)}
                  >
                    <PosterContainer $isOdd={isOdd}>
                      {film.posterImage ? (
                        <>
                          {isImageLoading && (
                            <PosterSkeleton $needsScroll={needsScroll} />
                          )}
                          <PosterImage
                            src={film.posterImage}
                            alt={film.name}
                            $needsScroll={needsScroll}
                            style={{ display: isImageLoading ? 'none' : 'block' }}
                            onLoad={() => handleImageLoad(film.tmdbId)}
                            onError={() => handleImageError(film.tmdbId)}
                          />
                        </>
                      ) : (
                        <NoPosterPlaceholder $needsScroll={needsScroll}>
                          <ImageIcon size={24} />
                          <span>포스터 없음</span>
                        </NoPosterPlaceholder>
                      )}
                    </PosterContainer>
                    <FilmDetails>
                      <h3>{film.name}</h3>
                      <p>{formatDate(film.releaseDate)}</p>
                    </FilmDetails>
                  </FilmCard>
                </TimelineItem>
              );
            })}
          </Timeline>
        ) : (
          <EmptyMessage>
            출연작 정보가 없습니다.
          </EmptyMessage>
        )}
      </TimelineWrapper>
    </FilmographyContainer>
  );
};

export default Filmography;