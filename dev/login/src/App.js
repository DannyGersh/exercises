import './shared/Global.css'
import useWindowResize from './shared/Functions'
import Nav from './shared/nav/Nav'
import Login from './login/Login'

function App() {

  window.nrw = useWindowResize();
  window.is_debug = (process.env.NODE_ENV === 'development');
  
  if( window.is_debug ){
    window.jsonData = {
      'isNew': false,
      'isAuth': false,
      'isLogIn': false,
      'userid': '1', 
    }
  }
  const isNew = window.jsonData['isNew'];
  const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']

  return (
    <>
    
    <Nav 
      narrowWindow = { window.nrw } 
      currentPage = { '/login' }
      isAuth = { isAuth }
      userid = { userid }
    />
    <Login/>
    </>
  )
  
} 

export default App;
