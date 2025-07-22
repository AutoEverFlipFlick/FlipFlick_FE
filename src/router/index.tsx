// import { Route, Routes } from 'react-router-dom'
// import ExamplePage from '@/pages/example/ExamplePage'
// import PlaylistPage from '@/pages/playlist/playlist'
// import CreatePlaylist from '@/pages/playlist/CreatePlaylist'
// import PlaylistDetail from '@/pages/playlist/PlaylistDetail'
// import { BookmarkProvider } from '../context/BookmarkContext'
// import MovieDetailPage from '@/pages/movie/MovieDetailPage'
// import TotalSearch from '@/pages/TotalSearch'
// import Login from '@/pages/member/Login'
// import SignUp from '@/pages/member/SignUp'
// import EmailLogin from '@/pages/member/EmailLogin'
// // import Layout from '@/components/common/CommonLayout' // 공통 레이아웃 컴포넌트가 필요함

// const AppRoutes = () => {
//   return (
//     <BookmarkProvider>
//       <Routes>
//         {/*해당 위치의 레이아웃 컴포넌트로 감싸기*/}
//         {/*<Route element={<Layout />}>*/}
//         {/*페이지 컴포넌트 연결*/}
//         <Route path="/" element={<ExamplePage />} />
//         {/* 추후 추가될 하위 라우트 */}
//         {/* <Route path="/login" element={<LoginPage />} /> */}
//         {/*</Route>*/}
//         {/* 레이아웃 적용 미 적용시 */}
//         {/* <Route path="/" element={<ExampleReactVite/>}/>
//       {/* 위 형태로 사용 */}
//         <Route path='/playlist' element={<PlaylistPage />}></Route>
//         <Route path='/createplaylist' element={<CreatePlaylist />}></Route>
//         <Route path="/playlist/:id" element={<PlaylistDetail />} />
//         <Route path="/movie/detail" element={<MovieDetailPage />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/emaillogin" element={<EmailLogin />} />

//          <Route path="/totalsearch" element={<TotalSearch />} />
//       </Routes>
//     </BookmarkProvider>

//   )
// }

// export default AppRoutes

import { Route, Routes, Navigate } from 'react-router-dom'
import ExamplePage from '@/pages/example/ExamplePage'
import PlaylistPage from '@/pages/playlist/playlist'
import CreatePlaylist from '@/pages/playlist/CreatePlaylist'
import PlaylistDetail from '@/pages/playlist/PlaylistDetail'
import { AuthProvider } from '../context/AuthContext'
import { BookmarkProvider } from '../context/BookmarkContext'
import ProtectedRoute from '../components/common/ProtectedRoute'
import PublicRoute from '../components/common/PublicRoute'
import EditPlaylist from '@/pages/playlist/EditPlaylist'
import MovieDetailPage from '@/pages/movie/MovieDetailPage'
import TotalSearch from '@/pages/TotalSearch'
import Login from '@/pages/member/Login'
import SignUp from '@/pages/member/SignUp'
import EmailLogin from '@/pages/member/EmailLogin'
import Filmography from '@/pages/filmography'
import KakaoRedirectHandler from '@/pages/member/KakaoRedirectHandler'
import Layout from '@/components/common/layout/BasePageLayout'
import NoHeaderLayout from '@/components/common/layout/NoHeaderLayout'
import NaverRedirectHandler from '@/pages/member/NaverRedirectHandler'
import Bolkinator from '@/pages/Bolkinator'
import SocialSignUp from '@/pages/member/SocialSignUp'
import Dashboard from '@/pages/admin/Dashboard'
import UserManagement from '@/pages/admin/UserManagement'
import ReportManagement from '@/pages/admin/ReportManagement'
import AdminRoute from '@/components/common/AdminRoute'
import FindPassword from '@/pages/member/FindPassword'
import ResetPassword from '@/pages/member/ResetPassword'
import Home from '@/pages/Home'
import MyPageMain from '@/pages/myPage/MyPageMain'
import MyPageEdit from '@/pages/myPage/MyPageEdit'
import MyPagePreference from '@/pages/myPage/MyPagePreference'
import MyPageReview from '@/pages/myPage/MyPageReview'
import MyPageDebate from '@/pages/myPage/MyPageDebate'
import MyPageFollowList from '@/pages/myPage/MyPageFollowList'
import DebateWritePage from '@/pages/debate/DebateWritePage'

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* 헤더 없는 레이아웃 (로그인/회원가입/관리자 등) */}
        <Route element={<NoHeaderLayout />}>
          {/* 로그인 관련 */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/emaillogin"
            element={
              <PublicRoute>
                <EmailLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/signup/social"
            element={
              <PublicRoute>
                <SocialSignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/find-password"
            element={
              <PublicRoute>
                <FindPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password-confirm"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* 관리자 페이지 */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/user"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/report"
            element={
              <AdminRoute>
                <ReportManagement />
              </AdminRoute>
            }
          />
          {/* 소셜 로그인 콜백 */}
          <Route path="/oauth/kakao/callback" element={<KakaoRedirectHandler />} />
          <Route path="/oauth/naver/callback" element={<NaverRedirectHandler />} />
        </Route>

        {/* 헤더 포함 기본 레이아웃 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route
            path="/playlist/:id"
            element={
              <BookmarkProvider>
                <PlaylistDetail />
              </BookmarkProvider>
            }
          />
          <Route path="/movie/detail" element={<MovieDetailPage />} />
          <Route path="/totalsearch" element={<TotalSearch />} />
          <Route path="/bolkinator" element={<Bolkinator />} />
          <Route path="/example" element={<ExamplePage />} />
          <Route path="/filmography/:tmdbId" element={<Filmography />} />
          <Route path="/debate/write" element={<DebateWritePage />} />

          {/* Protected Routes */}
          <Route
            path="/createplaylist"
            element={
              <ProtectedRoute>
                <CreatePlaylist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist/:id/edit"
            element={
              <ProtectedRoute>
                <EditPlaylist />
              </ProtectedRoute>
            }
          />

          {/* 마이페이지 */}
          <Route path="/my-page" element={<MyPageMain />} />
          <Route path="/my-page-edit" element={<MyPageEdit />} />
          <Route path="/my-page-preference" element={<MyPagePreference />} />
          <Route path="/my-page-review" element={<MyPageReview />} />
          <Route path="/my-page-debate" element={<MyPageDebate />} />
          <Route path="/my-page-follow" element={<MyPageFollowList />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default AppRoutes
