export interface MemberProfile {
  nickname: string;
  profileImage: string | null;
  popcornScore: number;
}

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



export function mapToMyReviewData(data: any): Review {
  return {
    member: {
      nickname: data.nickname,
      profileImage: data.profileImage,
      popcornScore: data.popcornScore,
    },
    reviewId: data.reviewId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    content: data.content,
    rating: data.star,
    likes: data.likeCnt,
    hates: data.hateCnt,
    isMyPost: true, // 현재 사용자의 리뷰이므로 항상 true
    isSpoiler: data.spoiler || false, // 스포일러 여부
  };
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
