import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`

const AlarmListContainer = styled.div`
  position: absolute;
  top: 2.5rem;
  left: 0;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  color: black;
`

const AlarmItem = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`

const AlarmComponent: React.FC = () => {
  const { user } = useAuth()
  const userId = user?.id

  const [visible, setVisible] = useState(false)
  const [alarms, setAlarms] = useState<any[]>([])
  const [hasNew, setHasNew] = useState(false)

  const toggleVisible = () => setVisible(v => !v)

  useEffect(() => {
    // console.log('userId:', userId)
  }, [userId])

  const fetchAlarms = async () => {
    console.log('✅ fetchAlarms() 호출됨') // 몇 번 호출되는지 로그 찍기

    if (!userId) return
    const res = await axios.get(`http://localhost:8080/api/v1/alarms?userId=${userId}`)
    setAlarms(res.data.data)
  }

  const handleRead = async (alarmId: number) => {
    await axios.post(`http://localhost:8080/api/v1/alarms/${alarmId}/read`)
    setAlarms(prev => prev.filter(a => a.id !== alarmId))
  }

  useEffect(() => {
    if (visible) fetchAlarms()
  }, [visible, userId])

  // SSE로 실시간 알림 수신
  useEffect(() => {
    if (!userId) return

    const eventSource = new EventSource(
      `http://localhost:8080/api/v1/alarms/stream?userId=${userId}`,
    )

    // SSE 이벤트는 visible과 무관하게 state에 push만
    eventSource.addEventListener('alarm', event => {
      const newAlarm = JSON.parse(event.data)
      setAlarms(prev => (prev.some(a => a.id === newAlarm.id) ? prev : [newAlarm, ...prev]))
    })

    eventSource.onerror = err => {
      // console.error('SSE 오류:', err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [userId])

  return (
    <Wrapper>
      <ToggleButton
        onClick={() => {
          setVisible(v => !v)
          setHasNew(false) // 알림창 열면 새 알림 표시 지움
        }}
      >
        알림 보기 {hasNew && '🔔'}
      </ToggleButton>
      {visible && (
        <AlarmListContainer>
          {alarms.length === 0 && <p style={{ padding: '1rem' }}>알림이 없습니다</p>}
          {alarms.map(alarm => (
            <AlarmItem key={alarm.id} onClick={() => handleRead(alarm.id)}>
              {alarm.content}
            </AlarmItem>
          ))}
        </AlarmListContainer>
      )}
    </Wrapper>
  )
}

export default AlarmComponent
