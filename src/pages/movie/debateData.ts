import {MemberProfile, Review} from "@/pages/movie/reviewData";

export interface Debate extends Review {
  // comments?: Comment[]; // 댓글 목록은 선택적
  commentCount: number; // 댓글 개수
  debateTitle: string; // 토론 제목
  imageUrls: string[]; // 이미지 URL 목록, 선택적
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


/* Example Response
{
  "status": 200,
  "success": true,
  "message": "토론 목록 조회 성공",
  "data": {
    "content": [
      {
        "debateId": 6,
        "memberId": 1,
        "tmdbId": 872585,
        "movie": null,
        "movieTitle": "오펜하이머",
        "debateTitle": "이미지 첨부 테스트 4",
        "content": "<p>이미지 첨부 테스트 4 이미지 첨부 테스트 4 이미지 첨부 테스트 4 이미지 첨부 테스트 4 이미지 첨부 테스트 4&nbsp;</p><p>&nbsp;</p>",
        "spoiler": false,
        "likeCnt": 0,
        "hateCnt": 0,
        "createdAt": "2025-07-22 19:01:32",
        "updatedAt": "2025-07-22 19:01:32",
        "nickname": "hyhyhy",
        "profileImage": null,
        "popcorn": 41,
        "commentCount": 0
      },
      {
        "debateId": 5,
        "memberId": 1,
        "tmdbId": 872585,
        "movie": null,
        "movieTitle": "오펜하이머",
        "debateTitle": "이미지 첨부 테스트 3 ",
        "content": "<p>이미지 첨부 테스트 3 이미지 첨부 테스트 3 이미지 첨부 테스트 3 이미지 첨부 테스트 3&nbsp;</p><figure class=\"image\"><img style=\"aspect-ratio:3840/2160;\" src=\"https://flipflick.s3.ap-northeast-2.amazonaws.com/images/2b0679ed-633a-401f-aa94-0989492610f6-7i1CepptmQURvXaLAxvMFtzlyMI.webp\" width=\"3840\" height=\"2160\"></figure><figure class=\"image\"><img style=\"aspect-ratio:1600/899;\" src=\"https://flipflick.s3.ap-northeast-2.amazonaws.com/images/3ccec9b7-f080-42bf-9134-3775f77cad8b-AIneRDY6pDapNBrhxLP7bBToj6.webp\" width=\"1600\" height=\"899\"></figure><figure class=\"image\"><img style=\"aspect-ratio:2160/1215;\" src=\"https://flipflick.s3.ap-northeast-2.amazonaws.com/images/8edea11b-a418-4b78-811a-c7f52c6d8af6-b00b5bbdjIbeEQPPc6Z0lF5UlOk.webp\" width=\"2160\" height=\"1215\"></figure>",
        "spoiler": false,
        "likeCnt": 0,
        "hateCnt": 0,
        "createdAt": "2025-07-22 19:01:05",
        "updatedAt": "2025-07-22 19:01:05",
        "nickname": "hyhyhy",
        "profileImage": null,
        "popcorn": 41,
        "commentCount": 0
      },
      {
        "debateId": 4,
        "memberId": 1,
        "tmdbId": 872585,
        "movie": null,
        "movieTitle": "오펜하이머",
        "debateTitle": "이미지 첨부 테스트 2 ",
        "content": "<p>이미지 첨부 테스트 2 이미지 첨부 테스트 2 이미지 첨부 테스트 2&nbsp;</p><p>이미지 첨부 테스트 2 이미지 첨부 테스트 2 이미지 첨부 테스트 2 이미지 첨부 테스트 2&nbsp;</p><figure class=\"image\"><img style=\"aspect-ratio:3840/2160;\" src=\"https://flipflick.s3.ap-northeast-2.amazonaws.com/images/67c53adc-682a-4b26-814b-d6fc122886ee-7i1CepptmQURvXaLAxvMFtzlyMI.webp\" width=\"3840\" height=\"2160\"></figure>",
        "spoiler": false,
        "likeCnt": 0,
        "hateCnt": 0,
        "createdAt": "2025-07-22 19:00:43",
        "updatedAt": "2025-07-22 19:00:43",
        "nickname": "hyhyhy",
        "profileImage": null,
        "popcorn": 41,
        "commentCount": 0
      },
      {
        "debateId": 3,
        "memberId": 1,
        "tmdbId": 872585,
        "movie": null,
        "movieTitle": "오펜하이머",
        "debateTitle": "이미지 첨부 테스트 1",
        "content": "<p>이미지 첨부 테스트 1 이미지 첨부 테스트 1 이미지 첨부 테스트 1&nbsp;</p><p>이미지 첨부 테스트 1 이미지 첨부 테스트 1 이미지 첨부 테스트 1 이미지 첨부 테스트 1 이미지 첨부 테스트 1 이미지 첨부 테스트 1 이미지 첨부 테스트 1 이미지 첨부 테스트 1 이미지 첨부 테스트 1&nbsp;</p><p>이미지 첨부 테스트 1 이미지 첨부 테스트 1 이미지 첨부 테스트 1&nbsp;</p>",
        "spoiler": false,
        "likeCnt": 0,
        "hateCnt": 0,
        "createdAt": "2025-07-22 19:00:11",
        "updatedAt": "2025-07-22 19:00:11",
        "nickname": "hyhyhy",
        "profileImage": null,
        "popcorn": 41,
        "commentCount": 0
      },
      {
        "debateId": 2,
        "memberId": 1,
        "tmdbId": 872585,
        "movie": null,
        "movieTitle": "오펜하이머",
        "debateTitle": "토론 테스트 2",
        "content": "<p>토론 테스트 2토론 테스트 2토론 테스트 2토론 테스트 2토론 테스트 2</p>",
        "spoiler": false,
        "likeCnt": 0,
        "hateCnt": 0,
        "createdAt": "2025-07-22 18:36:37",
        "updatedAt": "2025-07-22 18:36:37",
        "nickname": "hyhyhy",
        "profileImage": null,
        "popcorn": 41,
        "commentCount": 0
      },
      {
        "debateId": 1,
        "memberId": 1,
        "tmdbId": 872585,
        "movie": null,
        "movieTitle": "오펜하이머",
        "debateTitle": "토론 테스트 1",
        "content": "<p>토론 테스트 1토론 테스트 1토론 테스트 1</p>",
        "spoiler": false,
        "likeCnt": 0,
        "hateCnt": 0,
        "createdAt": "2025-07-22 18:36:24",
        "updatedAt": "2025-07-22 18:36:24",
        "nickname": "hyhyhy",
        "profileImage": null,
        "popcorn": 41,
        "commentCount": 0
      }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 6,
    "numberOfElements": 6,
    "first": true,
    "last": true
  }
}

*/

// 무한 스크롤 고려해야함, 한번에 최대 10개씩 가져오기
export const mapToDebateData = (data: any, currentUserId?: number, currentUserNickName?: string): DebateData => {
  return {
    debates: data.content.map((debate: any): Debate => ({
      member: {
        memberId: debate.memberId,
        nickname: debate.nickname,
        profileImage: debate.profileImage,
        popcornScore: debate.popcorn,
      },
      contentId: debate.debateId,
      tmdbId: debate.tmdbId,
      movieTitle: debate.movieTitle,
      debateTitle: debate.debateTitle,
      content: debate.content,
      // content 응답은 html 형식으로 되어있음
      // 따라서, 태그를 제거하고 텍스트만 추출하고 250자만 맵핑하는 로직이 필요함
      // content: debate.content.replace(/<[^>]*>/g, '').substring(0, 250), // HTML 태그 제거 후 250자까지 자르기
      // content: debate.content,
      // 추가로 content 필드에서 이미지 태그들 속 src의 URL을 추출하여 imageUrls 필드에 추가
      /*<img style=\"aspect-ratio:3840/2160;\" src=\"https://flipflick.s3.ap-northeast-2.amazonaws.com/images/2b0679ed-633a-401f-aa94-0989492610f6-7i1CepptmQURvXaLAxvMFtzlyMI.webp\" width=\"3840\" height=\"2160\">*/
      // 이미지 URL 추출 로직
      imageUrls: (() => {
        const imageRegex = /<img[^>]+src="([^">]+)"/g; // <img> 태그에서 src 속성의 URL을 추출하는 정규식
        const urls: string[] = [];
        let match;
        while ((match = imageRegex.exec(debate.content)) !== null) {
          urls.push(match[1]); // match[1]은 src 속성의 URL
        }
        return urls; // 이미지 URL 목록 반환
      })()
      , // 이미지 URL 목록, 없으면 빈 배열
      createdAt: debate.createdAt,
      updatedAt: debate.updatedAt,
      likes: debate.likeCnt,
      hates: debate.hateCnt,
      isMyPost: (() => {
        const byId = debate.memberId === currentUserId;
        const byNickname = debate.nickname === currentUserNickName;
        const enabled = !!(currentUserId || currentUserNickName);
        return enabled ? (byId || byNickname) : false;
      })(),
      isSpoiler: debate.spoiler || false,
      commentCount: debate.commentCount || 0, // 댓글 개수
    })),
    totalElements: data.totalElements || 0,
    /*
    debates: data.content.map((debate: any): Debate => ({
      member: {
        memberId: debate.memberId,
        nickname: debate.nickname,
        profileImage: debate.profileImage,
        popcornScore: debate.popcorn
      },
      contentId: debate.debateId,
      tmdbId: debate.tmdbId,
      movieTitle: debate.movieTitle,
      debateTitle: debate.debateTitle,
      content: debate.content,
      isSpoiler: debate.spoiler,
      isMyPost: (() => {
        const byId = debate.memberId === currentUserId;
        const byNickname = debate.nickname === currentUserNickName;
        const enabled = !!(currentUserId || currentUserNickName);
        const result = enabled ? (byId || byNickname) : false;
        console.log(
          `[isMyPost] reviewId: ${debate.reviewId}, memberId: ${debate.memberId}, currentUserId: ${currentUserId}, ` +
          `nickname: ${debate.nickname}, currentUserNickName: ${currentUserNickName}, byId: ${byId}, byNickname: ${byNickname}, result: ${result}`
        );
        return result;
      })(), // 현재 사용자 ID와 비교하여 내 게시물인지 확인
      likes: debate.likeCnt,
      hates: debate.hateCnt,
      createdAt: debate.createdAt,
      updatedAt: debate.updatedAt,
      commentCount: debate.commentCount
    })),
    totalElements: data.totalElements
    */
  }
}
