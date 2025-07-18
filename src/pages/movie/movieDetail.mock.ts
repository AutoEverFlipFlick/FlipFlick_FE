// movieDetail.mock.ts
import { MovieDetailData } from './movieDetail'

export const mockMovieDetailData: MovieDetailData = {
  tmdbId: 552524,
  title: '릴로 & 스티치',
  originalTitle: 'Lilo & Stitch',
  overview:
    '보송보송한 파란 솜털, 호기심 가득한 큰 눈, 장난기 가득한 웃음을 가졌지만 가장 위험한 실험체 취급을 받던 스티치는 우주에서 도망쳐 지구의 하와이 섬에 불시착하게 된다. 단짝 친구를 원하던 외톨이 소녀 릴로는 별똥별과 함께 나타난 귀여운 파란색 강아지 스티치와 소중한 친구이자, 하나의 가족이 되어가며 외로웠던 일상이 유쾌하게 변하기 시작한다. 그러던 어느 날, 스티치를 잡아 우주로 되돌아가려는 정체불명의 요원들이 등장하고 릴로와 스티치는 예상치 못한 상황을 마주하게 되는데..!',
  posterImg: 'https://image.tmdb.org/t/p/w500/ww7jn7lv1YzTAGd5m0R6CP1VXAs.jpg',
  backgroundImg: 'https://image.tmdb.org/t/p/w500/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg',
  releaseDate: '2025-05-17',
  runtime: 107,
  productionYear: 2025,
  productionCountry: 'United States of America',
  ageRating: 'ALL',
  voteAverage: 4.3, // UI에서 평균 평점
  myRating: 3.5, // 아직 API에 없음. mock으로 추가
  popcorn: 0, // 좋아요 수 (가정), API 명세 불명확
  isLiked: true, // 아직 API에 없음. mock
  isDisliked: false, // 아직 API에 없음. mock
  likes: 432, // UI에 명시적으로 필요한 필드로 mock
  dislikes: 12, // mock
  genres: [
    {
      tmdbId: 10751,
      name: '가족',
    },
    {
      tmdbId: 878,
      name: 'SF',
    },
    {
      tmdbId: 35,
      name: '코미디',
    },
    {
      tmdbId: 12,
      name: '모험',
    },
  ],
  platforms: [
    {
      type: '구매',
      name: 'Apple TV',
      logoUrl: '/images/platform-apple.png',
    },
    {
      type: '정액제',
      name: 'Netflix',
      logoUrl: '/images/platform-netflix.png',
    },
    {
      type: '대여',
      name: 'Google Play',
      logoUrl: '/images/platform-google.png',
    },
  ],
  actors: [
    {
      name: 'Maia Kealoha',
      imageUrl: 'https://image.tmdb.org/t/p/w500/jqsKbBF28V2Oq5tKPR5USkNufwC.jpg',
    },
    {
      name: 'Sydney Agudong',
      imageUrl: 'https://image.tmdb.org/t/p/w500/3K5hJ3meeClHWsPKetqd9qgyveJ.jpg',
    },
    {
      name: '크리스 샌더스',
      imageUrl: 'https://image.tmdb.org/t/p/w500/6CtrIOCxggJ5eIAWeFQqd4Hs9FP.jpg',
    },
    {
      name: '잭 갤리퍼내키스',
      imageUrl: 'https://image.tmdb.org/t/p/w500/qsDfoUlRnXHUiqZeBPWHzmgmKGX.jpg',
    },
  ],
  images: [
    'https://image.tmdb.org/t/p/w500/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg',
    'https://image.tmdb.org/t/p/w500/eCqIpFpYIcZpCBexU3y8BfZKR7f.jpg',
    'https://image.tmdb.org/t/p/w500/9yk2nvvppIhBANpbyavK8jOXiBn.jpg',
  ],
  videos: [
    'https://www.youtube.com/watch?v=yJPyTOkzzIY',
    'https://www.youtube.com/watch?v=you-ffSFgY0',
  ],
  reviews: [
    {
      username: '영화광123',
      createdAt: '2025-07-16T15:00:00Z',
      content: '가족의 소중함을 다시 느꼈어요. 추억이 되살아났습니다.',
      rating: 4.5,
      likes: 120,
      isMyPost: true,
    },
    {
      username: '시네마닉',
      createdAt: '2025-07-15T10:30:00Z',
      content: '스티치 너무 귀여워요. CG도 기대 이상!',
      rating: 4.0,
      likes: 85,
      isMyPost: false,
    },
  ],
  debates: [
    {
      username: '논객1',
      createdAt: '2025-07-14T22:00:00Z',
      content: '릴로가 부모 없이 성장하는 서사 설득력 부족',
      likes: 45,
      comments: 6,
      isMyPost: false,
    },
    {
      username: '디즈니빠',
      createdAt: '2025-07-13T13:45:00Z',
      content: '실사와 애니 연출 조합이 신선했다.',
      likes: 78,
      comments: 9,
      isMyPost: true,
    },
  ],
}
