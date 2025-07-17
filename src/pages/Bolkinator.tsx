import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import BaseButton from '@/components/common/BaseButton'
import BaseContainer from '@/components/common/BaseContainer'
import BaseInput from '@/components/common/BaseInput'

// 지니 이미지 (상태별)
import GenieNormal from '@/assets/common/bolkinator_normal.png'
import GenieGomin from '@/assets/common/bolkinator_gomin.png'
import GenieGood from '@/assets/common/bolkinator_good.png'
import GenieBad from '@/assets/common/bolkinator_bad.png'

// 애니메이션 정의
const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
`
const shimmer = keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
`
const spin = keyframes`
    to { transform: rotate(360deg); }
`
const fadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`

// 레이아웃 컨테이너
const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #1f2937 0%, #000000 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
`
const Content = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    gap: 48px;
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 24px;
    }
`
const GenieArea = styled.div`
    flex: 1;
    text-align: center;
`
const GenieImage = styled.img`
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
`
const InteractiveArea = styled.div`
    flex: 1;
`
const Panel = styled(BaseContainer)`
    background: rgba(255, 255, 255, 0.9);
    padding: 24px;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
`

// 질문 말풍선
const QuestionBubble = styled.div`
    position: relative;
    background: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
    animation: ${fadeInUp} 0.2s ease-out both;
`
const QuestionNumber = styled.span`
    position: absolute;
    top: -12px;
    left: -12px;
    background: #1f2937;
    color: #fff;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
`
const QuestionText = styled.p`
    margin: 0;
    font-size: 1.25rem;
    color: #1f2937;
`
const OptionsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: ${fadeInUp} 0.15s ease-out both;
`

// 입력 행 & 필드
const InputRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    width: 100%;
    min-width: 0; /* flex overflow 방지 */
    animation: ${fadeInUp} 0.15s ease-out both;
`

const TextInputWrapper = styled.div`
    flex: 1 1 0%;
    min-width: 0;
    display: flex;
    align-items: stretch;

    > * {
        flex: 1 1 auto;
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
    }

    > * input,
    > * textarea,
    input,
    textarea {
        width: 100% !important;
    }
`

// 전송 버튼
const SendBtn = styled(BaseButton)`
    flex: 0 0 auto;
    width: auto;
    min-width: 72px;
    white-space: nowrap;
    @media (max-width: 480px) {
        min-width: 64px;
        padding-left: 12px;
        padding-right: 12px;
    }
`

// 추천 카드
const RecommendationContainer = styled.div`
    text-align: center;
    margin-bottom: 24px;
    animation: ${fadeInUp} 0.25s ease-out both;
`

// 포스터 로딩 스켈레톤 (추천 카드 이미지 자리)
const PosterSkeleton = styled.div`
    width: 100%;
    max-width: 300px;
    aspect-ratio: 2 / 3; /* 대략 세로형 포스터 비율 */
    border-radius: 8px;
    background: #e5e7eb;
    position: relative;
    margin: 0 auto 16px auto;
    overflow: hidden;
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.6) 50%,
                rgba(255, 255, 255, 0) 100%
        );
        animation: ${shimmer} 1.25s infinite;
    }
`

// 실제 포스터 이미지: 로드 후 fade-in
const PosterImage = styled.img<{ $loaded: boolean }>`
    width: 100%;
    max-width: 300px;
    border-radius: 8px;
    margin-bottom: 16px;
    opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
    animation: ${({ $loaded }) => ($loaded ? fadeIn : 'none')} 0.2s ease-out;
    transition: opacity 0.2s ease-out;
    pointer-events: ${({ $loaded }) => ($loaded ? 'auto' : 'none')};
`

const MovieTitle = styled.h3`
    font-size: 1.75rem;
    color: #1f2937;
    margin-bottom: 12px;
`
const ReasonText = styled.p`
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.6;
`

// 만족도 버튼
const SatisfactionButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
    animation: ${fadeInUp} 0.15s ease-out both;
`

// 완료 메시지 & 액션
const FinalMessage = styled.div`
    text-align: center;
    font-size: 1.25rem;
    color: #1f2937;
    margin-top: 24px;
    animation: ${fadeInUp} 0.25s ease-out both;
`

const DoneActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  animation: ${fadeInUp} 0.25s ease-out both;
`

// 로딩 UI (질문/추천 대기)
const SkeletonBase = styled.div<{ height?: string; width?: string; radius?: string }>`
    background: #e5e7eb;
    position: relative;
    overflow: hidden;
    width: ${({ width }) => width || '100%'};
    height: ${({ height }) => height || '16px'};
    border-radius: ${({ radius }) => radius || '4px'};
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.6) 50%,
                rgba(255, 255, 255, 0) 100%
        );
        animation: ${shimmer} 1.25s infinite;
    }
`
const LoadingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
    width: 100%;
`
const LoadingQuestionSkeleton = styled.div`
    width: 100%;
    max-width: 500px;
    animation: ${fadeInUp} 0.1s ease-out both;
    ${SkeletonBase} + ${SkeletonBase} {
        margin-top: 8px;
    }
`
const LoadingRecommendationSkeleton = styled.div`
    width: 100%;
    text-align: center;
    animation: ${fadeInUp} 0.1s ease-out both;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
`
const Spinner = styled.div`
    width: 32px;
    height: 32px;
    border: 4px solid rgba(31, 41, 55, 0.2);
    border-top-color: #1f2937;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    margin: 0 auto;
`
const LoadingText = styled.div`
    font-size: 0.875rem;
    color: #4b5563;
    text-align: center;
    margin-top: 8px;
`

// 서버 영화 추천 반환 타입 정의
type QuestionMsg = { type: 'question'; question: string; options: string[] | null }
type RecommendationMsg = {
    type: 'recommendation'
    title: string
    poster_url: string
    reason: string
    tmdb_id?: number | string
}
type SystemMsg = { type: 'message'; message: string }
type AnyMsg = QuestionMsg | RecommendationMsg | SystemMsg
type GenieMood = 'normal' | 'gomin' | 'good' | 'bad'

// 추천 상태 타입
interface RecommendationState {
    title: string
    poster: string
    reason: string
    tmdbId?: number
}

