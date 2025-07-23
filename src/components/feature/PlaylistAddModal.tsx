// components/feature/PlaylistAddModal.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // 추가
import styled, { keyframes } from 'styled-components'
import { X, Plus, Lock, LockOpen, Bookmark } from 'lucide-react'
import BaseButton from '@/components/common/BaseButton'
import { getMyPlaylists, updatePlaylist, getPlaylistDetail } from '@/services/playlist'
import { useAuth } from '@/context/AuthContext'
import Swal from 'sweetalert2'

interface PlaylistData {
  playListId: number
  title: string
  nickname: string
  thumbnailUrl: string
  movieCount: number
  bookmarkCount: number
  hidden?: boolean
}

interface PlaylistAddModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: number
  movieTitle: string
  moviePosterUrl?: string // 추가
  movieReleaseDate?: string // 추가
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`

const ModalContainer = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  animation: ${slideUp} 0.3s ease;
  border: 1px solid #333;
`

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`

const ModalBody = styled.div`
  padding: 20px 24px;
  max-height: 400px;
  overflow-y: auto;
`

const MovieInfo = styled.div`
  background: rgba(254, 106, 60, 0.1);
  border: 1px solid rgba(254, 106, 60, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  color: #fe6a3c;
  font-size: 0.9rem;
  text-align: center;
`

const PlaylistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PlaylistItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid ${({ $selected }) => ($selected ? '#fe6a3c' : '#333')};
  border-radius: 8px;
  background: ${({ $selected }) =>
    $selected ? 'rgba(254, 106, 60, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #fe6a3c;
    background: rgba(254, 106, 60, 0.05);
  }
`

const PlaylistThumbnail = styled.img`
  width: 40px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
  background: #333;
`

const PlaylistThumbnailPlaceholder = styled.div`
  width: 40px;
  height: 60px;
  border-radius: 4px;
  background: #333;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`

const PlaylistDetails = styled.div`
  flex: 1;
`

const PlaylistTitle = styled.div`
  color: #fff;
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 0.95rem;
`

const PlaylistMeta = styled.div`
  color: #aaa;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
`

const PrivacyIcon = styled.div`
  color: #aaa;
  display: flex;
  align-items: center;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #aaa;
  padding: 40px 0;
  font-size: 0.9rem;
`

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 40px 0;

  p {
    margin: 0 0 16px 0;
    font-size: 0.9rem;
  }
`

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #333;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

const PlaylistAddModal: React.FC<PlaylistAddModalProps> = ({
  isOpen,
  onClose,
  movieId,
  movieTitle,
  moviePosterUrl = '',
  movieReleaseDate = null,
}) => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate() // useNavigate 훅 추가
  const [playlists, setPlaylists] = useState<PlaylistData[]>([])
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  // 내 플레이리스트 목록 조회
  useEffect(() => {
    const fetchMyPlaylists = async () => {
      if (!isOpen || !isAuthenticated) return

      setLoading(true)
      try {
        const response = await getMyPlaylists(0, 100) // 최대 100개까지 조회

        if (response.success) {
          setPlaylists(response.data.content)
        } else {
          console.error('플레이리스트 조회 실패:', response.message)
        }
      } catch (error) {
        console.error('플레이리스트 조회 에러:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyPlaylists()
  }, [isOpen, isAuthenticated])

  // 모달 닫기
  const handleClose = () => {
    setSelectedPlaylistId(null)
    onClose()
  }

  // 플레이리스트 선택
  const handleSelectPlaylist = (playlistId: number) => {
    setSelectedPlaylistId(playlistId)
  }

  // 날짜를 API 형식에 맞게 변환
  const formatDateToAPI = (dateString?: string | null): string => {
    if (!dateString) {
      // 날짜가 없으면 현재 날짜 사용
      return new Date().toISOString().split('T')[0]
    }

    // 이미 YYYY-MM-DD 형식인 경우
    const fullDateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (fullDateRegex.test(dateString)) {
      return dateString
    }

    // 연도만 있는 경우 (예: "2025")
    const yearOnlyRegex = /^\d{4}$/
    if (yearOnlyRegex.test(dateString)) {
      return `${dateString}-01-01` // 해당 연도의 1월 1일로 설정
    }

    // 다른 형식이면 현재 날짜 반환
    return new Date().toISOString().split('T')[0]
  }

  // 영화를 플레이리스트에 추가
  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) return

    setAdding(true)
    try {
      // 1. 먼저 선택된 플레이리스트의 상세 정보를 가져옴
      const playlistDetailResponse = await getPlaylistDetail(selectedPlaylistId.toString())

      if (!playlistDetailResponse.success) {
        throw new Error('플레이리스트 정보를 가져올 수 없습니다.')
      }

      const playlist = playlistDetailResponse.data

      // 플레이리스트 소유자 확인
      if (playlist.nickname !== user?.nickname) {
        await Swal.fire({
          title: '권한 없음',
          text: '본인이 만든 플레이리스트에만 영화를 추가할 수 있습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#fe6a3c',
        })
        return
      }

      const existingMovies = playlist.movies.content

      // 2. 이미 추가된 영화인지 확인
      const isAlreadyAdded = existingMovies.some(movie => movie.movieId === movieId)

      if (isAlreadyAdded) {
        await Swal.fire({
          title: '이미 추가된 영화',
          text: '이미 플레이리스트에 추가된 영화입니다.',
          icon: 'warning',
          confirmButtonText: '확인',
          confirmButtonColor: '#fe6a3c',
        })
        return
      }

      // 3. 기존 영화들을 EditPlaylist와 동일한 형태로 변환
      const existingMoviesForUpdate = existingMovies.map(movie => ({
        tmdbId: movie.movieId,
        posterUrl: movie.posterUrl, // 'string' 제거, 있는 그대로 사용
        title: movie.title,
        releaseDate: movie.releaseDate || null, // null 사용, 하드코딩 제거
      }))

      // 4. 새 영화 정보 추가 (EditPlaylist와 동일한 형태)
      const newMovie = {
        tmdbId: movieId,
        posterUrl: moviePosterUrl || '', // 빈 문자열 기본값
        title: movieTitle,
        releaseDate: formatDateToAPI(movieReleaseDate), // 날짜 형식 변환
      }

      // 5. EditPlaylist와 완전히 동일한 형식으로 데이터 구성
      const playlistData = {
        title: playlist.title.trim(), // trim 추가
        hidden: playlist.hidden || false,
        movies: [...existingMoviesForUpdate, newMovie],
      }

      console.log('전송할 데이터:', JSON.stringify(playlistData, null, 2)) // 디버깅용

      // 6. 플레이리스트 업데이트
      const response = await updatePlaylist(selectedPlaylistId.toString(), playlistData)

      if (response.success) {
        await Swal.fire({
          title: '추가 완료',
          text: `"${movieTitle}"이(가) 플레이리스트에 추가되었습니다.`,
          icon: 'success',
          confirmButtonText: '확인',
          confirmButtonColor: '#fe6a3c',
        })
        handleClose()
      } else {
        await Swal.fire({
          title: '추가 실패',
          text: response.message || '플레이리스트에 추가하는데 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#fe6a3c',
        })
      }
    } catch (err: any) {
      console.error('플레이리스트 추가 에러:', err) // 디버깅용
      console.error('에러 상세:', err.response?.data) // 추가 디버깅

      let errorMessage = '플레이리스트에 추가하는 중 오류가 발생했습니다.'

      if (err.response?.status === 403) {
        errorMessage =
          '플레이리스트에 영화를 추가할 권한이 없습니다. 본인이 만든 플레이리스트인지 확인해주세요.'
      } else if (err.response?.status === 401) {
        errorMessage = '로그인이 만료되었습니다. 다시 로그인해주세요.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }

      await Swal.fire({
        title: '추가 실패',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '확인',
        confirmButtonColor: '#fe6a3c',
      })
    } finally {
      setAdding(false)
    }
  }

  // 플레이리스트 생성 페이지로 이동하는 핸들러
  const handleCreatePlaylist = () => {
    handleClose() // 모달 닫기
    navigate('/createplaylist') // 플레이리스트 생성 페이지로 이동
  }

  if (!isOpen) return null

  return (
    <Overlay onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>플레이리스트에 추가</ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <MovieInfo>"{movieTitle}"을(를) 플레이리스트에 추가하시겠습니까?</MovieInfo>

          {loading ? (
            <LoadingMessage>플레이리스트를 불러오는 중...</LoadingMessage>
          ) : playlists.length === 0 ? (
            <EmptyMessage>
              <p>생성된 플레이리스트가 없습니다.</p>
              <BaseButton
                variant="orange"
                size="small"
                onClick={handleCreatePlaylist} // 핸들러 연결
              >
                플레이리스트 만들기
              </BaseButton>
            </EmptyMessage>
          ) : (
            <PlaylistList>
              {playlists.map(playlist => (
                <PlaylistItem
                  key={playlist.playListId}
                  $selected={selectedPlaylistId === playlist.playListId}
                  onClick={() => handleSelectPlaylist(playlist.playListId)}
                >
                  {playlist.thumbnailUrl ? (
                    <PlaylistThumbnail
                      src={playlist.thumbnailUrl}
                      alt={playlist.title}
                      onError={e => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <PlaylistThumbnailPlaceholder>
                      <Plus size={16} />
                    </PlaylistThumbnailPlaceholder>
                  )}

                  <PlaylistDetails>
                    <PlaylistTitle>{playlist.title}</PlaylistTitle>
                    <PlaylistMeta>
                      <span>영화 {playlist.movieCount}개</span>
                      <span>•</span>
                      <span>북마크 {playlist.bookmarkCount}개</span>
                      <PrivacyIcon>
                        {playlist.hidden ? <Lock size={12} /> : <LockOpen size={12} />}
                      </PrivacyIcon>
                    </PlaylistMeta>
                  </PlaylistDetails>
                </PlaylistItem>
              ))}
            </PlaylistList>
          )}
        </ModalBody>

        <ModalFooter>
          <BaseButton size="small" variant="dark" onClick={handleClose} disabled={adding}>
            취소
          </BaseButton>
          <BaseButton
            variant="orange"
            size="small"
            onClick={handleAddToPlaylist}
            disabled={!selectedPlaylistId || adding}
          >
            {adding ? '추가 중...' : '추가하기'}
          </BaseButton>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  )
}

export default PlaylistAddModal
