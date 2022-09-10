import useWindowResize from './shared/Functions'
import Nav from "./shared/nav/Nav"
import './shared/Global.css'
import Home from './home/Home'

function App() {
  	
	// PERROR - the browser wont record this page on history for some reason
	window.history.pushState({}, '', window.location);
	
  window.nrw = useWindowResize(); // nrw - narrow window - boolean
	
	if( process.env.NODE_ENV === 'development'){
		
		window.jsonData = {
    "signInFailure": false,
    "isSignUp": false,
    "isAuth": null,
    "userid": null,
    "latest": [],
    "hotest": [
        {
            "id": 1,
            "exercise": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\naaaaaaaaaaa\n",
            "answer": "a",
            "hints": "a",
            "author": 1,
            "creationdate": "09/10/2022 - 10:47",
            "title": "aaaaaaaaaaa\n",
            "rating": [],
            "tags": [],
            "explain": "a",
            "latex": "166280682532676",
            "authorName": "a",
            "list_latex": {
                "title": [],
                "exercise": [],
                "answer": [],
                "hints": [],
                "explain": []
            }
        }
			]
		}
			
	}
	const chalanges = window.jsonData['chalanges']
	const signInFailure = window.jsonData['signInFailure']
	const isSignUp = window.jsonData['isSignUp']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
	
  return (
  <>
    <Nav 
      narrowWindow = { window.nrw } 
      currentPage = { './../../../../../../../' }
      signInFailure = { signInFailure } 
      isSignUp = { isSignUp }
			isAuth = { isAuth }
			userid = { userid }
    />
		
		<Home/>
	</>
  );
}

export default App;
