import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

interface FilmItem {
  id: number;
  title: string;
  year: string;
  posterUrl: string;
}

const FilmographyContainer = styled.div`
  background-color: #0a0807;
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
`;

const ActorImageContainer = styled.div`
  margin-right: 1.5rem;
  margin-left: 1rem;
`;

const ActorImage = styled.img`
  border-radius: 4px;
  width: 100px;
  height: 120px;
  object-fit: cover;
`;

const ActorDetails = styled.div`
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

const TimelineWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  padding: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 0;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Timeline = styled.div`
  position: relative;
  min-width: max-content;
  display: flex;
  justify-content: flex-start;
  padding: 6rem 0;
  height: 100%;
  min-height: 300px;
  margin-left: 2rem;

  @media (max-height: 800px) {
    padding: 4rem 0;
    min-height: 250px;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #941d22;
  z-index: 1;
`;

const TimelineItem = styled.div<{ $isOdd: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 2rem;
  min-width: 90px;

  @media (max-height: 800px) {
    margin: 0 1.5rem;
  }
`;

const TimelinePoint = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #941d22;
  position: absolute;
  top: calc(50% - 5px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const TimelineVerticalLine = styled.div<{ $isOdd: boolean }>`
  width: 2px;
  height: 25px;
  background-color: #941d22;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: ${props => props.$isOdd ? 'translate(-50%, -100%)' : 'translateX(-50%)'};
  z-index: 2;
`;

const FilmCard = styled.div<{ $isOdd: boolean }>`
  position: absolute;
  ${props => props.$isOdd ? 'bottom: calc(50% + 35px);' : 'top: calc(50% + 35px);'}
  width: 140px;
  max-width: 140px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: ${props => props.$isOdd ? 'column' : 'column-reverse'};
  text-align: center;

  @media (max-height: 800px) {
    width: 120px;
    max-width: 120px;
    ${props => props.$isOdd ? 'bottom: calc(50% + 25px);' : 'top: calc(50% + 25px);'}
  }
`;

const PosterContainer = styled.div<{ $isOdd: boolean }>`
  margin-bottom: ${props => props.$isOdd ? '0.5rem' : '0'};
  margin-top: ${props => props.$isOdd ? '0' : '0.5rem'};
`;

const PosterImage = styled.img`
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  width: 140px;
  height: 200px;
  object-fit: cover;

  @media (max-height: 800px) {
    width: 120px;
    height: 160px;
  }
`;

const FilmDetails = styled.div`
  h3 {
    margin: 0.5rem 0 0.2rem;
    font-size: 0.9rem;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    color: #aaaaaa;
  }
`;

const Filmography: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Actor information
  const actor = {
    name: '추창우',
    birthDate: '1998년 9월 18일',
    birthPlace: '경기도 수원시'
  };
  
  // Film data
  const filmography: FilmItem[] = [
    { id: 1, title: '터치', year: '2012.11', posterUrl: '../../../레전드 배경.png' },
    { id: 2, title: '마스터', year: '2016.12', posterUrl: '../../../레전드 배경.png' },
    { id: 3, title: '조선총민사전', year: '2017.01', posterUrl: '../../../레전드 배경.png' },
    { id: 4, title: '범죄도시4', year: '2024.04', posterUrl: '../../../레전드 배경.png' },
    { id: 5, title: '터널', year: '2023.08', posterUrl:'../../../레전드 배경.png' },
    { id: 6, title: '터널', year: '2023.08', posterUrl:'../../../레전드 배경.png' },
    { id: 7, title: '터널', year: '2023.08', posterUrl:'../../../레전드 배경.png' },
    { id: 8, title: '터널', year: '2023.08', posterUrl:'../../../레전드 배경.png' },
    { id: 9, title: '터널', year: '2023.08', posterUrl:'../../../레전드 배경.png' },
    { id: 10, title: '터널', year: '2023.08', posterUrl:'../../../레전드 배경.png' },
  ];

  // Handle horizontal scrolling with mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <FilmographyContainer>
      {/* Actor Information */}
      <ActorInfo>
        <ActorImageContainer>
          <ActorImage
            src="../../../profile.png"
            alt={actor.name}
            width={100}
            height={120}
          />
        </ActorImageContainer>
        <ActorDetails>
          <h1>{actor.name}</h1>
          <p>{actor.birthDate}</p>
          <p>{actor.birthPlace}</p>
        </ActorDetails>
      </ActorInfo>

      {/* Timeline */}
      <TimelineWrapper ref={scrollRef}>
        <Timeline>
          <TimelineLine />
          
          {filmography.map((film) => {
            const isOdd = film.id % 2 === 1;
            return (
              <TimelineItem key={film.id} $isOdd={isOdd}>
                <TimelinePoint />
                <TimelineVerticalLine $isOdd={isOdd} />
                
                <FilmCard $isOdd={isOdd}>
                  <PosterContainer $isOdd={isOdd}>
                    <PosterImage
                      src={film.posterUrl}
                      alt={film.title}
                      width={140}
                      height={200}
                    />
                  </PosterContainer>
                  <FilmDetails>
                    <h3>{film.title}</h3>
                    <p>{film.year}</p>
                  </FilmDetails>
                </FilmCard>
              </TimelineItem>
            );
          })}
        </Timeline>
      </TimelineWrapper>
    </FilmographyContainer>
  );
};

export default Filmography;