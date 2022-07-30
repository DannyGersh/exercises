import useWindowResize from './shared/Functions'
import Nav from "./shared/nav/Nav"
import Browse from './Browse/Browse'
import './shared/Global.css'

function App() {
  
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
			'tags': ['math', 'science']
		};
		let chalanges = [chalange1, chalange2, chalange1, chalange2, chalange1, chalange2, chalange1, chalange2, chalange1, chalange2, chalange1, chalange2]
		window.jsonData = {
			'search term': 'math',
			'chalanges': chalanges,
			'signInFailure': false,
			'isSignUp': false,
			'isAuth': true,
			'userid': 1
			}
	}
	const chalanges = window.jsonData['chalanges']
	const signInFailure = window.jsonData['signInFailure']
	const isSignUp = window.jsonData['isSignUp']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
  const searchTerm = window.jsonData['search term']
		
  return (
  <>
    <Nav 
      narrowWindow = { window.nrw } 
      currentPage = { './../../../../../../browse/' + searchTerm }
      signInFailure = { signInFailure } 
      isSignUp = { isSignUp }
			isAuth = { isAuth }
			userid = { userid }
    />
		
    <Browse/>
	</>
  );
}

export default App;
