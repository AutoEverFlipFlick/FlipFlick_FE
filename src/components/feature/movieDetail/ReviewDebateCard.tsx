// components/common/ReviewDebateCard.tsx
import React from 'react'
import styled from 'styled-components'
import BaseContainer from '@/components/common/BaseContainer'
import {Heart, MessageSquareText} from 'lucide-react'
import StarRating from '@/components/starRating/StarRating'

const Wrapper = styled(BaseContainer)`
    width: 100%;
    max-width: 800px;
    min-height: 100px;
    margin: 5px auto;
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 15px;
    color: white;
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px;
`

const UserCard = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const Body = styled.div`
    padding: 15px;
    font-size: 12px;
    word-wrap: break-word;
`

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
`

const LikeCommentWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 12px;
    color: white;
`

const LikeWrapper = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    font-size: 12px;
`

const CommentsWrapper = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    font-size: 12px;
    color: white;
`

const ReportDeleteButton = styled.div`
  font-size: 12px;
  color: white;
  cursor: pointer;
  transition: text-decoration 0.2s ease-in-out;

  &:hover {
    text-decoration: underline;
  }
`


interface ReviewDebateCardProps {
  username: string
  createdAt: string
  content: string
  rating?: number
  likes: number
  comments?: number
  isMyPost?: boolean

  // onDelete?: () => void
  // onReport?: () => void
}

const ReviewDebateCard: React.FC<ReviewDebateCardProps> = ({username, createdAt, content, rating, likes, comments, isMyPost}) => (
  <Wrapper>
    <Header>
      <UserCard>
        <div style={{width: 30, height: 30, borderRadius: '50%', backgroundColor: '#f0f0f0'}}/>
        <div>
          <div style={{fontSize: 12}}>{username}</div>
          <div style={{fontSize: 8}}>{createdAt}</div>
        </div>
        {rating !== undefined && (
          <div style={{marginLeft: 8}}>
            <StarRating rating={rating}/>
          </div>
        )}
      </UserCard>
    </Header>
    <Body>{content}</Body>
    <Footer>
      <LikeCommentWrapper>
        <LikeWrapper>
          <Heart size={15} color="red" fill="red"/>
          <span>{likes}</span>
        </LikeWrapper>
        {comments !== undefined && (
          <CommentsWrapper>
            <MessageSquareText size={15} color="white"/>
            <span>{comments}</span>
          </CommentsWrapper>
        )}
      </LikeCommentWrapper>
      <ReportDeleteButton
        // onClick={isMyPost ? onDelete : onReport}
      >
        {isMyPost ? '삭제' : '신고'}
      </ReportDeleteButton>
    </Footer>
  </Wrapper>
)

export default ReviewDebateCard
