import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { getActorDetail, ActorDetail, FilmographyItem } from '../services/filmography';


import { createGlobalStyle } from 'styled-components';

const Global = createGlobalStyle`
   body{
    overflow-y: hidden;
    scrollbar-width: none; /* Firefox */
  
  }

  /* Webkit 기반 브라우저 (Chrome, Safari)에서 스크롤바 숨기기 */
  body::-webkit-scrollbar {
    display: none;
  }
`

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
  padding: 0.8rem;
  font-family: 'Arial', sans-serif;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center;
  height: calc(100vh - 78px);
  max-height: calc(100vh - 78px);
  overflow: hidden;
  box-sizing: border-box;
  animation: ${fadeIn} 0.6s ease-out;
  

  @media (max-width: 768px) {
    height: calc(100vh - 78px);
    max-height: calc(100vh - 78px);
    padding: 0.5rem;
    gap: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.3rem;
    gap: 0.6rem;
  }
`;

const BackButton = styled.button`
  margin-bottom: 35px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 120, 73, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
  margin-right: 1rem;
  flex-shrink: 0;
  animation: ${slideInLeft} 0.6s ease-out 0.1s both;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 120, 73, 0.9);
    border-color: #ff7849;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    margin-right: 0.8rem;
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    margin-right: 0.6rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 78px);
  font-size: 1.1rem; /* 1.2rem에서 축소 */
  color: #ccc;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 78px);
  color: #ff4444;
  text-align: center;
  animation: ${slideUp} 0.8s ease-out;

  @media (max-width: 768px) {
    h2 {
      font-size: 1.3rem;
    }
    p {
      font-size: 0.9rem;
    }
  }
`;

const ActorInfo = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  flex-shrink: 0; /* 크기 고정 */
  width: 100%;
  min-height: 80px;
  max-height: 100px;
  position: relative;
  box-sizing: border-box;
  animation: ${slideUp} 0.8s ease-out 0.2s both;

  @media (max-width: 768px) {
    margin-left: 0.3rem;
    min-height: 70px;
    max-height: 85px;
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    margin-left: 0.2rem;
    min-height: 60px;
    max-height: 75px;
    padding: 0 0.3rem;
  }
`;

const ActorImageContainer = styled.div`
  margin-right: 1.2rem;
  animation: ${scaleIn} 0.8s ease-out 0.3s both;
  flex-shrink: 0;
  position: relative;

  @media (max-width: 768px) {
    margin-right: 0.8rem;
  }

  @media (max-width: 480px) {
    margin-right: 0.6rem;
  }
`;

const ActorImageSkeleton = styled.div`
  border-radius: 4px;
  width: 70px; /* 80px에서 축소 */
  height: 85px; /* 100px에서 축소 */
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
  font-size: 0.6rem; /* 0.7rem에서 축소 */

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @media (max-width: 768px) {
    width: 55px;
    height: 70px;
    font-size: 0.5rem;
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 60px;
    font-size: 0.4rem;
  }
`;

const ActorImage = styled.img`
  border-radius: 4px;
  width: 70px; /* 80px에서 축소 */
  height: 85px; /* 100px에서 축소 */
  object-fit: cover;
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    width: 55px;
    height: 70px;
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 60px;
  }
`;

const NoImagePlaceholder = styled.div`
  border-radius: 4px;
  width: 70px; /* 80px에서 축소 */
  height: 85px; /* 100px에서 축소 */
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.6rem; /* 0.7rem에서 축소 */
  text-align: center;
  flex-direction: column;
  gap: 0.2rem; /* 0.3rem에서 축소 */

  @media (max-width: 768px) {
    width: 55px;
    height: 70px;
    font-size: 0.5rem;
    gap: 0.1rem;
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 60px;
    font-size: 0.4rem;
  }
`;

