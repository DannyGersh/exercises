import useWindowResize from './shared/Functions'
import Nav from "./shared/nav/Nav"
import './shared/Global.css'
import Home from './home/Home'

function App() {
  
	// PERROR - the browser wont record this page on history for some reason
	window.history.pushState({}, '', window.location);
	
  window.nrw = useWindowResize(); // nrw - narrow window - boolean
	
	if( process.env.NODE_ENV === 'development'){
    let chalange1 = {
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
		let chalange2 = {
			'id': 2, 
			'question': 'test question 2', 
			'answer': 'test answer 2', 
			'hints': 'test hints 2', 
			'author': 'test author 2', 
			'creationdate': '27-7-1996', 
			'title': 'test title 2', 
			'rating': ['b','c'], 
			'tags': ['math 2', 'science 2']
		};
		let latest = [chalange1, chalange1,chalange1,chalange1,chalange1,chalange1,chalange1,chalange1,chalange1,chalange1,chalange1]
		let hotest = [chalange2, chalange2,chalange2,chalange2,chalange2,chalange2,chalange2,chalange2,chalange2,chalange2,chalange2]
		window.jsonData = {
			'latest': latest,
			'hotest': hotest,
			'signInFailure': false,
			'isSignUp': false,
			'isAuth': false,
			'userid': 1
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
