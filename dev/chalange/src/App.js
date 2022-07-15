import Chalange from './chalange/Chalange'
import Nav from './shared/nav/Nav'
import useWindowResize from './shared/Functions'
import './shared/Global.css'

// required definitions 
// window.jsonData['signInFailure']
// window.jsonData['isSignUp']
// window.jsonData['isAuth']

function App() {

  let narrowWindow = useWindowResize();
  if( process.env.NODE_ENV === 'development'){
    window.jsonData = { 'id': 2, 'signInFailure': true }; 
  }  
    
  return (
    <>
    
    <Nav 
      narrowWindow = { narrowWindow } 
      currentPage = { './../../../../../../' + String(window.jsonData['id']) }
      signInFailure = { window.jsonData['signInFailure'] } 
      isSignUp = { window.jsonData['isSignUp'] }
			isAuth = { window.jsonData['isAuth'] }
    />
    
    <Chalange narrowWindow={narrowWindow}/>
    
    </>
  )
	
} 

export default App;