const ActorDetails = styled.div`
  animation: ${slideUp} 0.8s ease-out 0.4s both;
  flex: 1; /* 남은 공간 차지 */
  
  h1 {
    margin: 0 0 0.3rem 0; /* 0.5rem에서 축소 */
    font-size: 1.5rem; /* 1.8rem에서 축소 */

    @media (max-width: 768px) {
      font-size: 1.1rem; /* 1.2rem에서 더 축소 */
      margin: 0 0 0.2rem 0;
    }

    @media (max-width: 480px) {
      font-size: 0.9rem; /* 1rem에서 더 축소 */
      margin: 0 0 0.1rem 0;
    }
  }

  p {
    margin: 0.1rem 0; /* 0.2rem에서 축소 */
    font-size: 0.8rem; /* 0.9rem에서 축소 */
    color: #cccccc;

    @media (max-width: 768px) {
      font-size: 0.65rem; /* 0.7rem에서 축소 */
      margin: 0.05rem 0;
    }

    @media (max-width: 480px) {
      font-size: 0.55rem; /* 0.6rem에서 축소 */
      margin: 0.03rem 0;
    }
  }
`;

const TimelineWrapper = styled.div<{ $needsScroll: boolean }>`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$needsScroll ? 'flex-start' : 'center'};
  min-height: 400px;
  max-height: 500px; /* 최대 높이 제한 */
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
  padding: 1rem 0; /* 상하 패딩 줄임 */
  height: 100%;
  min-height: 200px;
  max-height: 100%; /* 최대 높이 제한 */
  margin-left: ${props => props.$needsScroll ? '1.5rem' : '0'};
  width: ${props => props.$needsScroll ? 'fit-content' : '100%'};

  @media (max-height: 800px) {
    padding: 0.8rem 0;
    min-height: 180px;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 0;
    min-height: 160px;
    margin-left: ${props => props.$needsScroll ? '1rem' : '0'};
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0;
    min-height: 140px;
    margin-left: ${props => props.$needsScroll ? '0.5rem' : '0'};
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
  margin: ${props => props.$needsScroll ? '0 1.5rem' : '0 2.5rem'}; /* 2rem, 3rem에서 축소 */
  min-width: 75px; /* 90px에서 축소 */
  animation: ${slideUp} 0.6s ease-out ${props => 0.7 + (props.$index * 0.1)}s both;

  @media (max-height: 800px) {
    margin: ${props => props.$needsScroll ? '0 1.2rem' : '0 2rem'};
  }

  @media (max-width: 768px) {
    margin: ${props => props.$needsScroll ? '0 1rem' : '0 1.5rem'};
    min-width: 60px;
  }

  @media (max-width: 480px) {
    margin: ${props => props.$needsScroll ? '0 0.8rem' : '0 1.2rem'};
    min-width: 50px;
  }
`;

const TimelinePoint = styled.div`
  width: 8px; /* 10px에서 축소 */
  height: 8px;
  border-radius: 50%;
  background: #ff7849;
  position: absolute;
  top: calc(50% - 4px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 
    0 0 4px #ff7849, /* 6px에서 축소 */
    0 0 8px rgba(255, 120, 73, 0.5), /* 12px에서 축소 */
    inset 0 0 2px rgba(255, 255, 255, 0.3); /* 4px에서 축소 */
  
  &::before {
    content: '';
    position: absolute;
    top: -3px; /* -5px에서 축소 */
    left: -3px;
    right: -3px;
    bottom: -3px;
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

  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
    top: calc(50% - 3px);
  }

  @media (max-width: 480px) {
    width: 5px;
    height: 5px;
    top: calc(50% - 2.5px);
  }
`;

