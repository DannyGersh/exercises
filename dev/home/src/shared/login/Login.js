import './Login.css'
import '../Global.css'
import CSRFToken from "../csrftoken";
import {useState, createRef} from 'react'

function Login(props){
  	
	// props:
  // signInFailure - true if user faild to sign in\up
	// isSignUp - true if user wase triyng to sign up
	// currentPage - string of previous page url
	
	// states:
	// lower - L
	// Upper - U
	// number - N
	// length - S
	const [Lcase, setLcase] = useState(false);
	const [Ucase, setUcase] = useState(false);
	const [Ncase, setNcase] = useState(false);
	const [Scase, setScase] = useState(false);
	const ref1 = createRef();

	function UcaseHandle() {
		
		let text = ref1.current.value;

		if( text.match(/[a-z]/) ) { setLcase(true) } else { setLcase(false) }
		if( text.match(/[A-Z]/) ) { setUcase(true) } else { setUcase(false) }
		if( text.match(/[0-9]/) ) { setNcase(true) } else { setNcase(false) }
		if( text.length > 5 ) { setScase(true) } else { setScase(false) }
	}
	
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
	
      <form id='with-captcha' action={ ls==='login' ? '/login/': '/signup/'  } method='POST'>
        
        { process.env.NODE_ENV !== 'development' && <CSRFToken /> }
        
        <input type="hidden" name="login_signup" value={ls}/>
        <input type="hidden" name="currentPage" value={props.currentPage}/>
        <input type="hidden" name="validated" value={Lcase && Ucase && Ncase && Scase}/>

        <p>Display name:</p>
        <input onClick={failureHandle} name='uname' type='text'/>
        <p>Password:</p>
        <input ref={ref1} onChange={UcaseHandle} onClick={failureHandle} name='password' type='password'/>
        
        { ls === 'signup' &&
          <>
          <p>Verify password:</p>
          <input onClick={failureHandle} name='Verify password' type='password'/>
          
					<div style={{'textAlign': 'left', 'padding-left': '1rem'}}>
					<p style={{color: `${Lcase ? 'green': 'red'}`}}>{Lcase ? '✓': 'x'} Lower case</p>
					<p style={{color: `${Ucase ? 'green': 'red'}`}}>{Ucase ? '✓': 'x'} Upper case</p>
					<p style={{color: `${Ncase ? 'green': 'red'}`}}>{Ncase ? '✓': 'x'} Number</p>
					<p style={{color: `${Scase ? 'green': 'red'}`}}>{Scase ? '✓': 'x'} more than 5 characters</p>
					</div>
					</>
        }
        
        { signInFailure &&
        <div style={{paddingTop: '0.5rem'}}>
          <p style={{color:'red', 'fontSize': '0.5rem'}}>* make sure all fields are correct to continue</p>
        </div>
        }
        
        <button className='btnLs bottom'>{ls==='login'? 'Log in': 'Sign up'}</button>
				
      </form>
    
    </div>
		
  </div>
  )
}
export default Login;  