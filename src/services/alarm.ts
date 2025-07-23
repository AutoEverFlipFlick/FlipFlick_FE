import axiosInstance from '../services/axiosInstance'

export type Alarm = {
  id: number
  content: string
  receivedId: number
  createdAt: string
  isRead: boolean
}

// 🔔 알림 목록 가져오기 (히스토리)
export const getAlarms = async (userId: number): Promise<Alarm[]> => {
  // console.log('getAlarms 호출됨:', userId)
  const res = await axiosInstance.get(`/api/v1/alarms?userId=${userId}`)
  // console.log(res.data)
  return res.data.data
}

// ✅ 알림 읽음 처리
export const markAlarmAsRead = async (alarmId: number): Promise<void> => {
  await axiosInstance.post(`/api/v1/alarms/${alarmId}/read`)
}

// 📡 SSE 연결 및 이벤트 리스너 등록
export const subscribeToAlarmStream = (
  userId: number,
  onReceive: (alarm: Alarm) => void,
): EventSource => {
  try {
    const es = new EventSource(`https://api.flipflick.life/api/v1/alarms/stream?userId=${userId}`)

    es.addEventListener('alarm', event => {
      try {
        const alarm: Alarm = JSON.parse(event.data)
        onReceive(alarm)
      } catch (err) {
        console.error('알람 파싱 에러:', err)
      }
    })

    es.onerror = err => {
      console.warn('SSE 연결 에러:', err)
      es.close()
    }

    return es
  } catch (err) {
    console.error('EventSource 생성 실패:', err)
    throw err // 혹은 빈 EventSource 반환
  }
}
