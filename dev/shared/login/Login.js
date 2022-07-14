import './Login.css'
import '../Global.css'
import CSRFToken from "../csrftoken";
import {useState} from 'react'

function Login(props){
  
  // ls - login or signin
  
  const [ls, setLs] = useState(props.isSignUp ? 'signup': 'login');
  const [signInFailure, setSignInFailure] = useState(props.signInFailure);
  
  function failureHandle() { 
    setSignInFailure(false); 
  }
  function lsHandle(e) { 
    setLs(e.target.innerHTML);
    failureHandle();    
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
        <input name='uname' type='text' onClick={failureHandle}/>
        <p>Password:</p>
        <input name='password' type='password' onClick={failureHandle}/>
        
        { ls === 'signup' &&
          <>
          <p>Verify password:</p>
          <input name='Verify password' type='password' onClick={failureHandle}/>
          </>
        }
        
        { signInFailure &&
        <div style={{'padding-top': '0.5rem'}}>
          <p style={{'color':'red', 'fontSize': '0.5rem'}}>* make sure all fields are correct to continue</p>
        </div>
        }
        
        <button className='btnLs bottom'>{ls==='login'? 'Log in': 'Sign up'}</button>
      
      </form>
    
    </div>
  </div>
  )
}
export default Login;  