import {MemberProfile} from "@/pages/movie/reviewData";

export interface Debate {
  member: MemberProfile;
  debateId: number;
  createdAt: string;
  updatedAt?: string; // 업데이트 날짜는 선택적
  content: string;
  likes: number;
  hates: number;
  // comments: number;
}

export interface DebateData {
  debates: Debate[];
  totalElements: number;
}

export function mapToDebateData(data: any): DebateData {
  return {
    debates: data.debates.map((debate: any) => ({
      member: {
        memberId: debate.memberId,
        nickname: debate.nickname,
        profileImage: debate.profileImage,
        popcornScore: debate.popcorn,
      },
      debateId: debate.debateId,
      createdAt: debate.createdAt,
      updatedAt: debate.updatedAt,
      content: debate.content,
      likes: debate.likeCnt,
      hates: debate.hateCnt,
      // comments: debate.commentCnt,
      isMyPost: debate.isMyPost,
    })),
    totalElements: data.totalElements || 0,
  };
}
