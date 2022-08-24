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
		
		window.jsonData = {
			'data': [
				[
					{
						"id": 98,
						"question": "$$___latex$$ test $$___latex$$",
						"answer": "$$___latex$$ test $$___latex$$",
						"hints": "$$___latex$$ test $$___latex$$",
						"author": "a",
						"creationdate": "08/23/2022 - 13:00",
						"title": "$$___latex$$ test $$___latex$$",
						"rating": [],
						"tags": [

							"science"
						],
						"explain": "$$___latex$$ test $$___latex$$",
						"latex": "1661261957510381",
						"list_latex": {
							"title": [
								[
									"\\(\\frac{1}{2}\\)",
									"16612618266535265"
								],
								[
									"\\(\\sqrt{\\frac{1}{\\frac{3}{4}}}\\)",
									"16612618294915612"
								]
							],
							"exercise": [
								[
									"\\(\\frac{1}{2}\\)",
									"1661261831666112"
								],
								[
									"\\(\\sqrt{\\frac{1}{\\frac{3}{4}}}\\)",
									"16612618332350814"
								]
							],
							"answer": [
								[
									"\\(\\frac{1}{2}\\)",
									"16612618350956101"
								],
								[
									"\\(\\sqrt{\\frac{1}{\\frac{3}{4}}}\\)",
									"16612618362604136"
								]
							],
							"hints": [
								[
									"\\(\\frac{1}{2}\\)",
									"16612618380124574"
								],
								[
									"\\(\\sqrt{\\frac{1}{\\frac{3}{4}}}\\)",
									"1661261839569922"
								]
							],
							"explain": [
								[
									"\\(\\frac{1}{2}\\)",
									"16612618410875106"
								],
								[
									"\\(\\sqrt{\\frac{1}{\\frac{3}{4}}}\\)",
									"16612618422952714"
								]
							]
						},
						"authid": 3
					}
				], [], "a"
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
