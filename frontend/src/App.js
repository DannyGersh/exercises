import { useParams, BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home/home'
import Nav from './shared/nav/nav'
import useWindowResize from './shared/functions'
import './shared/global.css'

function A() {
  return <h1>A</h1>
}
function B() {
  return <h1>B</h1>
}


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

  return (
    <>
    <Nav narrowWindow={narrowWindow[0]} userid={1}/>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="a" element={<A/>}/>
        <Route path="b" element={<B/>}/>
        <Route path="profile/:slug" element={<Slug/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
