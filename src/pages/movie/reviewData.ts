import {MemberResponseDto} from "@/services/memberInfo";
import {an} from "vitest/dist/chunks/reporters.d.BFLkQcL6";

export interface MemberProfile {
  nickname: string;
  profileImage: string | null;
  popcornScore: number;
}

// "reviewId": 1,
//   "content": "와, 진짜 스티치 너무 귀여운거 아니냐? 보송보송한 파란 솜털, 호기심 가득한 큰 눈, 장난기 가득한 웃음",
//   "star": 4.5,
//   "spoiler": false,
//   "likeCnt": 0,
//   "hateCnt": 0,
//   "createdAt": "2025-07-21 03:18:00",
//   "updatedAt": "2025-07-21 03:18:00",
//   "nickname": "hyeonhc328",
//   "profileImage": null,
//   "popcorn": 41

export interface Review {
  member :  MemberProfile;
  reviewId: number;
  createdAt: string;
  updatedAt?: string; // 업데이트 날짜는 선택적
  content: string;
  rating: number;
  likes: number;
  hates: number;
  isMyPost: boolean;
  isSpoiler: boolean;
}

export interface ReviewData {
  reviews: Review[];
  totalElements: number;
}



export function mapToReviewData(data: any, currentUserId?: number, currentUserNickName?: string): ReviewData {
  console.log(currentUserId, currentUserNickName);
  return {
    reviews: data.reviews.map((review: any) => ({
      member: {
        memberId: review.memberId,
        nickname: review.nickname,
        profileImage: review.profileImage,
        popcornScore: review.popcorn,
      },
      reviewId: review.reviewId,
      createdAt: review.createdAt,
      content: review.content,
      rating: review.star,
      likes: review.likeCnt,
      hates: review.hateCnt,
      // isMyPost: (currentUserId || currentUserNickName) ? ((review.memberId === currentUserId) || (review.nickname === currentUserNickName)) : false,
      isMyPost: (() => {
        const byId = review.memberId === currentUserId;
        const byNickname = review.nickname === currentUserNickName;
        const enabled = !!(currentUserId || currentUserNickName);
        const result = enabled ? (byId || byNickname) : false;
        console.log(
          `[isMyPost] reviewId: ${review.reviewId}, memberId: ${review.memberId}, currentUserId: ${currentUserId}, ` +
          `nickname: ${review.nickname}, currentUserNickName: ${currentUserNickName}, byId: ${byId}, byNickname: ${byNickname}, result: ${result}`
        );
        return result;
      })(),
      isSpoiler: review.spoiler,
    })),
    totalElements: data.totalElements || 0,
  };
}
