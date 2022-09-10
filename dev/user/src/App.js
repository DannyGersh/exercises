import useWindowResize from './shared/Functions'
import Nav from "./shared/nav/Nav"
import './shared/Global.css'
import User from './user/User'

function App() {
  
	// PERROR - the browser wont record this page on history for some reason
	window.history.pushState({}, '', window.location);
	
	// nrw - narrow window - boolean
  window.nrw = useWindowResize();
	
  if( process.env.NODE_ENV === 'development'){
		
		window.jsonData = 
{
    "signInFailure": false,
    "isSignUp": false,
    "isAuth": true,
    "userid": 1,
    "data": [
        [
            {
                "id": 1,
                "exercise": "a",
                "answer": "a",
                "hints": "a",
                "author": 1,
                "creationdate": "09/10/2022 - 10:47",
                "title": "a",
                "rating": [],
                "tags": [],
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
        ],
        [],
        "a"
    ]
}
	
	}
	const signInFailure = window.jsonData['signInFailure']
	const isSignUp = window.jsonData['isSignUp']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
	
  return (
    <>
    <Nav 
      narrowWindow = { window.nrw } 
      currentPage = { './../../../../../../' + String(userid) }
      signInFailure = { signInFailure } 
      isSignUp = { isSignUp }
			isAuth = { isAuth }
    />
	<User/>
  </>
  );
}

export default App;
