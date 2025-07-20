import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Search } from 'lucide-react'
import AdminLayout from './AdminLayout'
import { fetchMembers, updateMemberStatus } from '@/services/admin'
import Swal from 'sweetalert2'
import { useDebounce } from 'use-debounce'

interface Member {
  memberId: number
  email: string
  nickname: string
  popcornGrade: string
  createdAt: string
  status: string
  reviewCount: number
  postCount: number
  warnCount: number
  blockCount: number
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

const Header = styled.div`
  margin-bottom: 2rem;
  animation: ${slideIn} 0.8s ease-out;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #5ee7df, #b490ca, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${fadeIn} 0.8s ease-out;
`

const UserHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 0.7fr 1fr 0.7fr 0.7fr 0.7fr 1.6fr;
  padding: 0.75rem 1rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.85rem;
  color: #ccc;
`

const UserItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr 0.7fr 1fr 0.7fr 0.7fr 0.7fr 1.6fr;
  align-items: center;
  color: #fff;
  font-size: 0.9rem;
`

const Label = styled.div`
  font-weight: 600;
`

const Status = styled.div<{ status: string }>`
  font-weight: 600;
  color: ${({ status }) => {
    switch (status) {
      case '정상':
        return '#51cf66'
      case '정지':
        return '#ffa94d'
      case '차단':
        return '#ff6b6b'
      case '탈퇴':
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
`

const Cell = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0rem 0.5rem;
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

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [members, setMembers] = useState<Member[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [debouncedSearch] = useDebounce(search, 300)

  const renderPageButtons = () => {
    const pageButtons = []

    // 한 번에 보여줄 최대 페이지 버튼 개수
    const maxPageButtons = 10
    const startPage = Math.floor((page - 1) / maxPageButtons) * maxPageButtons + 1
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages)

    if (startPage > 1) {
      pageButtons.push(
        <PageButton key="prev-group" onClick={() => setPage(startPage - 1)}>
          &lt;
        </PageButton>,
      )
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <PageButton key={i} $active={page === i} onClick={() => setPage(i)}>
          {i}
        </PageButton>,
      )
    }

    if (endPage < totalPages) {
      pageButtons.push(
        <PageButton key="next-group" onClick={() => setPage(endPage + 1)}>
          &gt;
        </PageButton>,
      )
    }

    return pageButtons
  }

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetchMembers(page - 1, 10, debouncedSearch)
        setMembers(res.data.content)
        setTotalPages(res.data.totalPages)
      } catch (err) {
        console.error('회원 목록 조회 실패:', err)
      }
    }
    loadMembers()
  }, [page, debouncedSearch])

  const handleStatusUpdate = async (memberId: number, status: string) => {
    try {
      const confirm = await Swal.fire({
        title: `${status} 처리할까요?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      })

      if (confirm.isConfirmed) {
        await updateMemberStatus(memberId, status)
        Swal.fire('처리 완료', `${status} 처리되었습니다.`, 'success')
        // 리스트 갱신
        const res = await fetchMembers(page - 1, 10, search)
        setMembers(res.data.content)
        setTotalPages(res.data.totalPages)
      }
    } catch (error) {
      console.error(`${status} 실패`, error)
      Swal.fire('오류', '처리 중 오류가 발생했습니다.', 'error')
    }
  }

  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>User</Title>
        </Header>

        <SearchBar>
          <Search size={18} color="#aaa" style={{ marginRight: '0.5rem' }} />
          <Input
            type="text"
            placeholder="닉네임 또는 이메일로 검색"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </SearchBar>

        <UserList>
          <UserHeader>
            <div>이메일</div>
            <div>닉네임</div>
            <div>등급</div>
            <div>가입일</div>
            <div>상태</div>
            <div>리뷰 / 글</div>
            <div>경고 / 정지</div>
            <div>관리</div>
          </UserHeader>
          {members.map(user => (
            <UserItem key={user.memberId}>
              <Cell title={user.email || '-'}>
                <Label>{user.email || '-'}</Label>
              </Cell>
              <Cell>{user.nickname}</Cell>
              <Cell>{user.popcornGrade}</Cell>
              <Cell>{user.createdAt.slice(0, 10)}</Cell>
              <Status status={user.status}>{user.status}</Status>
              <Cell>
                {user.reviewCount} / {user.postCount}
              </Cell>
              <Cell>
                {user.warnCount} / {user.blockCount}
              </Cell>
              <ActionButtons>
                <Button onClick={() => handleStatusUpdate(user.memberId, '경고')}>경고</Button>
                <Button onClick={() => handleStatusUpdate(user.memberId, '정지')}>정지</Button>
                <Button onClick={() => handleStatusUpdate(user.memberId, '차단')}>차단</Button>
                <Button onClick={() => handleStatusUpdate(user.memberId, '해제')}>해제</Button>
              </ActionButtons>
            </UserItem>
          ))}
        </UserList>

        <Pagination>{renderPageButtons()}</Pagination>
      </Container>
    </AdminLayout>
  )
}

export default UserManagement
