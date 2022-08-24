import useWindowResize from './shared/Functions'
import Nav from "./shared/nav/Nav"
import './shared/Global.css'
import Home from './home/Home'

function App() {
  	
	// PERROR - the browser wont record this page on history for some reason
	window.history.pushState({}, '', window.location);
	
  window.nrw = useWindowResize(); // nrw - narrow window - boolean
	
	if( process.env.NODE_ENV === 'development'){
    
		let chalange = {
			"id": 98,
			"question": "$$___latex$$ exercise $$___latex$$",
			"answer": "$$___latex$$ answer $$___latex$$",
			"hints": "$$___latex$$ hints $$___latex$$",
			"author": "a",
			"creationdate": "08/23/2022 - 13:00",
			"title": "$$___latex$$ title $$___latex$$",
			"rating": [],
			"tags": [
	
				"science"
			],
			"explain": "$$___latex$$ explain $$___latex$$",
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
		
		let latest = [chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange]
		let hotest = [chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange,chalange]
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
