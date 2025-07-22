export interface MemberData {
  memberId: number;
  nickname: string;
  profileImage: string | null;
  popcornScore: number;
}

export function mapToMemberData(data: MemberData): MemberData {
  return {
    memberId: data.memberId,
    nickname: data.nickname,
    profileImage: data.profileImage,
    popcornScore: data.popcornScore,
  };
}
