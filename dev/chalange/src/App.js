import Chalange from './Chalange'
import {useState} from 'react'
import Nav from './shared/Nav'
import useWindowResize from './shared/functions'

function App() {

  let narrowWindow = useWindowResize();
  
  return (
    <>
    <Nav narrowWindow={narrowWindow}/>
    <Chalange narrowWindow={narrowWindow}/>
    </>
  )
	
} 

export default App;
