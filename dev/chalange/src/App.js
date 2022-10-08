import Chalange from './chalange/Chalange'
import Nav from './shared/nav/Nav'
import useWindowResize from './shared/Functions'
import './shared/Global.css'


function App() {

  window.narrowWindow = useWindowResize();
  
	if( process.env.NODE_ENV === 'development'){

		window.jsonData = 
{
    "isAuth": true,
    "userid": 1,
    "chalange": {
        "id": 1,
        "exercise": "e",
        "answer": "a",
        "hints": "h",
        "author": 1,
        "creationdate": "09/10/2022 - 10:47",
        "title": "t",
        "rating": [],
        "tags": [
            "a",
            "b"
        ],
        "explain": "e",
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
        narrowWindow = { window.narrowWindow } 
        currentPage = { '/' + String(chalange['id']) }
        signInFailure = { signInFailure } 
        isSignUp = { isSignUp }
	   	isAuth = { isAuth }
	   	userid = { userid }
      />
      
      <Chalange narrowWindow={window.narrowWindow}/>
      
      </>
    )
	
} 

export default App;
