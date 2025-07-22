import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Plus, Lock, LockOpen, X, ImageIcon } from 'lucide-react'
import BaseButton from '../../components/common/BaseButton'
import BaseInput from '@/components/common/BaseInput'
import MovieSearchModal from '../../components/feature/MovieSearchModal'
import { createPlaylist } from '../../services/playlist'
import { useAuth } from '../../context/AuthContext'
import Swal from 'sweetalert2'

interface Movie {
  tmdbId: number
  title: string
  releaseDate: string
  image: string
}

// 애니메이션 정의 - PlaylistDetail과 동일
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
  animation: ${fadeIn} 0.5s ease; /* 애니메이션 추가 */
`

const FormSection = styled.div`
  margin-bottom: 1.5rem;
  animation: ${slideUp} 0.5s ease; /* 애니메이션 추가 */
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
  animation: ${slideUp} 0.5s ease; /* PlaylistDetail과 동일한 애니메이션 */
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
    transform: translateY(-4px); /* PlaylistDetail과 동일한 호버 효과 */
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
    transform: translateY(-4px); /* PlaylistDetail과 동일한 호버 효과 */
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
  animation: ${fadeIn} 0.5s ease; /* 애니메이션 추가 */
`

const SelectedCount = styled.div`
  text-align: right;
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 1rem;
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

const CreatePlaylist: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [title, setTitle] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([])
  const [creating, setCreating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
  const handleCancel = async () => {
    // 내용이 있을 때만 확인 다이얼로그 표시
    if (title.trim() || selectedMovies.length > 0) {
      const result = await Swal.fire({
        title: '작성 취소',
        text: '작성 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '네, 취소합니다',
        cancelButtonText: '계속 작성',
        confirmButtonColor: '#6c757d',
        cancelButtonColor: '#FF7849',
        reverseButtons: true,
      })

      if (result.isConfirmed) {
        navigate('/playlist', { replace: true })
      }
    } else {
      navigate('/playlist', { replace: true })
    }
  }

  // 플레이리스트 생성 - 서비스 함수 사용
  const handleCreatePlaylist = async () => {
    if (!isAuthenticated || !user) {
      const result = await Swal.fire({
        title: '로그인이 필요합니다',
        text: '플레이리스트를 생성하려면 로그인이 필요합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '로그인하러 가기',
        cancelButtonText: '취소',
        confirmButtonColor: '#FF7849',
        cancelButtonColor: '#6c757d',
      })

      if (result.isConfirmed) {
        navigate('/login', { replace: true })
      }
      return
    }

    if (!title.trim()) {
      await Swal.fire({
        title: '제목 입력 필요',
        text: '플레이리스트 제목을 입력해주세요.',
        icon: 'warning',
        confirmButtonText: '확인',
        confirmButtonColor: '#FF7849',
      })
      return
    }

    if (selectedMovies.length === 0) {
      await Swal.fire({
        title: '영화 선택 필요',
        text: '영화를 최소 1개 이상 선택해주세요.',
        icon: 'warning',
        confirmButtonText: '확인',
        confirmButtonColor: '#FF7849',
      })
      return
    }

    // 생성 확인
    const result = await Swal.fire({
      title: '플레이리스트 생성',
      text: `"${title.trim()}" 플레이리스트를 생성하시겠습니까?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '생성하기',
      cancelButtonText: '취소',
      confirmButtonColor: '#FF7849',
      cancelButtonColor: '#6c757d',
    })

    if (!result.isConfirmed) return

    setCreating(true)

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

      const response = await createPlaylist(playlistData)

      if (response.success) {
        await Swal.fire({
          title: '생성 완료',
          text: '플레이리스트가 성공적으로 생성되었습니다!',
          icon: 'success',
          confirmButtonText: '확인',
          confirmButtonColor: '#FF7849',
        })
        navigate('/playlist', { replace: true })
      } else {
        await Swal.fire({
          title: '생성 실패',
          text: response.message || '플레이리스트 생성에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#FF7849',
        })
      }
    } catch (err: any) {
      console.error('Create playlist error:', err)
      let errorMessage = '플레이리스트 생성 중 오류가 발생했습니다.'

      // 에러 상태별 처리
      if (err.response?.status === 401) {
        errorMessage = '로그인이 필요합니다.'
      } else if (err.response?.status === 403) {
        errorMessage = '권한이 없습니다.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }

      await Swal.fire({
        title: '오류 발생',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '확인',
        confirmButtonColor: '#FF7849',
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Container>
      <Title>플레이리스트 만들기</Title>

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
        <BaseButton variant="red" onClick={handleCancel} disabled={creating}>
          취소
        </BaseButton>
        <BaseButton
          variant="orange"
          onClick={handleCreatePlaylist}
          disabled={creating || !title.trim() || selectedMovies.length === 0}
        >
          {creating ? '만드는 중...' : '만들기'}
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

export default CreatePlaylist
