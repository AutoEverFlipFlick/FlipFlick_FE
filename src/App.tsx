import {BrowserRouter} from "react-router-dom";
import AppRoutes from './router'
import {GlobalStyle} from './styles/globalStyle.ts';

function App() {


  return (
    <>
      <GlobalStyle/>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </>
  )
}

export default App
