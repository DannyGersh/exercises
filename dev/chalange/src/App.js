import Chalange from './chalange/Chalange'
import Nav from './shared/nav/Nav'
import useWindowResize from './shared/Functions'
import './shared/Global.css'

function App() {

  let narrowWindow = useWindowResize();
  if( process.env.NODE_ENV === 'development'){
    window.jsonData = { 'id': 2, 'signInFailure': true }; 
  }  
  
  return (
    <>
    
    <Nav 
      narrowWindow={narrowWindow} 
      currentPage={'./../../../../../../' + String(window.jsonData['id'])}
      signInFailure={window.jsonData['signInFailure']}
    />
    
    <Chalange narrowWindow={narrowWindow}/>
    
    </>
  )
	
} 

export default App;
