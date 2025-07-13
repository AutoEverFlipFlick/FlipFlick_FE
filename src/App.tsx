import {BrowserRouter, Route, Routes} from "react-router-dom";
import ExampleReactVite from "@/pages/ExampleReactVite.tsx";
import { GlobalStyle } from './styles/globalStyle.ts';

function App() {


  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExampleReactVite/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
