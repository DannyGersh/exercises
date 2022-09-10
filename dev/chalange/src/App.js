import Chalange from './chalange/Chalange'
import Nav from './shared/nav/Nav'
import useWindowResize from './shared/Functions'
import './shared/Global.css'


function App() {

  let narrowWindow = useWindowResize();
  
	if( process.env.NODE_ENV === 'development'){

		window.jsonData = 
{
    "signInFailure": false,
    "isSignUp": false,
    "isAuth": true,
    "userid": 1,
    "chalange": {
        "id": 1,
        "exercise": "a",
        "answer": "a",
        "hints": "a",
        "author": 1,
        "creationdate": "09/10/2022 - 10:47",
        "title": "a",
        "rating": [],
        "tags": [
            "a",
            "b"
        ],
        "explain": "a",
        "latex": "",
        "authorName": "a",
        "list_latex": {
            "title": [],
            "exercise": [],
            "answer": [],
            "hints": [],
            "explain": []
        }
    }
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
      signInFailure = { signInFailure } 
      isSignUp = { isSignUp }
			isAuth = { isAuth }
			userid = { userid }
    />
    
    <Chalange narrowWindow={narrowWindow}/>
    
    </>
  )
	
} 

export default App;
