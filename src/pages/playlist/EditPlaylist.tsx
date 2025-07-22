import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Plus, Lock, LockOpen, X, ImageIcon } from 'lucide-react'
import BaseButton from '../../components/common/BaseButton'
import BaseInput from '@/components/common/BaseInput'
import MovieSearchModal from '../../components/feature/MovieSearchModal'
import { getPlaylistDetail, updatePlaylist } from '../../services/playlist'
import { useAuth } from '../../context/AuthContext'

interface Movie {
  tmdbId: number
  title: string
  releaseDate: string
  image: string
}

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Container = styled.div`
  color: white;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
`

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
  animation: ${fadeIn} 0.5s ease;
`

const FormSection = styled.div`
  margin-bottom: 1.5rem;
  animation: ${slideUp} 0.5s ease;
`

const Label = styled.label`
  display: block;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #fff;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: #ff7849;
  }
`

const PrivacyToggle = styled.button<{ $isPrivate: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;

  &:hover {
    border-color: #ff7849;
    background: rgba(255, 120, 73, 0.1);
  }

  svg {
    color: ${props => (props.$isPrivate ? '#ff7849' : '#aaa')};
  }
`

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  box-sizing: border-box;
  animation: ${slideUp} 0.5s ease;
`

const MovieCard = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  animation: ${fadeInUp} 0.3s ease;
  box-sizing: border-box;

  &:hover {
    border-color: #ff7849;
    transform: translateY(-4px);
  }
`

const AddMovieCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed #444;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #aaa;
  box-sizing: border-box;

  &:hover {
    border-color: #ff7849;
    color: #ff7849;
    transform: translateY(-4px);
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`

const ImageSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.8rem;
  text-align: center;
  flex-direction: column;
  gap: 0.5rem;
`

const MovieImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${props => (props.$loaded ? 'block' : 'none')};
`

const NoImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.8rem;
  text-align: center;
  flex-direction: column;
  gap: 0.5rem;
`

const MovieInfo = styled.div`
  padding: 0.5rem;
`

const MovieTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MovieYear = styled.span`
  font-size: 0.8rem;
  color: #aaa;
`

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 0, 0, 0.7);
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  animation: ${fadeIn} 0.5s ease;
`

const SelectedCount = styled.div`
  text-align: right;
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;
  margin: 4rem 0;
`

const ErrorMessage = styled.div`
  text-align: center;
  color: #ff4444;
  font-size: 1.1rem;
  margin: 4rem 0;
