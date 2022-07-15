import Chalange from './chalange/Chalange'
import Nav from './shared/nav/Nav'
import useWindowResize from './shared/Functions'
import './shared/Global.css'


function App() {

  let narrowWindow = useWindowResize();
  
	if( process.env.NODE_ENV === 'development'){
    let chalange = {
			'id': 2, 
			'question': 'test question', 
			'answer': 'test answer', 
			'hints': 'test hints', 
			'author': 'test author', 
			'creationdate': '27-7-1996', 
			'title': 'test title', 
			'rating': ['b','c'], 
			'tags': ['math', 'science']
		};
		window.jsonData = {
			'chalange': chalange,
			'signInFailure': false,
			'isSignUp': false,
			'isAuth': true,
			'userid': 1
			}
	}
	const chalange = window.jsonData['chalange']
	const signInFailure = window.jsonData['signInFailure']
	const isSignUp = window.jsonData['isSignUp']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
	
  return (
    <>
    
    <Nav 
      narrowWindow = { narrowWindow } 
      currentPage = { './../../../../../../' + String(chalange['id']) }
      signInFailure = { window.jsonData['signInFailure'] } 
      isSignUp = { window.jsonData['isSignUp'] }
			isAuth = { window.jsonData['isAuth'] }
    />
    
    <Chalange narrowWindow={narrowWindow}/>
    
    </>
  )
	
} 

export default App;
