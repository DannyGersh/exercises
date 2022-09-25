import '../shared/Global.css'
import CSRFToken from "../shared/csrftoken";
import ReCAPTCHA from "react-google-recaptcha";
import BtnMenue from '../shared/buttons/BtnMenue'
import {sendData} from '../shared/Functions'
import {useState, createRef, useEffect} from 'react'

function Login(props) {
	
	const isLogin = window.jsonData['isLogIn'];
	
	const ref_cap = createRef(window.is_debug)
	const ref_terms = createRef(false)
	const ref_uname = createRef('');
	const ref_password = createRef('');
	const ref_confirm_password = createRef('');

	const Lcase = useState(false);
	const Ucase = useState(false);
	const Ncase = useState(false);
	const Scase = useState(false);
	
	function validate() {
		
		let text = ref_password.current.value;

		Lcase[1](text.match(/[a-z]/));
		Ucase[1](text.match(/[A-Z]/));
		Ncase[1](text.match(/[0-9]/));
		Scase[1](text.length > 7);
	}

	async function submitMainForm() {
	  	
	  	// NOTE - validate
		
		let proceed = true;
	  			
	  	if(!ref_uname.current.value || !ref_password.current.value) {
			window.alert('make sure all fields are valid');
			proceed = false;
	  	}
	  	
	  	else if(!isLogin) { // signup
	  		if(ref_password.current.value !== ref_confirm_password.current.value) {
	  			window.alert('password does not match verify password');
	  			proceed = false;
	  		}
	  		else if(!ref_cap.current) {
	  			window.alert("make sure that you are human.");
	  			proceed = false;
	  		}
	  		else if(!ref_terms.current) {
	  			window.alert("please read the terms and conditions.");
	  			proceed = false;
	  		}
	  	}
	  	// dont convert last "else if" to "else".

	  	// let server check if uname is unique on signup
	  	if(!isLogin && proceed) {
	  		await sendData('testNameUnique', ref_uname.current.value)
				.then((response) => response.json())
				.then((data) => {
					if(!data['isUnique']) { 
						window.alert('display name taken, choose another one');
						proceed = false;
					}
			});
	  	}

	  	// NOTE_END - validate

	  	if(proceed) {
	  		document.getElementById("mainForm").submit();
	  	}

	}

	return(
	<center style={{margin:'1rem'}}>

	<form id='mainForm' action={ window.jsonData['isLogIn'] ? '/submitLogIn/' : '/submitSignUp/' } method='POST'>
        
    <CSRFToken/>
        
    <input type="hidden" name="login_signup" value={isLogin}/>
    <input type="hidden" name="currentPage" value={props.currentPage}/>
    <input type="hidden" name="validated" value={Lcase && Ucase && Ncase && Scase}/>

    { window.jsonData['isLogIn'] && 
		<>

		<p>Display name:</p>
    	<input ref={ref_uname} name='uname' type='text'/>
    	<p>Password:</p>
    	<input ref={ref_password} name='password' type='password'/>

    	<br/><br/>
 		<BtnMenue className='green' onClick={submitMainForm} type='button'>{isLogin ? 'Log in': 'Sign up'}</BtnMenue>
 		<br/><br/>
 		<a href='/signup/'>Sign Up here</a>
    	</>
    }
    { !window.jsonData['isLogIn'] &&
    	<>

    	<p>Display name:</p>
    	<input ref={ref_uname} name='uname' type='text'/>
    	<p>Password:</p>
    	<input onChange={validate} ref={ref_password} name='password' type='password'/>
    	<p>Verify password:</p>
    	<input name='Verify password' ref={ref_confirm_password} type='password'/>
          
		<div>
		<p style={{color: `${Lcase[0] ? 'green': 'red'}`}}>{Lcase[0] ? '✓': 'x'} Lower case</p>
		<p style={{color: `${Ucase[0] ? 'green': 'red'}`}}>{Ucase[0] ? '✓': 'x'} Upper case</p>
		<p style={{color: `${Ncase[0] ? 'green': 'red'}`}}>{Ncase[0] ? '✓': 'x'} Number</p>
		<p style={{color: `${Scase[0] ? 'green': 'red'}`}}>{Scase[0] ? '✓': 'x'} more than 7 characters</p>
		</div>
		
		{ !window.is_debug &&
		<ReCAPTCHA
    	sitekey={window.isdebug ? "6Ldtj_AhAAAAAFpTIwb_0P_2bLLnk_cu-SRlYbb5": "6LdeXCsiAAAAALHCw874KA8T09tr1iECZcwQ8n8v"}
    	onChange={()=>ref_cap.current=true}
    	onExpired={()=>ref_cap.current=false}
  		/>
  		}

  		<div style={{display:'flex', justifyContent: 'center'}}>
  			<input onClick={(e)=>ref_terms.current=e.target.checked} type="checkbox" name="terms"/>
  			<p>I have read and agreed to the <a href={window.isdebug ? "http://localhost/terms/terms.txt": "http://www.ididthisforu.com/terms/terms.txt"}>terms and conditions</a></p>
  		</div>  

    	<br/>
 		<BtnMenue className='green' onClick={submitMainForm} type='button'>{isLogin ? 'Log in': 'Sign up'}</BtnMenue>

		</>
    }
        
    
    </form>
	</center>
	)
}
export default Login;