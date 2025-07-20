import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext' // 예: 로그인된 유저 정보 제공

/**
 * SSE 로 실시간 알람을 수신해서,
 * 도착 즉시 console.log 또는 토스트 팝업 등을 띄워줍니다.
 */
const AlarmListener: React.FC = () => {
  const { user } = useAuth()
  const userId = user?.id

  useEffect(() => {
    if (!userId) return

    // 1) 스트림 구독
    const es = new EventSource(`http://localhost:8080/api/v1/alarms/stream?userId=${userId}`)

    // 2) 서버에서 name="alarm" 으로 보낸 데이터 수신
    es.addEventListener('alarm', (e: MessageEvent) => {
      // const alarm = JSON.parse(e.data) as {
      //   id: number
      //   content: string
      //   receivedId: number
      //   createdAt: string
      //   isRead: boolean
      // }
      // 예시: console 로 찍기 / 혹은 원하는 UI 토스트 호출
      // console.log('[SSE 알림 도착]', alarm)
      // TODO: setState 혹은 Toast 라이브러리로 화면에 띄우기
      // toast.info(`새 알림: ${alarm.content}`)
    })
    es.onopen = () => {
      console.log('✅ SSE 연결 성공')
    }

    // let errorCount = 0
    // es.onerror = err => {
    //   errorCount++
    //   console.error('SSE 에러', err)

    //   if (errorCount >= 5) {
    //     console.warn('SSE 재연결 실패가 지속되고 있음...')
    //     // toast.error('알림 연결에 문제가 발생했습니다')
    //   }
    // }

    // 컴포넌트 언마운트 시 스트림 닫기
    return () => {
      es.close()
    }
  }, [userId])

  return null
}

export default AlarmListener
