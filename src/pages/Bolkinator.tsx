import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import BaseButton from '@/components/common/BaseButton'
import BaseContainer from '@/components/common/BaseContainer'
import BaseInput from '@/components/common/BaseInput'

import BackgroundImage from '@/assets/common/backgroud_tile_512px.png'

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
  min-height: 75vh;
  background-image: url(${BackgroundImage});
  background-repeat: repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 900px;
  gap: 32px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const GenieArea = styled.div`
  flex: 1;
  text-align: center;
`
const GenieImage = styled.img`
  max-width: 80%;
  max-height: 60vh;
  object-fit: contain;
`

const InteractiveArea = styled.div`
  flex: 1;
`
const Panel = styled(BaseContainer)`
  background: rgba(255, 255, 255, 0.9);
  padding: 16px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  max-width: 600px;         
  box-sizing: border-box;
`

// 나머지 스타일 컴포넌트는 변경 없이 그대로 사용
const QuestionBubble = styled.div`
  position: relative;
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  animation: ${fadeInUp} 0.2s ease-out both;
`
const QuestionNumber = styled.span`
  position: absolute;
  top: -10px;
  left: -10px;
  background: #1f2937;
  color: #fff;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`
const QuestionText = styled.p`
  margin: 0;
  font-size: 1.1rem;
  color: #1f2937;
`
const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${fadeInUp} 0.15s ease-out both;
`
const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  width: 100%;
  min-width: 0;
  animation: ${fadeInUp} 0.15s ease-out both;
`
const TextInputWrapper = styled.div`
  flex: 1;
  > * { width: 100% !important; }
`
const SendBtn = styled(BaseButton)`
  flex: 0 0 auto;
  min-width: 68px;
`

const RecommendationContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
  animation: ${fadeInUp} 0.25s ease-out both;
`
const PosterSkeleton = styled.div`
  width: 100%;
  max-width: 280px;
  aspect-ratio: 2/3;
  border-radius: 8px;
  background: #e5e7eb;
  margin: 0 auto 14px;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.6) 50%,
      rgba(255,255,255,0) 100%
    );
    animation: ${shimmer} 1.25s infinite;
  }
`
const PosterImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  max-width: 280px;
  border-radius: 8px;
  margin-bottom: 14px;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  animation: ${({ $loaded }) => ($loaded ? fadeIn : 'none')} 0.2s ease-out;
  transition: opacity 0.2s ease-out;
`
const MovieTitle = styled.h3`
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 10px;
`
const ReasonText = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.4;
`

const SatisfactionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
  animation: ${fadeInUp} 0.15s ease-out both;
`

const FinalMessage = styled.div`
  text-align: center;
  font-size: 1.1rem;
  color: #1f2937;
  margin-top: 20px;
  animation: ${fadeInUp} 0.25s ease-out both;
`
const DoneActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  animation: ${fadeInUp} 0.25s ease-out both;
`

const SkeletonBase = styled.div<{ height?: string; width?: string; radius?: string }>`
  background: #e5e7eb;
  position: relative;
  overflow: hidden;
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '14px'};
  border-radius: ${({ radius }) => radius || '4px'};
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.6) 50%,
      rgba(255,255,255,0) 100%
    );
    animation: ${shimmer} 1.25s infinite;
  }
`
const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
`
const LoadingQuestionSkeleton = styled.div`
  width: 100%;
  max-width: 450px;
  animation: ${fadeInUp} 0.1s ease-out both;
  ${SkeletonBase} + ${SkeletonBase} { margin-top: 6px; }
`
const LoadingRecommendationSkeleton = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  animation: ${fadeInUp} 0.1s ease-out both;
`
const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 4px solid rgba(31,41,55,0.2);
  border-top-color: #1f2937;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto;
`
const LoadingText = styled.div`
  font-size: 0.85rem;
  color: #4b5563;
  margin-top: 6px;
`

// 메시지 타입 정의
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

