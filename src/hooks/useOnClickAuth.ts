import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Swal from "sweetalert2";

/**
 * 로그인 여부를 검사한 뒤
 *  - 미로그인 → 토스트 출력 + 로그인 페이지로 이동
 *  - 로그인   → 원래 onClick 콜백 실행
 *
 * @param message    미로그인 시 보여줄 토스트 메시지
 * @param redirectTo 미로그인 시 이동할 경로
 *
 * @example
 * const onClickAuth = useOnClickAuth()
 * <button onClick={onClickAuth(handleLike)}>좋아요</button>
 */
export const useOnClickAuth = (
  message = '로그인이 필요한 기능입니다. 로그인하시겠습니까?',
  redirectTo = '/login',
) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() // 뒤로가기로 돌아올 위치 저장

  /**
   * 실제로 버튼에 전달할 onClick 핸들러 래핑
   */
  return function onClickAuth(
    callback: () => void | Promise<void>,
  ) {
    return async () => {
      if (!isAuthenticated) {
        const result = await Swal.fire({
          icon: 'info',
          title: '로그인이 필요합니다',
          text: message,
          showCancelButton: true,
          confirmButtonText: '로그인',
          cancelButtonText: '나중에',
          confirmButtonColor: '#FE6A3C',
        })

        if (result.isConfirmed) {
          navigate(redirectTo, { state: { from: location } })
        }
        return
      }
      await callback()
    }
  }
}
