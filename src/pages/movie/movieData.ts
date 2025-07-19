// pages/movieData.ts

export interface Providers {
  type: '구매' | '정액제' | '대여';
  name: string;
  logoUrl: string;
}

export interface Actor {
  id: number;
  name: string;
  profileImg: string | null;
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

export interface Genre {
  tmdbId: number;
  genreName: string;
}
export interface OverviewData {
  tmdbId: number;
  originalTitle: string;
  runtime: number;
  productionCountry: string;
  releaseDate: string;

}



export interface LikeHateData {
  isLiked: boolean;
  isDisliked: boolean;
}

export interface MovieData {
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
  myLiked: boolean;
  myHate: boolean;
  likeCnt: number;
  hateCnt: number;
  genres: Genre[];
  providers: Providers[];
  casts: Actor[];
  images: string[];
  videos: string[];
  reviews: Review[];
  debates: Debate[];
}
