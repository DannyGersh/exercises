import Chalange from './chalange/Chalange'
import Nav from './shared/nav/Nav'
import useWindowResize from './shared/Functions'
import './shared/Global.css'


function App() {

  let narrowWindow = useWindowResize();
  
	if( process.env.NODE_ENV === 'development'){
    let chalange = {
			'id': 2, 
			'question': 'test $$___latex$$ question', 
			'answer': 'test $$___latex$$ answer', 
			'hints': 'test $$___latex$$ hints', 
			'author': 'test author', 
			'creationdate': '27-7-1996', 
			'title': 'test $$___latex$$ title', 
			'rating': ['b','c'], 
			'tags': ['math', 'science'],
			'explain': 'ladida $$___latex$$ ladida',
			'authid': '1',
			// latex currently onley works in production
			'latex': '1660953238601182',
			'list_latex': {'title': [['A', '16609532299723427']], 'exercise': [['A', '16609532339731061']], 'answer': [['A', '16609532352807']], 'hints': [['A', '16609532352807']], 'explain': [['A', '16609532352807']]}
		};
		
		window.jsonData = {
			'chalange': chalange,
			'signInFailure': false,
			'isSignUp': false,
			'isAuth': false,
			'userid': null
			}
	}
	const chalange = window.jsonData['chalange']
	const signInFailure = window.jsonData['signInFailure']
	const isSignUp = window.jsonData['isSignUp']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
	console.log(chalange['list_latex'])
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
