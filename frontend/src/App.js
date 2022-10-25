import { useParams, BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './pages/home/home'
import New from './pages/new/New'

import Nav from './shared/nav/nav'
import useWindowResize, {sendData} from './shared/functions'
import './shared/global.css'

import Register from './pages/register/register'

import {useEffect, useState} from 'react'

function Slug() {
  let { slug } = useParams();

  return <h1>slug {slug}</h1>
}


function NotFound() {
  return <h1>NotFound</h1>
}

function App() {
  
  window.isdebug = true;
  const narrowWindow = useWindowResize();
  window.userid = useState(false);

  useEffect(()=>{
  if(!window.jsonData) {
    window.userid[1](null)
  }
  },[])

  return (
    <>
    <BrowserRouter>
      <Nav narrowWindow={narrowWindow[0]}/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/new" element={<New isEdit={false} exercise={null}/>}/>
        <Route path="/login" element={<Register isLogin={true}/>}/>
        <Route path="/signup" element={<Register isLogin={false}/>}/>
        <Route path="/profile/:slug" element={<Slug/>}/>
        <Route path="/*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
