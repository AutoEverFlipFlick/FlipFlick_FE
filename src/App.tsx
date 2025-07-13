import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ExampleReactVite from "@/pages/ExampleReactVite.tsx";

// TODO: 리액트 vite 기본 템플릿 삭제 후 기본 구조 설정 필요
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExampleReactVite/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