const TimelineVerticalLine = styled.div<{ $isOdd: boolean }>`
  width: ${props => props.$isOdd ? '1.5px' : '1.8px'}; /* 1.9px, 2.2px에서 축소 */
  height: 20px; /* 25px에서 축소 */
  background: linear-gradient(
    ${props => props.$isOdd ? '180deg' : '0deg'},
    rgba(255, 120, 73, 0.3) 0%,
    rgba(255, 120, 73, 1) 50%,
    rgba(255, 120, 73, 0.3) 100%
  );
  position: absolute;
  top: 50%;
  left: ${props => props.$isOdd ? '50.2%' : '50%'};
  margin-left: -0.8px; /* -1px에서 축소 */
  margin-top: ${props => props.$isOdd ? '-20px' : '0'}; /* -25px에서 축소 */
  z-index: 2;
  border-radius: 1px;
  box-shadow: 0 0 2px rgba(255, 120, 73, 0.4); /* 3px에서 축소 */

  @media (max-width: 768px) {
    height: 15px;
    margin-top: ${props => props.$isOdd ? '-15px' : '0'};
  }

  @media (max-width: 480px) {
    height: 12px;
    margin-top: ${props => props.$isOdd ? '-12px' : '0'};
    width: ${props => props.$isOdd ? '1.2px' : '1.5px'};
  }
`;
const FilmCard = styled.div<{ $isOdd: boolean; $needsScroll: boolean }>`
  position: absolute;
  ${props => props.$isOdd ? 'bottom: calc(50% + 25px);' : 'top: calc(50% + 25px);'} /* 35px에서 축소 */
  width: ${props => props.$needsScroll ? '110px' : '130px'}; /* 140px, 160px에서 축소 */
  max-width: ${props => props.$needsScroll ? '110px' : '130px'};
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
    width: ${props => props.$needsScroll ? '95px' : '115px'};
    max-width: ${props => props.$needsScroll ? '95px' : '115px'};
    ${props => props.$isOdd ? 'bottom: calc(50% + 20px);' : 'top: calc(50% + 20px);'}
  }

  @media (max-width: 768px) {
    width: ${props => props.$needsScroll ? '85px' : '95px'};
    max-width: ${props => props.$needsScroll ? '85px' : '95px'};
    ${props => props.$isOdd ? 'bottom: calc(50% + 18px);' : 'top: calc(50% + 18px);'}
  }

  @media (max-width: 480px) {
    width: ${props => props.$needsScroll ? '75px' : '85px'};
    max-width: ${props => props.$needsScroll ? '75px' : '85px'};
    ${props => props.$isOdd ? 'bottom: calc(50% + 15px);' : 'top: calc(50% + 15px);'}
  }
`;

const PosterContainer = styled.div<{ $isOdd: boolean }>`
  margin-bottom: ${props => props.$isOdd ? '0.3rem' : '0'}; /* 0.5rem에서 축소 */
  margin-top: ${props => props.$isOdd ? '0' : '0.3rem'};

  @media (max-width: 768px) {
    margin-bottom: ${props => props.$isOdd ? '0.2rem' : '0'};
    margin-top: ${props => props.$isOdd ? '0' : '0.2rem'};
  }

  @media (max-width: 480px) {
    margin-bottom: ${props => props.$isOdd ? '0.15rem' : '0'};
    margin-top: ${props => props.$isOdd ? '0' : '0.15rem'};
  }
`;

const PosterSkeleton = styled.div<{ $needsScroll: boolean }>`
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5); /* 4px 8px에서 축소 */
  width: ${props => props.$needsScroll ? '110px' : '130px'}; /* 140px, 160px에서 축소 */
  height: ${props => props.$needsScroll ? '150px' : '175px'}; /* 200px, 220px에서 축소 */
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
  font-size: 0.6rem; /* 0.8rem에서 축소 */

  @media (max-height: 800px) {
    width: ${props => props.$needsScroll ? '95px' : '115px'};
    height: ${props => props.$needsScroll ? '135px' : '155px'};
  }

  @media (max-width: 768px) {
    width: ${props => props.$needsScroll ? '85px' : '95px'};
    height: ${props => props.$needsScroll ? '115px' : '130px'};
    font-size: 0.5rem;
  }

  @media (max-width: 480px) {
    width: ${props => props.$needsScroll ? '75px' : '85px'};
    height: ${props => props.$needsScroll ? '105px' : '120px'};
    font-size: 0.4rem;
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
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5); /* 4px 8px에서 축소 */
  width: ${props => props.$needsScroll ? '110px' : '130px'}; /* 140px, 160px에서 축소 */
  height: ${props => props.$needsScroll ? '150px' : '175px'}; /* 200px, 220px에서 축소 */
  object-fit: cover;
  transition: opacity 0.3s ease;

  @media (max-height: 800px) {
    width: ${props => props.$needsScroll ? '95px' : '115px'};
    height: ${props => props.$needsScroll ? '135px' : '155px'};
  }

  @media (max-width: 768px) {
    width: ${props => props.$needsScroll ? '85px' : '95px'};
    height: ${props => props.$needsScroll ? '115px' : '130px'};
  }

  @media (max-width: 480px) {
    width: ${props => props.$needsScroll ? '75px' : '85px'};
    height: ${props => props.$needsScroll ? '105px' : '120px'};
  }
`;

