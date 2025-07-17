// pages/movieDetail.ts

export interface Platform {
  type: '구매' | '정액제' | '대여';
  name: string;
  logoUrl: string;
}

export interface Actor {
  name: string;
  imageUrl: string;
}

export interface Review {
  username: string;
  createdAt: string;
  content: string;
  rating: number;
  likes: number;
  isMyPost: boolean;
}

export interface Debate {
  username: string;
  createdAt: string;
  content: string;
  likes: number;
  comments: number;
  isMyPost: boolean;
}

export interface MovieDetailData {
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterImg: string;
  backgroundImg: string;
  releaseDate: string;
  runtime: number;
  productionYear: number;
  productionCountry: string;
  ageRating: string;
  voteAverage: number;
  myRating: number;
  popcorn: number;
  isLiked: boolean;
  isDisliked: boolean;
  likes: number;
  dislikes: number;
  genres: string[];
  platforms: Platform[];
  actors: Actor[];
  images: string[];
  videos: string[];
  reviews: Review[];
  debates: Debate[];
}
