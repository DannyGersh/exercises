import { useParams, BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './pages/home/Home'
import New from './pages/new/New'
import ExercisePage from './pages/exercisePage/ExercisePage'
import SearchPage from './pages/searchPage/SearchPage'
import Profile from './pages/profile/Profile'
import Register from './pages/register/Register'
import AboutPage from './pages/about/AboutPage'

import Nav from './shared/nav/Nav'
import useWindowResize, {sendData} from './shared/Functions'
import './shared/Global.css'

import {useEffect, useState} from 'react'


function NotFound() {
  return <h1>NotFound</h1>
}


function App() {
 
  window.nrw = useWindowResize();
  
  let tempUserId = 1;
  if(window.jsonData) {
    tempUserId = window.jsonData['userId'];
  }
  window.userId = useState(tempUserId);
  
  return (
    <>
    <BrowserRouter>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/new" element={<New/>}/>
        <Route path="/login" element={<Register isLogin={true}/>}/>
        <Route path="/signup" element={<Register isLogin={false}/>}/>
        <Route path="/profile/:userId" element={<Profile/>}/>
        <Route path="/exercise/:exerciseId" element={<ExercisePage/>}/>
        <Route path="/search/:searchTerm" element={<SearchPage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
