import '../shared/Global.css'
import CSRFToken from "../shared/csrftoken";
import ReCAPTCHA from "react-google-recaptcha";
import BtnMenue from '../shared/buttons/BtnMenue'
import {sendData} from '../shared/Functions'
import {useState, useRef, useEffect} from 'react'

function Login(props) {
	
	const isLogin = window.jsonData['isLogIn'];
	
	const ref_cap = useRef(window.isdebug)
	const ref_terms = useRef(window.isdebug)
	const ref_uname = useRef('');
	const ref_password = useRef('');
	const ref_confirm_password = useRef('');

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

	async function submitMain() {
	  	
	  	// ceck if empty		
	  	if(!ref_uname.current.value || !ref_password.current.value) {
			window.alert('make sure all fields are valid');
			return;
	  	}
	  	
	  	// signup
	  	else if(!isLogin) { 

	  		// passwords dont match
	  		if(ref_password.current.value !== ref_confirm_password.current.value) {
	  			window.alert('password does not match verify password');
	  			return;
	  		}
	  		// captcha not human
	  		else if(!ref_cap.current) {
	  			window.alert("make sure that you are human.");
	  			return;
	  		}
	  		// terms not checked
	  		else if(!ref_terms.current) {
	  			window.alert("please read the terms and conditions.");
	  			return;
	  		}
	  		// validate password
	  		else if(!Lcase[0] || !Ucase[0] || !Ncase[0] || !Scase[0]) {
	  			window.alert("make sure password is valid.");
	  			return;
	  		}
	  		// dont convert last "else if" to "else".
	  		// this is to ensure the script keeps on going.
	  	}

	  	if(isLogin) {

	  		sendData('submitLogIn', {
				'uname': ref_uname.current.value,
				'password': ref_password.current.value,
			})
			.then(data=>window.location = data['url'])
	  	
	  	} else { // sign up
	  		
			sendData('submitSignUp', {
				'uname': ref_uname.current.value,
				'password': ref_password.current.value,
			})
			.then(data=>{
				if(!data['error']) {
					window.alert('Thank you for signing up!');
					window.location = '/';
				}
			})

		}

	}

	return(
	<center style={{margin:'1rem'}}>

    { window.jsonData['isLogIn'] && 
		<>

		<p>Display name:</p>
    	<input ref={ref_uname} name='uname' type='text'/>
    	<p>Password:</p>
    	<input ref={ref_password} name='password' type='password'/>

    	<br/><br/>
 		<BtnMenue className='green' onClick={submitMain} type='button'>{isLogin ? 'Log in': 'Sign up'}</BtnMenue>
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
		
		{ !window.isdebug &&
		<ReCAPTCHA
    	sitekey={window.isdebug ? "6Ldtj_AhAAAAAFpTIwb_0P_2bLLnk_cu-SRlYbb5": "6Ld73kkiAAAAAM7Pp9rgeUTA9uBZEdojcYiadpuk"}
    	onChange={()=>ref_cap.current=true}
    	onExpired={()=>ref_cap.current=false}
  		/>
  		}

  		<div style={{display:'flex', justifyContent: 'center'}}>
  			<input onClick={(e)=>ref_terms.current=e.target.checked} type="checkbox" name="terms"/>
  			<p>I have read and agreed to the <a href={window.isdebug ? "http://localhost/terms/terms.txt": "http://www.ididthisforu.com/terms/terms.txt"}>terms and conditions</a></p>
  		</div>  

    	<br/>
 		<BtnMenue className='green' onClick={submitMain} type='button'>{isLogin ? 'Log in': 'Sign up'}</BtnMenue>

		</>
    }
    
	</center>

	)
}
export default Login;