import { Route, Routes } from 'react-router-dom'
import ExamplePage from '@/pages/example/ExamplePage'
import MovieDetailPage from '@/pages/movie/MovieDetailPage'
import TotalSearch from '@/pages/TotalSearch'
import Login from '@/pages/member/Login'
import SignUp from '@/pages/member/SignUp'
import EmailLogin from '@/pages/member/EmailLogin'
// import Layout from '@/components/common/CommonLayout' // 공통 레이아웃 컴포넌트가 필요함

const AppRoutes = () => {
  return (
    <Routes>
      {/*해당 위치의 레이아웃 컴포넌트로 감싸기*/}
      {/*<Route element={<Layout />}>*/}
      {/*페이지 컴포넌트 연결*/}
      <Route path="/" element={<ExamplePage />} />
      {/* 추후 추가될 하위 라우트 */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      <Route path="/totalsearch" element={<TotalSearch />} />
      {/*</Route>*/}
      {/* 레이아웃 적용 미 적용시 */}
      {/* <Route path="/" element={<ExampleReactVite/>}/>
      {/* 위 형태로 사용 */}

      <Route path="/movie/detail" element={<MovieDetailPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/emaillogin" element={<EmailLogin />} />
    </Routes>
  )
}

export default AppRoutes
