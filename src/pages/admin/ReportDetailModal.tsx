import React from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px; /* 모달 주변 여백 추가 */
`

const ModalBox = styled.div`
  position: relative;
  background: #1c1c2b;
  color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 700px; /* 약간 더 넓게 */
  max-width: 90%;
  max-height: 90vh; /* 최대 높이 설정 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow-y: auto; /* 세로 스크롤 추가 */

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`

const CloseButton = styled.button`
  position: sticky; /* fixed에서 sticky로 변경 */
  top: 16px;
  right: 16px;
  float: right; /* 우측 정렬 */
  background: transparent;
  border: none;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s ease;
  z-index: 1;

  &:hover {
    color: #fff;
  }
`

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #ffcc00;
  clear: both; /* float 해제 */
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`

const Label = styled.span`
  font-weight: bold;
  color: #ccc;
  margin-bottom: 0.5rem;
  display: block; /* 블록 요소로 변경 */
`

const Value = styled.span`
  color: white;
`

const ContentBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px; /* 개별 컨텐츠 박스 최대 높이 */
  overflow-y: auto; /* 개별 스크롤 */

  /* HTML 컨텐츠 스타일링 */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 0.5rem 0;
    display: block; /* 이미지를 블록 요소로 */
  }

  p {
    margin: 0.5rem 0;
  }

  strong {
    font-weight: bold;
  }

  figure {
    margin: 1rem 0;
    text-align: center;

    img {
      max-height: 200px; /* 이미지 최대 높이 제한 */
      width: auto;
      object-fit: contain; /* 이미지 비율 유지 */
    }
  }

  /* 컨텐츠 박스 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  position: sticky; /* 하단에 고정 */
  bottom: 0;
  background: #1c1c2b; /* 배경색 추가 */
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const Button = styled.button<{ disabled?: boolean }>`
  background: transparent;
  color: #4ecdc4;
  border: 1px solid #4ecdc4;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(78, 205, 196, 0.1);
  }

  &:disabled {
    color: #888;
    border-color: #666;
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
  }
`
// HTML 태그를 제거하고 텍스트만 추출하는 함수
const stripHtmlTags = (html: string): string => {
  if (!html) return ''

  // HTML 태그 제거
  const stripped = html.replace(/<[^>]*>/g, '')

  // HTML 엔티티 디코딩
  const decoded = stripped
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

  return decoded.trim()
}

// HTML 컨텐츠인지 확인하는 함수
const isHtmlContent = (content: string): boolean => {
  return content.includes('<') && content.includes('>')
}

interface ReportDetailModalProps {
  isOpen: boolean
  report: any
  onClose: () => void
  onAction: (reportId: number, action: '경고' | '정지' | '차단' | '기각') => void
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  isOpen,
  report,
  onClose,
  onAction,
}) => {
  if (!isOpen || !report) return null

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
        <Title>신고 상세 정보</Title>

        <InfoRow>
          <Label>신고자</Label>
          <Value>{report.reporterNickname}</Value>
        </InfoRow>
        <InfoRow>
          <Label>피신고자</Label>
          <Value>{report.targetNickname}</Value>
        </InfoRow>
        <InfoRow>
          <Label>신고일</Label>
          <Value>{new Date(report.createdAt).toLocaleString()}</Value>
        </InfoRow>
        <InfoRow>
          <Label>유형</Label>
          <Value>{report.type}</Value>
        </InfoRow>
        <InfoRow>
          <Label>피신고자 상태</Label>
          <Value>{report.targetStatus}</Value>
        </InfoRow>
        <InfoRow>
          <Label>경고 / 정지 횟수</Label>
          <Value>
            {report.warningCount} / {report.suspensionCount}
          </Value>
        </InfoRow>

        <Label>신고 내용</Label>
        <ContentBox>{report.content}</ContentBox>

        {report.targetTitle && (
          <>
            <Label>신고받은 글 제목</Label>
            <ContentBox>{report.targetTitle}</ContentBox>
          </>
        )}

        <Label>신고받은 글 내용</Label>
        {isHtmlContent(report.targetContent) ? (
          <ContentBox dangerouslySetInnerHTML={{ __html: report.targetContent || '내용 없음' }} />
        ) : (
          <ContentBox>{report.targetContent || '내용 없음'}</ContentBox>
        )}

        <ActionButtons>
          <Button
            disabled={report.handled === '처리'}
            onClick={() => onAction(report.reportId, '경고')}
          >
            경고
          </Button>
          <Button
            disabled={report.handled === '처리'}
            onClick={() => onAction(report.reportId, '정지')}
          >
            정지
          </Button>
          <Button
            disabled={report.handled === '처리'}
            onClick={() => onAction(report.reportId, '차단')}
          >
            차단
          </Button>
          <Button
            disabled={report.handled === '처리'}
            onClick={() => onAction(report.reportId, '기각')}
          >
            기각
          </Button>
        </ActionButtons>
      </ModalBox>
    </Overlay>
  )
}

export default ReportDetailModal
