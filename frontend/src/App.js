import React, {useState} from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import useWindowResize from './shared/Functions'
import Home from './pages/home/Home'
import New from './pages/new/New'
import ExercisePage from './pages/exercisePage/ExercisePage'
import SearchPage from './pages/searchPage/SearchPage'
import Profile from './pages/profile/Profile'
import Register from './pages/register/Register'
import AboutPage from './pages/about/AboutPage'
import Nav from './shared/nav/Nav'
import './shared/Global.css'


function NotFound() {
  return <h1>NotFound</h1>
}


function App() {
 
  const s_render = useState(false);
  window.nrw = useWindowResize(s_render);
  
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
        <Route path="/login" element={<Register target='login'/>}/>
        <Route path="/signup" element={<Register target='signup'/>}/>
        <Route path="/confirm_signup" element={<Register target='confirm_signup'/>}/>
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
