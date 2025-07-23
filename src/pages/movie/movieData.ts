// pages/movieData.ts

export interface Provider {
  providerName: string,
  providerType: 'BUY' | 'RENT' | 'FLATRATE',
}

export interface Actor {
  id: number;
  name: string;
  profileImg: string | null;
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
  movieId: number;
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
  myLike: boolean;
  myHate: boolean;
  myWatched: boolean;
  myBookmark: boolean;
  likeCnt: number;
  hateCnt: number;
  genres: Genre[];
  providers: Provider[];
  casts: Actor[];
  images: string[];
  videos: string[];
}
