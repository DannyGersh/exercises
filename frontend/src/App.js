import { useParams, BrowserRouter, Routes, Route } from "react-router-dom";


function Home() { // (1)
  return <h1>Home</h1>
}
function A() { // (2)
  return <h1>A</h1>
}
function B() { // (2)
  return <h1>B</h1>
}
function Slug() { // (3)
  let { slug } = useParams();
  return <h1>slug {slug}</h1>
}
function NotFound() {
  return <h1>NotFound</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="a" element={<A/>}/>
        <Route path="b" element={<B/>}/>
        <Route path="slug/:slug" element={<Slug/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
