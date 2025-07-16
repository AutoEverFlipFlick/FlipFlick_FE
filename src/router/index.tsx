import { Route, Routes } from 'react-router-dom'
import ExamplePage from '@/pages/example/ExamplePage'
import PlaylistPage from '@/pages/playlist'
import CreatePlaylist from '@/pages/CreatePlaylist'
import PlaylistDetail from '@/pages/PlaylistDetail'
import { BookmarkProvider } from '../context/BookmarkContext'
// import Layout from '@/components/common/CommonLayout' // 공통 레이아웃 컴포넌트가 필요함

const AppRoutes = () => {
  return (
    <BookmarkProvider userId={3}>
      <Routes>
        {/*해당 위치의 레이아웃 컴포넌트로 감싸기*/}
        {/*<Route element={<Layout />}>*/}
        {/*페이지 컴포넌트 연결*/}
        <Route path="/" element={<ExamplePage />} />
        {/* 추후 추가될 하위 라우트 */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/*</Route>*/}
        {/* 레이아웃 적용 미 적용시 */}
        {/* <Route path="/" element={<ExampleReactVite/>}/>
      {/* 위 형태로 사용 */}
        <Route path='/playlist' element={<PlaylistPage />}></Route>
        <Route path='/createplaylist' element={<CreatePlaylist />}></Route>
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
      </Routes>
      </BookmarkProvider>
  )
}

export default AppRoutes