const NoPosterPlaceholder = styled.div<{ $needsScroll: boolean }>`
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5); /* 4px 8px에서 축소 */
  width: ${props => props.$needsScroll ? '110px' : '130px'}; /* 140px, 160px에서 축소 */
  height: ${props => props.$needsScroll ? '150px' : '175px'}; /* 200px, 220px에서 축소 */
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.6rem; /* 0.8rem에서 축소 */
  text-align: center;
  flex-direction: column;
  gap: 0.3rem; /* 0.5rem에서 축소 */

  @media (max-height: 800px) {
    width: ${props => props.$needsScroll ? '95px' : '115px'};
    height: ${props => props.$needsScroll ? '135px' : '155px'};
  }

  @media (max-width: 768px) {
    width: ${props => props.$needsScroll ? '85px' : '95px'};
    height: ${props => props.$needsScroll ? '115px' : '130px'};
    font-size: 0.5rem;
    gap: 0.2rem;
  }

  @media (max-width: 480px) {
    width: ${props => props.$needsScroll ? '75px' : '85px'};
    height: ${props => props.$needsScroll ? '105px' : '120px'};
    font-size: 0.4rem;
    gap: 0.1rem;
  }
`;

const FilmDetails = styled.div`
  h3 {
    margin: 0.3rem 0 0.15rem; /* 0.5rem 0.2rem에서 축소 */
    font-size: 0.7rem; /* 0.9rem에서 축소 */
    font-weight: 600;
    line-height: 1.1; /* 1.2에서 축소 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    max-height: 2.4em; /* 2.4em에서 축소 */
    min-height: 1.2em; /* 1.2em에서 축소 */

    @media (max-width: 768px) {
      font-size: 0.6rem;
      margin: 0.2rem 0 0.1rem;
    }

    @media (max-width: 480px) {
      font-size: 0.5rem;
      margin: 0.15rem 0 0.05rem;
    }
  }

  p {
    margin: 0;
    font-size: 0.6rem; /* 0.8rem에서 축소 */
    color: #aaaaaa;

    @media (max-width: 768px) {
      font-size: 0.5rem;
    }

    @media (max-width: 480px) {
      font-size: 0.45rem;
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1rem; /* 1.1rem에서 축소 */
  margin-top: 1.5rem; /* 2rem에서 축소 */
  animation: ${fadeIn} 1s ease-out;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-top: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-top: 0.8rem;
  }
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
        setActorImageLoading(true);
        setImageLoadingStates({});

        const response = await getActorDetail(parseInt(tmdbId));

        if (response.success) {
          setActorData(response.data);

          if (!response.data.profileImage) {
            setActorImageLoading(false);
          }

          if (response.data.filmographies && response.data.filmographies.length > 0) {
            const initialLoadingStates = response.data.filmographies.reduce((acc, film) => {
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

  // 마우스 휠로 가로 스크롤
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
    navigate(`/movie/detail/${movieTmdbId}`);
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
    <>
    <Global />
    <FilmographyContainer>
      {/* 배우 정보 */}
      <ActorInfo>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={14} />
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
              <ImageIcon size={16} />
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
              const isImageLoading = imageLoadingStates[film.tmdbId] ?? false;

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
                          <ImageIcon size={16} /> {/* 24px에서 축소 */}
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
    </>
  );
};

export default Filmography;
