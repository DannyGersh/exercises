import New from './new/New'
import Nav from './shared/nav/Nav'
import useWindowResize from './shared/Functions'
import './shared/Global.css'
import {useState, useEffect} from 'react'

function App() {

  let narrowWindow = useWindowResize();
  
	if( process.env.NODE_ENV === 'development'){
		window.jsonData = {
			'tags': ['math', 'tag1', 'tag2'],
			'isAuth': true,
			'userid': 1
			}
	}
	const tags = window.jsonData['tags']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
	
	return (
    <>
    
    <Nav 
      narrowWindow = { narrowWindow } 
      currentPage = { './../../../../../../new' }
			isAuth = { isAuth }
			userid = { userid }
    />
    <New/>
    
    </>
  )
	
} 

export default App;