// 컴포넌트 본문
const Bolkinator: React.FC = () => {
    const ws = useRef<WebSocket | null>(null)

    // WebSocket이 사용자가 만족(예) 후 정상 종료된 것인지 추적
    const gracefulCloseRef = useRef(false)

    // UI 단계
    const [stage, setStage] = useState<'loading' | 'question' | 'recommendation' | 'satisfaction' | 'done'>('loading')

    // 질문 관련
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState<string[] | null>(null)
    const [questionNumber, setQuestionNumber] = useState(0)

    // 추천 결과
    const [recommendation, setRecommendation] = useState<RecommendationState | null>(null)

    // 추천 포스터 로딩 상태
    const [posterLoaded, setPosterLoaded] = useState(false)

    // 만족도 관련
    const [satisfactionQuestion, setSatisfactionQuestion] = useState('')
    const [finalMessage, setFinalMessage] = useState('')

    // 입력 / 로딩
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(false) // 서버 응답 대기

    // 지니 표정 상태
    const [genieMood, setGenieMood] = useState<GenieMood>('normal') // 첫 진입 normal

    // 만족 확정 여부
    const [isSatisfied, setIsSatisfied] = useState(false)

    // 지니 이미지 매핑
    const genieSrcMap: Record<GenieMood, string> = {
        normal: GenieNormal,
        gomin: GenieGomin,
        good: GenieGood,
        bad: GenieBad,
    }

    // 추천 정보가 바뀔 때 포스터 로딩 상태 리셋
    useEffect(() => {
        setPosterLoaded(false)
    }, [recommendation?.poster])

    // WebSocket 연결
    useEffect(() => {
        const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
        const socket = new WebSocket(`${proto}://bolkinator.flipflick.life/ws`)
        ws.current = socket

        socket.onopen = () => {
            console.log('WebSocket 연결됨')
            setStage('loading')
            setGenieMood('normal') // 첫 질문 오기 전까지 normal 유지
        }

        socket.onmessage = event => {
            setLoading(false)
            let msg: AnyMsg
            try {
                msg = JSON.parse(event.data)
            } catch (e) {
                console.error('JSON 파싱 실패.', e, '서버 응답:', event.data)
                return
            }

            if (msg.type === 'question') {
                const isFirst = questionNumber === 0

                // 만족 확정 전이라면 질문에 맞춰 표정 갱신
                if (!isSatisfied) {
                    if (isFirst) {
                        // 첫 질문은 normal 유지
                        setGenieMood(prev => (prev === 'bad' ? 'gomin' : 'normal'))
                    } else {
                        // 이후 질문은 고민(gomin)
                        setGenieMood(prev => (prev === 'good' ? 'good' : 'gomin'))
                    }
                }

                // 만족도 질문인지 판별
                if (msg.question.includes('마음에 드시나요')) {
                    setSatisfactionQuestion(msg.question)
                    setStage('satisfaction')
                } else {
                    setQuestionNumber(n => n + 1)
                    setQuestion(msg.question)
                    setOptions(msg.options)
                    setStage('question')
                }
            } else if (msg.type === 'recommendation') {
                if (!isSatisfied) {
                    setGenieMood(prev => (prev === 'good' ? 'good' : 'gomin'))
                }
                const recMsg = msg as RecommendationMsg
                const tmdbIdParsed =
                    recMsg.tmdb_id !== undefined
                        ? typeof recMsg.tmdb_id === 'string'
                            ? parseInt(recMsg.tmdb_id, 10)
                            : recMsg.tmdb_id
                        : undefined

                setRecommendation({
                    title: recMsg.title,
                    poster: recMsg.poster_url,
                    reason: recMsg.reason,
                    tmdbId: isNaN(Number(tmdbIdParsed)) ? undefined : Number(tmdbIdParsed),
                })
                setStage('recommendation')
            } else if (msg.type === 'message') {
                // 서버가 최종 시스템 메시지를 보냄
                // 만약 이미 사용자가 만족(예) 눌러 done 상태라면 메시지를 덧붙이기만
                setFinalMessage(prev => (prev ? `${prev}\n${msg.message}` : msg.message))
                // 서버가 message 보내고 close할 수 있으나, 우리는 stage를 여기서 강제 변경하지 않음
                if (!gracefulCloseRef.current) {
                    // 서버 쪽에서 에러 안내 메시지일 수 있음
                    setStage('done')
                }
            }
        }

        socket.onclose = () => {
            console.log('WebSocket 연결 종료')
            setLoading(false)
            if (gracefulCloseRef.current) {
                // 사용자가 만족 후 자연 종료 → UI 그대로 유지
                return
            }
            // 비정상 종료일 때만 안내
            setGenieMood('bad')
            setRecommendation(null)
            setFinalMessage('오늘은 영업 종료했으니, 다음에 찾아보도록 하거라!')
            setStage('done')
        }

        return () => {
            socket.close()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // 서버로 답변 전송
    const sendAnswer = (ans: string) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return
        ws.current.send(ans)
        setLoading(true)
        setStage('loading') // 응답 대기 중 로딩 화면 표시
        setInputValue('')
    }

    // 옵션 텍스트에서 번호 제거 ("1. 국내 ..." → "국내")
    const handleOptionClick = (opt: string) => {
        let ans = opt
        if (/^\d+\./.test(opt)) {
            const rest = opt.split('.')[1].trim()
            ans = rest.split(' ')[0]
        }
        sendAnswer(ans)
    }

    // 만족도 응답
    const handleSatisfaction = (ans: '예' | '아니오') => {
        // 서버에 먼저 전달 (통계/상태용)
        sendAnswer(ans)

        if (ans === '예') {
            // 만족 → good, 즉시 UI 완료 상태로 전환 (서버 close 기다리지 않음)
            setGenieMood('good')
            setIsSatisfied(true)
            gracefulCloseRef.current = true
            setStage('done')
        } else {
            // 불만족 → bad, 추천 비움, 이후 서버 새 질문 시 gomin으로 전환
            setGenieMood('bad')
            setIsSatisfied(false)
            setRecommendation(null)
            // stage 전환은 서버 응답(question/recommendation)에 맡김 → loading으로 이미 설정됨
        }
    }

    // 대화 종료 후 재시작(페이지 새로고침)
    const handleRestart = () => {
        window.location.reload()
    }

    // 상세 페이지 이동
    const handleGoDetail = () => {
        if (!recommendation?.tmdbId) return
        window.location.href = `/movie/detail/${recommendation.tmdbId}`
    }

    // 로딩 화면 렌더
    const renderLoading = () => (
        <LoadingWrapper>
            <LoadingQuestionSkeleton>
                <SkeletonBase height="24px" width="80%" radius="8px" />
                <SkeletonBase height="16px" width="50%" />
            </LoadingQuestionSkeleton>

            <LoadingRecommendationSkeleton>
                <SkeletonBase height="180px" width="180px" radius="8px" />
                <SkeletonBase height="20px" width="60%" />
                <SkeletonBase height="16px" width="90%" />
                <SkeletonBase height="16px" width="75%" />
            </LoadingRecommendationSkeleton>

            <Spinner />
            <LoadingText>고민이 되는구먼...</LoadingText>
        </LoadingWrapper>
    )

    // 추천 카드 렌더
    const renderRecommendationCard = () => {
        if (!recommendation) return null
        return (
            <RecommendationContainer>
                {/* 포스터: 로드 전 스켈레톤, 로드 후 이미지 */}
                {!posterLoaded && <PosterSkeleton aria-label="포스터 로딩중" />}
                <PosterImage
                    src={recommendation.poster}
                    alt={recommendation.title}
                    $loaded={posterLoaded}
                    onLoad={() => setPosterLoaded(true)}
                    onError={() => setPosterLoaded(true)} // 에러 시라도 스켈레톤 제거
                    style={{ display: posterLoaded ? 'inline-block' : 'none' }}
                />
                <MovieTitle>{recommendation.title}</MovieTitle>
                <ReasonText>{recommendation.reason}</ReasonText>
            </RecommendationContainer>
        )
    }

    return (
        <Container>
            <Content>
                {/* 지니 캐릭터 영역 */}
                <GenieArea>
                    <GenieImage src={genieSrcMap[genieMood]} alt={`Bolkinator ${genieMood}`} />
                </GenieArea>

                {/* 인터랙티브 패널 */}
                <InteractiveArea>
                    <Panel>
                        {/* LOADING 단계 */}
                        {stage === 'loading' && renderLoading()}

                        {/* QUESTION 단계 */}
                        {stage === 'question' && (
                            <>
                                <QuestionBubble>
                                    <QuestionNumber>{questionNumber}</QuestionNumber>
                                    <QuestionText>{question}</QuestionText>
                                </QuestionBubble>

                                {options && options.length > 0 ? (
                                    <OptionsList>
                                        {options.map(opt => (
                                            <BaseButton
                                                key={opt}
                                                variant="dark"
                                                fullWidth
                                                disabled={loading}
                                                onClick={() => handleOptionClick(opt)}
                                            >
                                                {opt}
                                            </BaseButton>
                                        ))}
                                    </OptionsList>
                                ) : (
                                    <InputRow>
                                        <TextInputWrapper>
                                            <BaseInput
                                                placeholder="답변을 입력하세요…"
                                                value={inputValue}
                                                onChange={e => setInputValue(e.target.value)}
                                                disabled={loading}
                                            />
                                        </TextInputWrapper>
                                        <SendBtn
                                            variant="blue"
                                            disabled={loading || !inputValue.trim()}
                                            onClick={() => sendAnswer(inputValue)}
                                        >
                                            전송
                                        </SendBtn>
                                    </InputRow>
                                )}
                            </>
                        )}

                        {/* RECOMMENDATION 단계 */}
                        {stage === 'recommendation' && renderRecommendationCard()}

                        {/* SATISFACTION 단계 */}
                        {stage === 'satisfaction' && (
                            <>
                                {renderRecommendationCard()}

                                <QuestionBubble>
                                    <QuestionNumber>{questionNumber}</QuestionNumber>
                                    <QuestionText>{satisfactionQuestion}</QuestionText>
                                </QuestionBubble>

                                <SatisfactionButtons>
                                    <BaseButton
                                        variant="green"
                                        fullWidth
                                        disabled={loading}
                                        onClick={() => handleSatisfaction('예')}
                                    >
                                        예
                                    </BaseButton>
                                    <BaseButton
                                        variant="red"
                                        fullWidth
                                        disabled={loading}
                                        onClick={() => handleSatisfaction('아니오')}
                                    >
                                        아니오
                                    </BaseButton>
                                </SatisfactionButtons>
                            </>
                        )}

                        {/* DONE 단계 */}
                        {stage === 'done' && (
                            <>
                                {renderRecommendationCard()}
                                <FinalMessage>{finalMessage}</FinalMessage>
                                <DoneActions>
                                    {/* 상세페이지 이동: tmdbId 없으면 disabled */}
                                    <BaseButton
                                        variant="green"
                                        fullWidth
                                        disabled={!recommendation?.tmdbId}
                                        onClick={handleGoDetail}
                                    >
                                        추천받은 영화 상세페이지 가기
                                    </BaseButton>
                                    <BaseButton
                                        variant="blue"
                                        fullWidth
                                        disabled={loading}
                                        onClick={handleRestart}
                                    >
                                        새로운 추천 받기
                                    </BaseButton>
                                </DoneActions>
                            </>
                        )}
                    </Panel>
                </InteractiveArea>
            </Content>
        </Container>
    )
}

export default Bolkinator