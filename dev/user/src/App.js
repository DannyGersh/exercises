import useWindowResize from './shared/Functions'
import Nav from "./shared/nav/Nav"
import './shared/Global.css'
import User from './user/User'

function App() {
  
  //console.log('poop', window.jsonData)
  
  let narrowWindow = useWindowResize();
  if( process.env.NODE_ENV === 'development'){
		window.jsonData = {
			'search term': 'math',
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
