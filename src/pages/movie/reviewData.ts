export interface MemberProfile {
  nickname: string;
  profileImage: string | null;
  popcornScore: number;
}

export interface Review {
  member :  MemberProfile;
  contentId: number;
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



export function mapToMyReviewData(data: any): Review | null {
  if (!data.review) return null;
  const review = data.review ?? {};
  console.log("[mapToMyReviewData] data:", data);
  return {
    member: {
      nickname: review.nickname,
      profileImage: review.profileImage,
      popcornScore: review.popcornScore,
    },
    contentId: review.reviewId,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    content: review.content,
    rating: review.star,
    likes: review.likeCnt,
    hates: review.hateCnt,
    isMyPost: true,
    isSpoiler: review.spoiler || false,
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
