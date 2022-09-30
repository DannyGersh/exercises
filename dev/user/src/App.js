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
		
		window.jsonData = 
{
    "isAuth": true,
    "userid": 1,
    "messages": [
        // [messageId, chalangeId, message_creation_date, sender_name, message_text]        
        [1, 1, '16:51 09/08/2022', 'sender 1', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], 
        [2, 2, '16:51 09/08/2022', 'sender 2', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], 
        [3, 3, '16:51 09/08/2022', 'sender 3', 'Test message c'], 
        [4, 4, '16:51 09/08/2022', 'sender 4', 'Test message d'], 
        [5, 5, '16:51 09/08/2022', 'sender 5', 'Test message e'], 
        [6, 6, '16:51 09/08/2022', 'sender 6', 'Test message f'], 
        [7, 7, '16:51 09/08/2022', 'sender 7', 'Test message g'], 
        [8, 8, '16:51 09/08/2022', 'sender 8', 'Test message h']
    ],
    "data": [
        [
            {
                "id": 1,
                "exercise": "a",
                "answer": "a",
                "hints": "a",
                "author": 1,
                "creationdate": "09/10/2022 - 10:47",
                "title": "a",
                "rating": [],
                "tags": [],
                "explain": "a",
                "latex": "",
                "authorName": "a",
                "list_latex": {
                    "title": [],
                    "exercise": [],
                    "answer": [],
                    "hints": [],
                    "explain": []
                }
            }
        ],
        [
            {
                "id": 1,
                "exercise": "b",
                "answer": "b",
                "hints": "b",
                "author": 1,
                "creationdate": "09/10/2022 - 10:47",
                "title": "b",
                "rating": [],
                "tags": [],
                "explain": "b",
                "latex": "",
                "authorName": "b",
                "list_latex": {
                    "title": [],
                    "exercise": [],
                    "answer": [],
                    "hints": [],
                    "explain": []
                }
            }
        ],
        "a"
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
