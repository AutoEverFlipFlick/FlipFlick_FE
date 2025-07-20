import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Search } from 'lucide-react'
import AdminLayout from './AdminLayout'
import ReportDetailModal from './ReportDetailModal'
import { fetchReports, handleReport } from '@/services/admin'
import { useDebounce } from 'use-debounce'
import Swal from 'sweetalert2'

export interface ReportType {
  reportId: number
  reporterNickname: string
  targetNickname: string
  type: string
  content: string
  targetTitle: string | null
  targetContent: string
  handled: string
  createdAt: string
  warningCount: number
  suspensionCount: number
  targetStatus: string
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e);
  color: white;
  padding: 0.2rem 2rem 2rem 2rem;
`

const Cell = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideIn} 0.8s ease-out;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #9c88ff, #c084fc, #b490ca);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const FilterSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  option {
    color: black;
  }
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.8s ease-out;
`

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  outline: none;
  ::placeholder {
    color: #aaa;
  }
`

const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${fadeIn} 0.8s ease-out;
`

const ReportHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr 1fr 1.8fr;
  padding: 0.75rem 1rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.85rem;
  color: #ccc;
`

const ReportItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr 1fr 1.8fr;
  align-items: center;
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.2s ease; /* ✅ 부드러운 효과 */

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.1);
  }
`

const Status = styled.div<{ status: string }>`
  font-weight: 600;
  color: ${({ status }) => {
    switch (status) {
      case '처리':
        return '#51cf66'
      case '미처리':
        return '#999'
      default:
        return '#fff'
    }
  }};
`

const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  flex-wrap: nowrap;
  justify-content: center;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`

const PageButton = styled.button<{ $active?: boolean }>`
  background: ${props => (props.$active ? '#4ecdc4' : 'rgba(255, 255, 255, 0.1)')};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
`

const ReportManagement: React.FC = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('전체')
  const [selectedReport, setSelectedReport] = useState<any | null>(null)
  const [reports, setReports] = useState<ReportType[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [debouncedSearch] = useDebounce(search, 300)
  const pagesPerGroup = 10
  const currentGroup = Math.floor((page - 1) / pagesPerGroup) // 0부터 시작
  const startPage = currentGroup * pagesPerGroup + 1
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages)

  const handleReportAction = async (
    reportId: number,
    action: '경고' | '정지' | '차단' | '기각',
  ) => {
    try {
      const confirm = await Swal.fire({
        title: `${action} 처리할까요?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      })

      if (!confirm.isConfirmed) return

      await handleReport(reportId, action)

      Swal.fire('처리 완료', `${action} 처리되었습니다.`, 'success')

      // 리스트 갱신
      const data = await fetchReports(page - 1, 10, debouncedSearch, filter)
      setReports(data.content)
      setTotalPages(data.totalPages)

      // 모달이 떠 있는 경우, 해당 report 정보도 갱신
      const updated = data.content.find((r: ReportType) => r.reportId === reportId)
      if (selectedReport && selectedReport.reportId === reportId && updated) {
        setSelectedReport(updated)
      }
    } catch (err) {
      console.error('신고 처리 실패:', err)
      Swal.fire('오류', '신고 처리 중 오류가 발생했습니다.', 'error')
    }
  }

  useEffect(() => {
    const loadReports = async () => {
      const data = await fetchReports(page - 1, 10, debouncedSearch, filter)
      setReports(data.content)
      setTotalPages(data.totalPages)
    }
    loadReports()
  }, [page, debouncedSearch, filter])

  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>Report</Title>
          <FilterSelect value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="전체">전체</option>
            <option value="처리">처리</option>
            <option value="미처리">미처리</option>
          </FilterSelect>
        </Header>

        <SearchBar>
          <Search size={18} color="#aaa" style={{ marginRight: '0.5rem' }} />
          <Input
            type="text"
            placeholder="신고자 또는 피신고자 닉네임 검색"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </SearchBar>

        <ReportList>
          <ReportHeader>
            <div>신고일</div>
            <div>신고자</div>
            <div>피신고자</div>
            <div>유형</div>
            <div>신고내용</div>
            <div>상태</div>
            <div>관리</div>
          </ReportHeader>
          {reports.map(report => (
            <ReportItem key={report.reportId} onClick={() => setSelectedReport(report)}>
              <Cell>{new Date(report.createdAt).toLocaleDateString()}</Cell>
              <Cell>{report.reporterNickname}</Cell>
              <Cell>{report.targetNickname}</Cell>
              <Cell>{report.type}</Cell>
              <Cell>{report.content}</Cell>
              <Status status={report.handled}>{report.handled}</Status>
              <ActionButtons>
                {['경고', '정지', '차단', '기각'].map(action => (
                  <Button
                    key={action}
                    disabled={report.handled === '처리'}
                    onClick={e => {
                      e.stopPropagation()
                      handleReportAction(
                        report.reportId,
                        action as '경고' | '정지' | '차단' | '기각',
                      )
                    }}
                  >
                    {action}
                  </Button>
                ))}
              </ActionButtons>
            </ReportItem>
          ))}
        </ReportList>

        <Pagination>
          {/* 이전 그룹으로 이동 */}
          {startPage > 1 && <PageButton onClick={() => setPage(startPage - 1)}>&lt;</PageButton>}

          {/* 현재 그룹의 페이지 버튼들 */}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const pageNumber = startPage + i
            return (
              <PageButton
                key={pageNumber}
                $active={page === pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </PageButton>
            )
          })}

          {/* 다음 그룹으로 이동 */}
          {endPage < totalPages && (
            <PageButton onClick={() => setPage(endPage + 1)}>&gt;</PageButton>
          )}
        </Pagination>

        {selectedReport && (
          <ReportDetailModal
            isOpen={!!selectedReport}
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onAction={handleReportAction}
          />
        )}
      </Container>
    </AdminLayout>
  )
}

export default ReportManagement
