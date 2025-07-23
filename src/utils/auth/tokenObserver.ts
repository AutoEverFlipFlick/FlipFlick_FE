import { useEffect, useState } from 'react'

const useTokenObserver = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'))

  // 윈도우 자체에 이벤트 리스너를 설정한다
  // 윈도우 자체에 이벤트 리스너를 설정하는 이유?
  // 0 ) axiosInstance에서 토큰이 변경될 때 이벤트 발생
  // 1 ) 모든 컴포넌트 이벤트는 bubble 방식으로 전파된다
  // 2 ) bubble 방식을 전파란 ? 자식 요소의 이벤트가 부모까지 전파
  // 3 ) 즉 윈도우 자체에 이벤트리스너를 등록하면 해당 axiosInstance에서 발생한 이벤트 감지가능

  useEffect(() => {
    // 다른 '탭'에서 로컬스토리지 변경 시 콜백 함수
    const handleStorage = (e: StorageEvent) => {
      if (e.key == 'accessToken') {
        setToken(e.newValue)
      }
    }

    // 같은 탭에서 변경시에
    const handleCustom = (e: Event) => {
      const CustomEvent = (e as CustomEvent).detail as {
        newToken: string | null
      }
      setToken(CustomEvent.newToken)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('tokenStorage', handleCustom)

    // return의 의미 ? 해당 컴포넌트가 unmounted될 때
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('tokenStorage', handleCustom)
    }
  }, [])

  return token
}
export default useTokenObserver
