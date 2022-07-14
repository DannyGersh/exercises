import './Login.css'
import '../Global.css'
import CSRFToken from "../csrftoken";
import {useState} from 'react'

function Login(props){
  
  // ls - login or signin
  const [ls, setLs] = useState('login');
  function lsHandle(e) { 
    setLs(e.target.innerHTML); 
  }
  
  return(
  <div className='main'> 
    
    <div style={{'display':'flex'}}>
      <button className={`btnLs ${ls==='login' && 'noBottom'}`} onClick={lsHandle}>login</button>
      <button className={`btnLs ${ls==='signup' && 'noBottom'}`} onClick={lsHandle}>signup</button>
    </div>
	
    <div className={`mainBody ${ ls==='login' && 'mainShort'}`}>
	
      <form action={ ls==='login' ? '/login/': '/signup/'  } method='POST'>
        
        { process.env.NODE_ENV !== 'development' && <CSRFToken /> }
        
        <input type="hidden" name="login_signup" value={ls}/>
        <input type="hidden" name="currentPage" value={props.currentPage}/>
        
        <p>Display name:</p>
        <input name='uname' type='text'/>
        <p>Password:</p>
        <input name='password' type='password'/>
        
        { ls==='signup' &&
          <>
          <p>Verify password:</p>
          <input type='text'/>
          </>
        }
        
        <button className='btnLs bottom'>{ls==='login'? 'Log in': 'Sign up'}</button>
      
      </form>
    
    </div>
  </div>
  )
}
export default Login;  