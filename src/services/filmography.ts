import axiosInstance from './axiosInstance';

export interface FilmographyItem {
  tmdbId: number;
  posterImage: string | null;
  name: string;
  releaseDate: string | null;
}

export interface ActorDetail {
  tmdbId: number;
  name: string;
  gender: string;
  profileImage: string | null;
  placeOfBirth: string | null;
  birthday: string | null;
  deathday: string | null;
  filmographies: FilmographyItem[];
}

export interface ActorDetailResponse {
  status: number;
  success: boolean;
  message: string;
  data: ActorDetail;
}

export const getActorDetail = async (tmdbId: number): Promise<ActorDetailResponse> => {
  const response = await axiosInstance.post<ActorDetailResponse>('/api/v1/cast/view', {
    tmdbId
  });
  return response.data;
};