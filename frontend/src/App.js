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
  
  window.isdebug = false;
  const narrowWindow = useWindowResize();

  // window.jsonData is not available at port 3000
  if(window.isdebug) {
    window.jsonData = {
      userid: null,
    }
  }

  console.log(window.jsonData, window.isdebug);

  return (
    <>
    <Nav narrowWindow={narrowWindow[0]}/>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="login" element={<Register isLogin={true}/>}/>
        <Route path="signup" element={<Register isLogin={false}/>}/>
        <Route path="profile/:slug" element={<Slug/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
