import { useParams, BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home/home'
import Nav from './shared/nav/nav'
import useWindowResize from './shared/functions'
import './shared/global.css'

import Register from './pages/register/register'

function Slug() {
  let { slug } = useParams();

  return <h1>slug {slug}</h1>
}


function NotFound() {
  return <h1>NotFound</h1>
}

function App() {
  
  const narrowWindow = useWindowResize();
  window.isdebug = true;
  
  if(window.isdebug) {
    window.jsonData = {
      userid:1,
    };
  }

  return (
    <>
    <Nav narrowWindow={narrowWindow[0]} userid={window.jsonData}/>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="register" element={<Register/>}/>        <Route path="profile/:slug" element={<Slug/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