`

// 이미지 로더 컴포넌트
const ImageLoader: React.FC<{
  src: string
  alt: string
  onError?: () => void
}> = ({ src, alt, onError }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setLoaded(true)
  }

  const handleError = () => {
    setError(true)
    setLoaded(false)
    onError?.()
  }

  return (
    <ImageContainer>
      {!src || src === 'null' || src.trim() === '' ? (
        <NoImagePlaceholder>
          <ImageIcon size={24} />
          <span>포스터 없음</span>
        </NoImagePlaceholder>
      ) : (
        <>
          {!loaded && !error && <ImageSkeleton>이미지 로딩 중</ImageSkeleton>}

          {!error && (
            <MovieImage
              src={src}
              alt={alt}
              $loaded={loaded}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}

          {error && (
            <NoImagePlaceholder>
              <ImageIcon size={24} />
              <span>포스터 없음</span>
            </NoImagePlaceholder>
          )}
        </>
      )}
    </ImageContainer>
  )
}

const EditPlaylist: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [title, setTitle] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 기존 플레이리스트 정보 로드
  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (!id) return

      setLoading(true)
      try {
        const response = await getPlaylistDetail(id, 0, 1000)

        if (response.success) {
          const playlist = response.data

          // 권한 체크
          if (!user || playlist.nickname !== user.nickname) {
            alert('수정 권한이 없습니다.')
            navigate(`/playlist/${id}`, { replace: true }) // replace 추가
            return
          }

          // 폼 데이터 설정
          setTitle(playlist.title)
          setIsPrivate(playlist.hidden || false)

          // 영화 데이터 변환
          const movies: Movie[] = playlist.movies.content.map(movie => ({
            tmdbId: movie.movieId,
            title: movie.title,
            releaseDate: movie.releaseDate || '',
            image: movie.posterUrl || '',
          }))

          setSelectedMovies(movies)
          console.log(movies)
        } else {
          setError(response.message || '플레이리스트를 불러올 수 없습니다.')
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '플레이리스트를 불러오는 중 오류가 발생했습니다.')
        console.error('Error fetching playlist:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchPlaylistData()
    } else {
      navigate('/login', { replace: true }) // replace 추가
    }
  }, [id, user, isAuthenticated, navigate])

  // 선택된 영화 제거
  const removeSelectedMovie = (tmdbId: number) => {
    setSelectedMovies(prev => prev.filter(m => m.tmdbId !== tmdbId))
  }

  // 영화 추가 버튼 클릭
  const handleAddMovie = () => {
    setIsModalOpen(true)
  }

  // 모달에서 영화 선택 완료
  const handleMovieConfirm = (movies: Movie[]) => {
    setSelectedMovies(prev => [...prev, ...movies])
    setIsModalOpen(false)
  }

  // 취소 버튼 클릭
  const handleCancel = () => {
    navigate(`/playlist/${id}`, { replace: true }) // replace 추가
  }

  // 플레이리스트 수정
  const handleUpdatePlaylist = async () => {
    if (!isAuthenticated || !user) {
      alert('로그인이 필요합니다.')
      navigate('/login', { replace: true }) // replace 추가
      return
    }

    if (!title.trim()) {
      alert('플레이리스트 제목을 입력해주세요.')
      return
    }

    if (selectedMovies.length === 0) {
      alert('영화를 최소 1개 이상 선택해주세요.')
      return
    }

    setUpdating(true)

    try {
      const playlistData = {
        title: title.trim(),
        hidden: isPrivate,
        movies: selectedMovies.map(movie => ({
          tmdbId: movie.tmdbId,
          posterUrl: movie.image,
          title: movie.title,
          releaseDate: movie.releaseDate || null,
        })),
      }

      const response = await updatePlaylist(id!, playlistData)

      if (response.success) {
        alert('플레이리스트가 성공적으로 수정되었습니다!')
        navigate(`/playlist/${id}`, { replace: true }) // replace 추가
      } else {
        alert(response.message || '플레이리스트 수정에 실패했습니다.')
      }
    } catch (err: any) {
      console.error('Update playlist error:', err)
      alert(err.response?.data?.message || '플레이리스트 수정 중 오류가 발생했습니다.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingMessage>플레이리스트 정보를 불러오는 중...</LoadingMessage>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <BaseButton variant="orange" onClick={() => navigate('/playlist', { replace: true })}>
            플레이리스트 목록으로
          </BaseButton>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Title>플레이리스트 수정</Title>

      <FormSection>
        <Label>플레이리스트 제목</Label>
        <BaseInput
          fullWidth
          type="text"
          placeholder="플레이리스트 제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={50}
        />
      </FormSection>

      <FormSection>
        <Label>공개 여부</Label>
        <PrivacyToggle $isPrivate={isPrivate} onClick={() => setIsPrivate(!isPrivate)}>
          {isPrivate ? <Lock size={20} /> : <LockOpen size={20} />}
          {isPrivate ? '비공개' : '공개'}
        </PrivacyToggle>
      </FormSection>

      <FormSection>
        <Label>선택된 영화</Label>
        <SelectedCount>총 {selectedMovies.length}개</SelectedCount>
        <MovieGrid>
          <AddMovieCard onClick={handleAddMovie}>
            <Plus size={24} />
            <span>영화 추가</span>
          </AddMovieCard>
          {selectedMovies.map(movie => (
            <MovieCard key={movie.tmdbId}>
              <ImageLoader
                src={movie.image}
                alt={movie.title}
                onError={() => console.log(`이미지 로딩 실패: ${movie.title}`)}
              />
              <MovieInfo>
                <MovieTitle>{movie.title}</MovieTitle>
                <MovieYear>{movie.releaseDate?.slice(0, 4) || '미정'}</MovieYear>
              </MovieInfo>
              <RemoveButton onClick={() => removeSelectedMovie(movie.tmdbId)}>
                <X size={16} />
              </RemoveButton>
            </MovieCard>
          ))}
        </MovieGrid>
      </FormSection>

      <ButtonContainer>
        <BaseButton variant="dark" onClick={handleCancel} disabled={updating}>
          취소
        </BaseButton>
        <BaseButton
          variant="orange"
          onClick={handleUpdatePlaylist}
          disabled={updating || !title.trim() || selectedMovies.length === 0}
        >
          {updating ? '수정 중...' : '수정하기'}
        </BaseButton>
      </ButtonContainer>

      <MovieSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleMovieConfirm}
        selectedMovieIds={selectedMovies.map(m => m.tmdbId)}
      />
    </Container>
  )
}

export default EditPlaylist
