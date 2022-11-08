import { useParams, BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './pages/home/Home'
import New from './pages/new/New'
import ExercisePage from './pages/exercisePage/ExercisePage'

import Nav from './shared/nav/Nav'
import useWindowResize, {sendData} from './shared/Functions'
import './shared/Global.css'

import Register from './pages/register/Register'

import {useEffect, useState} from 'react'

function Slug() {
  let { slug } = useParams();

  return <h1>slug {slug}</h1>
}


function NotFound() {
  return <h1>NotFound</h1>
}

function App() {
  
  const narrowWindow = useWindowResize();
  window.userid = useState(false);

  useEffect(()=>{
    if(!window.jsonData) {
      window.userid[1](null)
    }
  },[])

  return (
    <>
    <img src="/danny/current/exercises/Before-Sunrise.jpg"/>
    <img src="/volume/Before-Sunrise.jpg"/>
    <img src="/Before-Sunrise.jpg"/>

    <BrowserRouter>
      <Nav narrowWindow={narrowWindow[0]}/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/new" element={<New isEdit={false} exercise={null}/>}/>
        <Route path="/login" element={<Register isLogin={true}/>}/>
        <Route path="/signup" element={<Register isLogin={false}/>}/>
        <Route path="/profile/:slug" element={<Slug/>}/>
        <Route path="/exercise/:exerciseId" element={<ExercisePage/>}/>
        <Route path="/*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
