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
`
const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`

const ModalBox = styled.div`
  position: relative;
  background: #1c1c2b;
  color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #ffcc00;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`

const Label = styled.span`
  font-weight: bold;
  color: #ccc;
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
  white-space: pre-wrap; // ✅ 줄바꿈 & 자동 줄바꿈 허용
  word-break: break-word; // ✅ 긴 단어도 줄바꿈 가능하게
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
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
        <ContentBox>{report.targetContent || '내용 없음'}</ContentBox>

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
