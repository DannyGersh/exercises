import useWindowResize from './shared/functions'
import Nav from "./shared/nav/Nav"
import Browse from './Browse/Browse'
import './shared/Global.css'

function App() {
  
  //console.log('poop', window.jsonData)
  
  let narrowWindow = useWindowResize();
  
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
			'question': 'test question', 
			'answer': 'test answer', 
			'hints': 'test hints', 
			'author': 'test author', 
			'creationdate': '27-7-1996', 
			'title': 'test title', 
			'rating': ['b','c'], 
			'tags': ['math', 'science']
		};
		let chalanges = [chalange1, chalange2]
		window.jsonData = {
			'search term': 'math',
			'chalanges': chalanges,
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
      narrowWindow={narrowWindow}
      currentPage={'./../../../../../../browse/' + window.jsonData['search term'] }
    />
    <Browse/>
	</>
  );
}

export default App;
