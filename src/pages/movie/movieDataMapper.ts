// src/pages/movie/movieDataMapper.ts
import { MovieData, Genre, Actor, Review, Debate, Providers } from "@/pages/movie/movieData";

export function mapToMovieData(data: any): MovieData {
  return {
    movieId: data.movieId,
    tmdbId: data.tmdbId,
    title: data.title,
    originalTitle: data.originalTitle,
    overview: data.overview,
    posterImg: data.posterImg,
    backgroundImg: data.backgroundImg,
    releaseDate: data.releaseDate,
    runtime: data.runtime,
    productionYear: data.productionYear,
    productionCountry: data.productionCountry,
    ageRating: data.ageRating,
    voteAverage: data.voteAverage,
    myRating: data.myRating ?? 0,
    popcorn: data.popcorn,
    myLike: data.myLike,
    myHate: data.myHate,
    myWatched: data.myWatched,
    myBookmark: data.myBookmark,
    likeCnt: data.likeCnt,
    hateCnt: data.hateCnt,
    genres: (data.genres ?? []).map((g: any): Genre => ({
      tmdbId: g.tmdbId,
      genreName: g.genreName,
    })),
    casts: (data.casts ?? []) as Actor[],
    images: data.images ?? [],
    videos: data.videos ?? [],
    providers: (data.providers ?? []) as Providers[],
    reviews: (data.reviews ?? []) as Review[],
    debates: (data.debates ?? []) as Debate[],
  }
}
