import {MemberProfile, Review} from "@/pages/movie/reviewData";

export interface Debate extends Review {
  comments?: Comment[]; // 댓글 목록은 선택적
}

export interface CommentData {
  comments: Comment[];
  totalElements: number;
}

export interface Comment {
  member: MemberProfile;
  commentId: number;
  createdAt: string;
  updatedAt?: string; // 업데이트 날짜는 선택적
  content: string;
  isMyPost: boolean;
}

export interface DebateData {
  debates: Debate[];
  totalElements: number;
}
