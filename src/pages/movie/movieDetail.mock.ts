// movieDetail.mock.ts
export const mockMovieDetailData = {
  tmdbId: 552524,
  title: "릴로 & 스티치",
  originalTitle: "Lilo & Stitch",
  overview:
    "지구에 불시착한 외계 생명체 스티치와 하와이에 사는 소녀 릴로가 만들어가는 사랑과 우정의 이야기.",
  posterImg: "https://image.tmdb.org/t/p/w500/ww7jn7lv1YzTAGd5m0R6CP1VXAs.jpg",
  backgroundImg: "https://image.tmdb.org/t/p/w500/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg",
  releaseDate: "2025-05-17",
  runtime: 107,
  productionYear: 2025,
  productionCountry: "United States of America",
  ageRating: "ALL",
  voteAverage: 4.3, // UI에서 평균 평점
  myRating: 3.5, // 아직 API에 없음. mock으로 추가
  popcorn: 0, // 좋아요 수 (가정), API 명세 불명확
  isLiked: true, // 아직 API에 없음. mock
  isDisliked: false, // 아직 API에 없음. mock
  likes: 432, // UI에 명시적으로 필요한 필드로 mock
  dislikes: 12, // mock
  genres: ["가족", "SF", "코미디", "모험"],
  platforms: [
    {
      type: "구매",
      name: "Apple TV",
      logoUrl: "/images/platform-apple.png"
    },
    {
      type: "정액제",
      name: "Netflix",
      logoUrl: "/images/platform-netflix.png"
    },
    {
      type: "대여",
      name: "Google Play",
      logoUrl: "/images/platform-google.png"
    }
  ],
  actors: [
    {
      name: "Maia Kealoha",
      imageUrl:
        "https://image.tmdb.org/t/p/w500/jqsKbBF28V2Oq5tKPR5USkNufwC.jpg"
    },
    {
      name: "Sydney Agudong",
      imageUrl:
        "https://image.tmdb.org/t/p/w500/3K5hJ3meeClHWsPKetqd9qgyveJ.jpg"
    },
    {
      name: "크리스 샌더스",
      imageUrl:
        "https://image.tmdb.org/t/p/w500/6CtrIOCxggJ5eIAWeFQqd4Hs9FP.jpg"
    },
    {
      name: "잭 갤리퍼내키스",
      imageUrl:
        "https://image.tmdb.org/t/p/w500/qsDfoUlRnXHUiqZeBPWHzmgmKGX.jpg"
    }
  ],
  images: [
    "https://image.tmdb.org/t/p/w500/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg",
    "https://image.tmdb.org/t/p/w500/eCqIpFpYIcZpCBexU3y8BfZKR7f.jpg",
    "https://image.tmdb.org/t/p/w500/9yk2nvvppIhBANpbyavK8jOXiBn.jpg"
  ],
  videos: [
    "https://www.youtube.com/watch?v=yJPyTOkzzIY",
    "https://www.youtube.com/watch?v=you-ffSFgY0"
  ],
  reviews: [
    {
      username: "영화광123",
      createdAt: "2025-07-16T15:00:00Z",
      content: "가족의 소중함을 다시 느꼈어요. 추억이 되살아났습니다.",
      rating: 4.5,
      likes: 120,
      isMyPost: true
    },
    {
      username: "시네마닉",
      createdAt: "2025-07-15T10:30:00Z",
      content: "스티치 너무 귀여워요. CG도 기대 이상!",
      rating: 4.0,
      likes: 85,
      isMyPost: false
    }
  ],
  debates: [
    {
      username: "논객1",
      createdAt: "2025-07-14T22:00:00Z",
      content: "릴로가 부모 없이 성장하는 서사 설득력 부족",
      likes: 45,
      comments: 6,
      isMyPost: false
    },
    {
      username: "디즈니빠",
      createdAt: "2025-07-13T13:45:00Z",
      content: "실사와 애니 연출 조합이 신선했다.",
      likes: 78,
      comments: 9,
      isMyPost: true
    }
  ]
}
