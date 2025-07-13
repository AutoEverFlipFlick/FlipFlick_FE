import {Route, Routes} from 'react-router-dom'
import ExampleReactVite from '@/pages/ExampleReactVite'
// import Layout from '@/components/common/CommonLayout' // 공통 레이아웃 컴포넌트가 필요함

const AppRoutes = () => {
  return (
    <Routes>
      {/*<Route element={<Layout />}>*/} // 해당 위치 레이아웃 컴포넌트로 감싸기
        <Route path="/" element={<ExampleReactVite/>}/> // 페이지 컴포넌트 연결
        {/* 추후 추가될 하위 라우트 */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/*</Route>*/}
      {/* 레이아웃 적용 미 적용시 바로 <Route path="/" element={<ExampleReactVite/>}/> 형태로 사용 */}
    </Routes>
  )
}

export default AppRoutes
