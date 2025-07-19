import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Search } from 'lucide-react'
import AdminLayout from './AdminLayout'
import ReportDetailModal from './ReportDetailModal'

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

const Button = styled.button`
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

  const dummyReports = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    date: `2024-07-${(i % 30) + 1}`,
    reporter: `Reporter${i + 1}`,
    target: `Target${i + 1}`,
    type: ['리뷰', '댓글', '게시글'][i % 3],
    content: '부적절한 언어 사용으로 신고합니다.',
    status: i % 2 === 0 ? '처리' : '미처리',
    targetStatus: ['활동중', '경고', '정지'][i % 3],
    warningCount: i % 4,
    suspensionCount: i % 2,
    postContent: '신고된 글 내용 예시입니다.',
  }))

  const filteredReports = dummyReports.filter(r => {
    const matchSearch = r.reporter.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filter === '전체' || r.status === filter
    return matchSearch && matchStatus
  })

  const reportsPerPage = 5
  const paginatedReports = filteredReports.slice((page - 1) * reportsPerPage, page * reportsPerPage)
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)

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
            placeholder="신고자 이름 검색..."
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
          {paginatedReports.map(report => (
            <ReportItem key={report.id} onClick={() => setSelectedReport(report)}>
              <div>{report.date}</div>
              <div>{report.reporter}</div>
              <div>{report.target}</div>
              <div>{report.type}</div>
              <div>{report.content}</div>
              <Status status={report.status}>{report.status}</Status>
              <ActionButtons>
                <Button>경고</Button>
                <Button>정지</Button>
                <Button>차단</Button>
                <Button>기각</Button>
              </ActionButtons>
            </ReportItem>
          ))}
        </ReportList>

        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton key={i + 1} $active={page === i + 1} onClick={() => setPage(i + 1)}>
              {i + 1}
            </PageButton>
          ))}
        </Pagination>

        {selectedReport && (
          <ReportDetailModal
            isOpen={!!selectedReport} // 또는 true / false
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </Container>
    </AdminLayout>
  )
}

export default ReportManagement
