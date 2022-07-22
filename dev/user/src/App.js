import useWindowResize from './shared/Functions'
import Nav from "./shared/nav/Nav"
import './shared/Global.css'
import User from './user/User'

function App() {
  
	// PERROR - the browser wont record this page on history for some reason
	window.history.pushState({}, '', window.location);
	
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
		let answered = [chalange];
		let liked = [chalange]
		let data = [answered, liked, "Boris"]
		
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
	const answered = window.jsonData['data'][0]
	const liked = window.jsonData['data'][1]
	const userName = window.jsonData['data'][2]
	
  return (
    <>
    <Nav 
      narrowWindow = { narrowWindow } 
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