interface RecommendationState {
  title: string
  poster: string
  reason: string
  tmdbId?: number
}

const Bolkinator: React.FC = () => {
  const ws = useRef<WebSocket | null>(null)
  const gracefulCloseRef = useRef(false)

  const [stage, setStage] = useState<'loading'|'question'|'recommendation'|'satisfaction'|'done'>('loading')
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]|null>(null)
  const [questionNumber, setQuestionNumber] = useState(0)

  const [recommendation, setRecommendation] = useState<RecommendationState|null>(null)
  const [posterLoaded, setPosterLoaded] = useState(false)

  const [satisfactionQuestion, setSatisfactionQuestion] = useState('')
  const [finalMessage, setFinalMessage] = useState('')

  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const [genieMood, setGenieMood] = useState<GenieMood>('normal')
  const [isSatisfied, setIsSatisfied] = useState(false)

  const genieSrcMap: Record<GenieMood,string> = {
    normal: GenieNormal,
    gomin: GenieGomin,
    good: GenieGood,
    bad: GenieBad,
  }

  useEffect(() => { setPosterLoaded(false) }, [recommendation?.poster])

  useEffect(() => {
    const proto = window.location.protocol==='https:'?'wss':'ws'
    const socket = new WebSocket(`${proto}://bolkinator.flipflick.life/ws`)
    ws.current = socket

    socket.onopen = () => {
      setStage('loading')
      setGenieMood('normal')
    }
    socket.onmessage = e => {
      setLoading(false)
      let msg:AnyMsg
      try { msg=JSON.parse(e.data) } catch{ return }
      if(msg.type==='question'){
        const first=questionNumber===0
        if(!isSatisfied) setGenieMood(first?'normal':(genieMood==='good'?'good':'gomin'))
        if(msg.question.includes('마음에 드시나요')){
          setSatisfactionQuestion(msg.question)
          setStage('satisfaction')
        } else {
          setQuestionNumber(n=>n+1)
          setQuestion(msg.question)
          setOptions(msg.options)
          setStage('question')
        }
      } else if(msg.type==='recommendation'){
        if(!isSatisfied) setGenieMood(genieMood==='good'?'good':'gomin')
        const r=msg as RecommendationMsg
        const id= r.tmdb_id!==undefined?(typeof r.tmdb_id==='string'?parseInt(r.tmdb_id,10):r.tmdb_id):undefined
        setRecommendation({ title:r.title, poster:r.poster_url, reason:r.reason, tmdbId:isNaN(Number(id))?undefined:Number(id) })
        setStage('recommendation')
      } else {
        setFinalMessage(p=>p?`${p}\n${msg.message}`:msg.message)
        if(!gracefulCloseRef.current) setStage('done')
      }
    }
    socket.onclose = () => {
      setLoading(false)
      if(gracefulCloseRef.current) return
      setGenieMood('bad')
      setRecommendation(null)
      setFinalMessage('오늘은 영업 종료했으니, 다음에 찾아보도록 하거라!')
      setStage('done')
    }
    return ()=>{ socket.close() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const sendAnswer=(ans:string)=>{
    if(ws.current?.readyState!==WebSocket.OPEN) return
    ws.current.send(ans)
    setLoading(true); setStage('loading'); setInputValue('')
  }
  const handleOptionClick=(opt:string)=>{
    let a=opt
    if(/^\d+\./.test(opt)) a=opt.split('.')[1].trim().split(' ')[0]
    sendAnswer(a)
  }
  const handleSatisfaction=(ans:'예'|'아니오')=>{
    sendAnswer(ans)
    if(ans==='예'){ setGenieMood('good'); setIsSatisfied(true); gracefulCloseRef.current=true; setStage('done') }
    else{ setGenieMood('bad'); setIsSatisfied(false); setRecommendation(null) }
  }
  const handleRestart=()=>window.location.reload()
  const handleGoDetail=()=>{
    if(!recommendation?.tmdbId) return
    window.location.href=`/movie/detail/${recommendation.tmdbId}`
  }

  const renderLoading=()=>(
    <LoadingWrapper>
      <LoadingQuestionSkeleton>
        <SkeletonBase height="20px" width="75%" radius="4px" />
        <SkeletonBase height="14px" width="45%" radius="4px" />
      </LoadingQuestionSkeleton>
      <LoadingRecommendationSkeleton>
        <SkeletonBase height="160px" width="160px" radius="8px" />
        <SkeletonBase height="18px" width="55%" radius="4px" />
        <SkeletonBase height="14px" width="80%" radius="4px" />
      </LoadingRecommendationSkeleton>
      <Spinner />
      <LoadingText>고민이 되는구먼...</LoadingText>
    </LoadingWrapper>
  )

  const renderRecommendationCard=()=>recommendation&&(
    <RecommendationContainer>
      {!posterLoaded&&<PosterSkeleton />}
      <PosterImage
        src={recommendation.poster}
        alt={recommendation.title}
        $loaded={posterLoaded}
        onLoad={()=>setPosterLoaded(true)}
        onError={()=>setPosterLoaded(true)}
      />
      <MovieTitle>{recommendation.title}</MovieTitle>
      <ReasonText>{recommendation.reason}</ReasonText>
    </RecommendationContainer>
  )

  return (
    <Container>
      <Content>
        <GenieArea>
          <GenieImage src={genieSrcMap[genieMood]} alt={`Bolkinator ${genieMood}`} />
        </GenieArea>
        <InteractiveArea>
          <Panel>
            {stage==='loading'&&renderLoading()}
            {stage==='question'&&(
              <>
                <QuestionBubble>
                  <QuestionNumber>{questionNumber}</QuestionNumber>
                  <QuestionText>{question}</QuestionText>
                </QuestionBubble>
                {options&&options.length>0?(
                  <OptionsList>
                    {options.map(opt=>(
                      <BaseButton
                        key={opt}
                        variant="dark"
                        fullWidth
                        disabled={loading}
                        onClick={()=>handleOptionClick(opt)}
                      >{opt}</BaseButton>
                    ))}
                  </OptionsList>
                ):(
                  <InputRow>
                    <TextInputWrapper>
                      <BaseInput
                        placeholder="답변을 입력하세요…"
                        value={inputValue}
                        onChange={e=>setInputValue(e.target.value)}
                        disabled={loading}
                      />
                    </TextInputWrapper>
                    <SendBtn
                      variant="blue"
                      disabled={loading||!inputValue.trim()}
                      onClick={()=>sendAnswer(inputValue)}
                    >전송</SendBtn>
                  </InputRow>
                )}
              </>
            )}
            {stage==='recommendation'&&renderRecommendationCard()}
            {stage==='satisfaction'&&(
              <>
                {renderRecommendationCard()}
                <QuestionBubble>
                  <QuestionNumber>{questionNumber}</QuestionNumber>
                  <QuestionText>{satisfactionQuestion}</QuestionText>
                </QuestionBubble>
                <SatisfactionButtons>
                  <BaseButton variant="green" fullWidth disabled={loading} onClick={()=>handleSatisfaction('예')}>예</BaseButton>
                  <BaseButton variant="red" fullWidth disabled={loading} onClick={()=>handleSatisfaction('아니오')}>아니오</BaseButton>
                </SatisfactionButtons>
              </>
            )}
            {stage==='done'&&(
              <>
                {renderRecommendationCard()}
                <FinalMessage>{finalMessage}</FinalMessage>
                <DoneActions>
                  <BaseButton variant="green" fullWidth disabled={!recommendation?.tmdbId} onClick={handleGoDetail}>추천받은 영화 상세페이지 가기</BaseButton>
                  <BaseButton variant="blue" fullWidth disabled={loading} onClick={handleRestart}>새로운 추천 받기</BaseButton>
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
