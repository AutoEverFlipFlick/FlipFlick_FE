// // components/common/ReviewDebateCard.tsx
// import React, {useState} from 'react'
// import styled, {css} from 'styled-components'
// import BaseContainer from '@/components/common/BaseContainer'
// import {Heart, MessageSquareText} from 'lucide-react'
// import StarRating from '@/components/starRating/StarRating'
// import { Review } from '@/pages/movie/reviewData'
// import { Debate } from '@/pages/movie/debateData'
//
//
// const PLACEHOLDER = 'https://placehold.co/600x600'
// const Wrapper = styled(BaseContainer)<{ $type: 'review' | 'debate' }>`
//     width: 100%;
//     max-width: 800px;
//     min-height: 100px;
//     margin: 5px auto;
//     padding: 10px 10px;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     border-radius: 15px;
//     color: white;
//     cursor: ${({$type}) => $type === 'debate' ? 'pointer' : 'default'};
// `
// /* Wrapper 컴포넌트에 조건부 스타일 적용 가능
// ${({$type}) => $type === 'debate' && css`
//      조건부 스타일 넣을 수 있음
//  `}
// */
//
// const Header = styled.div`
//     display: flex;
//     justify-content: space-between;
//     padding: 5px;
// `
//
// const UserCard = styled.div`
//     display: flex;
//     align-items: center;
//     gap: 10px;
// `
//
// const BodyContents = styled.div<{ $blur?: boolean }>`
//     padding: 15px;
//     font-size: 12px;
//     word-wrap: break-word;
//     ${({$blur}) => $blur && css`
//         filter: blur(6px);
//         pointer-events: none;
//         user-select: none;
//     `}
// `
// const SpoilerWarning = styled.div`
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     background: rgba(0, 0, 0, 0.7);
//     color: #fff;
//     padding: 8px 16px;
//     border-radius: 8px;
//     z-index: 2;
//     font-size: 14px;
//     text-align: center;
// `
//
// const Footer = styled.div`
//     display: flex;
//     justify-content: space-between;
//     padding: 5px 10px;
// `
//
// const LikeCommentWrapper = styled.div`
//     display: flex;
//     gap: 10px;
//     align-items: center;
//     font-size: 12px;
//     color: white;
// `
//
// const LikeWrapper = styled.div`
//     display: flex;
//     gap: 5px;
//     align-items: center;
//     font-size: 12px;
// `
//
// const CommentsWrapper = styled.div`
//     display: flex;
//     gap: 5px;
//     align-items: center;
//     font-size: 12px;
//     color: white;
// `
//
// const ShowMoreButton = styled.div`
//     display: inline-block;
//     margin-left: 16px;
//     margin-bottom: 8px;
//     font-size: 13px;
//     color: #fff;
//     cursor: pointer;
//     background: none;
//     border: none;
//     padding: 0;
//
//     &:hover {
//         text-decoration: underline;
//     }
// `
//
// const ReportDeleteButton = styled.div`
//     font-size: 12px;
//     color: white;
//     cursor: pointer;
//     transition: text-decoration 0.2s ease-in-out;
//
//     &:hover {
//         text-decoration: underline;
//     }
// `
//
// const ImageWrapper = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin: 10px auto;
// `
//
// const ThumbnailsWrapper = styled.div`
//     width: 600px;
//     display: flex;
//     flex-direction: row;
//     justify-content: start;
//     align-content: start;
//     gap: 10px;
//     margin: 10px 0;
// `
//
// const Thumbnail = styled.img`
//     width: 100px;
//     height: 100px;
//     border-radius: 4px;
//     object-fit: cover;
// `
// const MainImage = styled.img`
//     width: 400px;
//     height: 400px;
//     border-radius: 8px;
//     object-fit: cover;
// `
//
// interface ReviewDebateCardData {
//   type: 'review' | 'debate'
//   data: Review | Debate
//   maxLength?: number // 기본값: 리뷰 500, 토론 5000
//   previewLength?: number // 기본값: 200
// }
//
// interface ReviewCardProps {
//   type: 'review'
//   data: Review
//   maxLength: 500
//   previewLength?: 200 // 기본값: 200
// }
//
// const ReviewDebateCard: React.FC<ReviewDebateCardData> =
//   ({ type, data, maxLength = type === 'review' ? 500 : 5000, previewLength = 200
//    }) => {
//
//     const [expanded, setExpanded] = useState(false)
//     const [spoilerRevealed, setSpoilerRevealed] = useState(false)
//
//
//     // 본문 길이 제한
//     const limitedContent = data.content.slice(0, maxLength)
//     const isLong = limitedContent.length > previewLength
//     const displayContent = expanded ? limitedContent : limitedContent.slice(0, previewLength)
//
//     // 스포일러 처리
//     const isBlur = data.isSpoiler && !spoilerRevealed
//
//     // 카드 클릭 핸들러 (토론장 이동)
//     const handleCardClick = () => {
//       if (type === 'debate') {
//         // 토론장으로 이동하는 로직 추가
//         console.log('토론장으로 이동:', data.id)
//         // 예: navigate(`/debate/${data.id}`)
//       }
//       if (type === 'review') {
//         // 리뷰 상세 페이지로 이동하는 로직 추가
//         console.log('리뷰 상세 페이지로 이동:', data.reviewId)
//         // 예: navigate(`/review/${data.reviewId}`)
//       }
//     }
//
//     // const imageList = images && images.length > 0 ? images : []
//
//     return (
//       <Wrapper $type={type} onClick={handleCardClick}>
//         <Header>
//           <UserCard>
//             <div style={{width: 30, height: 30, borderRadius: '50%', backgroundColor: '#f0f0f0'}}/>
//             <div>
//               <div style={{fontSize: 12}}>{data.member.nickname}</div>
//               <div style={{fontSize: 8}}>{data.createdAt}</div>
//             </div>
//             {rating !== undefined && (
//               <div style={{marginLeft: 8}}>
//                 <StarRating rating={rating}/>
//               </div>
//             )}
//           </UserCard>
//         </Header>
//         {/* 이미지 렌더링 */}
//         {imageList.length === 1 && (
//           <ImageWrapper>
//             <MainImage src={imageList[0] || PLACEHOLDER} alt="review"/>
//           </ImageWrapper>
//         )}
//         {imageList.length > 1 && (
//           <ImageWrapper>
//             <MainImage src={imageList[0] || PLACEHOLDER} alt="review" style={{marginTop: 4}}/>
//             <ThumbnailsWrapper>
//               {imageList.slice(1, 5).map((img, idx) => (
//                 <Thumbnail key={idx} src={img || PLACEHOLDER} alt={`thumb${idx}`}/>
//               ))}
//             </ThumbnailsWrapper>
//           </ImageWrapper>
//         )}
//         {/* 본문 */}
//         <BodyContents $blur={isBlur}>
//           {displayContent}
//           {isBlur && (
//             <SpoilerWarning>
//               스포일러 주의!{' '}
//               <ShowMoreButton
//                 onClick={e => {
//                   e.stopPropagation()
//                   setSpoilerRevealed(true)
//                 }}
//               >내용 보기
//               </ShowMoreButton>
//             </SpoilerWarning>
//           )}
//         </BodyContents>
//         {/* 더보기/접기 버튼 */}
//         {isLong && !expanded && !isBlur && (
//           <ShowMoreButton
//             style={{marginLeft: 16, marginBottom: 8}}
//             onClick={e => {
//               e.stopPropagation()
//               setExpanded(true)
//             }}
//           >...더보기</ShowMoreButton>
//         )}
//         {isLong && expanded && !isBlur && (
//           <ShowMoreButton
//             style={{marginLeft: 16, marginBottom: 8}}
//             onClick={e => {
//               e.stopPropagation()
//               setExpanded(false)
//             }}
//           >접기</ShowMoreButton>
//         )}
//         {imageList.length > 1 && (
//           <ImageWrapper>
//             <ThumbnailsWrapper>
//               {imageList.slice(1, 5).map((img, idx) => (
//                 <Thumbnail key={idx} src={img || PLACEHOLDER} alt={`thumb${idx}`}/>
//               ))}
//             </ThumbnailsWrapper>
//           </ImageWrapper>
//         )}
//         <Footer>
//           <LikeCommentWrapper>
//             <LikeWrapper>
//               <Heart size={15} color="red" fill="red"/>
//               <span>{likes}</span>
//             </LikeWrapper>
//             {comments !== undefined && (
//               <CommentsWrapper>
//                 <MessageSquareText size={15} color="white"/>
//                 <span>{comments}</span>
//               </CommentsWrapper>
//             )}
//           </LikeCommentWrapper>
//           <ReportDeleteButton
//             // onClick={isMyPost ? onDelete : onReport}
//           >
//             {/*토론 글은 수정하기 버튼 추가되야함*/}
//             {isMyPost ? '삭제' : '신고'}
//           </ReportDeleteButton>
//         </Footer>
//       </Wrapper>
//     )
//   }
//
// export default ReviewDebateCard
