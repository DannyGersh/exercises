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
		let authored = [chalange];
		let liked = [chalange, chalange, chalange];
		let answered = [chalange, chalange];
		let data = [authored, liked, answered, "Boris"];
		
		window.jsonData = {
			'data': data,
			'signInFailure': false,
			'isSignUp': false,
			'isAuth': true,
			'userid': 1
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
