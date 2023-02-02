import React, {useState, useRef} from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import {BtnTab} from '../../shared/buttons/Buttons'
import {sendData, isEmail} from '../../shared/Functions'
import {message_confirm_password} from '../../shared/Messages';
import ReCAPTCHA from "react-google-recaptcha";
import '../../shared/Global.css'
import './Register.css'


function Confirm(props) {
	
	//props:
	// uname (str)
	// email (str)
	// password (str)
	// confirm (str) - the confirm email password
	
	const navigate = useNavigate();

	const uname = props.uname;
	const email = props.email;
	const password = props.password;
	const confirm = useState(props.confirm);

	const ref_confirm = useRef('');
	
	function h_sendAgain() {
		sendData('fetch/newConfirmationPassword', 'POST', {
				'email': email,
			})
			.then(data=>{
				confirm[1](data['password']);
				window.alert('type in new confirmation password');
			})
	}
	function h_submit() {
		const val = ref_confirm.current.value;
		if(val===confirm[0]) {
			sendData('fetch/register_submit', 'POST', {
				'target': 'confirm',
				'uname': uname,
				'email': email,
				'password': password,
			})
			.then(data=>{
				window.userId[1](data.userId);
				window.alert('account created successfully')
				navigate('/');
			})
		} else {
			window.alert('wrong password');
		}
	}
	
	return(<>
		<h3>Fill in the 4 digit password that wase sent to your email</h3>
		
		<div style={{
			display: 'flex', 
			justifyContent: 'center', 
			width: '100%'
		}}>
			<input type="text" ref={ref_confirm}/>
			<button onClick={h_submit}>submit</button>
		</div>
		
		<p 
			className='send-again'
			onClick={h_sendAgain}
		>
			<ins>send again</ins>
		</p>
	</>);
}

function Login(props) {
	
	const navigate = useNavigate();
	const location = useLocation();
	
	const ref_cap = useRef(window.isDebug)
	const ref_terms = useRef(false);
	const ref_uname = useRef('');
	const ref_email = useRef('');
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
		
		else if(props.target === 'signup') { 
			
			const uname = ref_uname.current.value;
			
			// validate user name
			if(uname.length < 3 || uname.length > 20) {
				window.alert("make sure display name is valid");
				return;
			}
			// validate email
			else if(!isEmail(ref_email.current.value)) {
				window.alert("make sure email is valid.");
				return;
			}
			// passwords dont match
			else if(ref_password.current.value !== ref_confirm_password.current.value) {
				window.alert('password does not match verify password');
				return;
			}
			// validate password
			else if(!Lcase[0] || !Ucase[0] || !Ncase[0] || !Scase[0]) {
				window.alert("make sure password is valid.");
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
			
			// dont convert last "else if" to "else".
			// this is to ensure the script keeps on going.
		}

		if(props.target==='signup') {
			if(!window.confirm(message_confirm_password)) {
				return;
			}
		}

		sendData('fetch/register_submit', 'POST', {
			'target': props.target,
			'uname': ref_uname.current.value,
			'email': ref_email.current ? ref_email.current.value : '',
			'password': ref_password.current.value,
		})
		.then(data=>{
			console.log("AAAAAAAA", props.target, data);
			if(Object.keys(data).length){
				if(props.target === 'signup') {
					//window.alert('account created successfully');
					navigate('/confirm_signup', {state:{
						uname: ref_uname.current.value, 
						email: ref_email.current.value, 
						password: ref_password.current.value,
						confirm: data.confirm
					}});
				} else if (props.target === 'login') {
					if(data.userId) {
						window.userId[1](data.userId);
						navigate('/');
					}
				}			
			}
		})
	}

	return(
	<center style={{margin:'1rem'}}>

    { props.target === 'login' && 
		<>

		<p>Display name:</p>
		<input ref={ref_uname} name='uname' type='text'/>
		<p>Password:</p>
		<input ref={ref_password} name='password' type='password'/>

		<br/><br/>

		<BtnTab 
			className='green' 
			onClick={submitMain}
		>Log in</BtnTab>

		<br/><br/>
		<Link to='/signup/'>Sign Up here</Link>
		</>
	}
    { props.target === 'signup' &&
		<>
		
		<p>Display name:</p>
		<input 
			ref={ref_uname} 
			name='uname' 
			type='text'
		/>
		
		<p>Email:</p>
		<input 
			ref={ref_email} 
			name='email' 
			type='text'
		/>
		
		<p>Password:</p>
		<input 
			onChange={validate} 
			ref={ref_password} 
			name='password' 
			type='password'
		/>
		
		<p>Verify password:</p>
		<input 
			name='Verify password' 
			ref={ref_confirm_password} 
			type='password'
		/>
		
		<div>
		<p style={{color: `${Lcase[0] ? 'green': 'red'}`}}>
			{Lcase[0] ? '✓': 'x'} Lower case
		</p>
		
		<p style={{color: `${Ucase[0] ? 'green': 'red'}`}}>
			{Ucase[0] ? '✓': 'x'} Upper case
		</p>
		
		<p style={{color: `${Ncase[0] ? 'green': 'red'}`}}>
			{Ncase[0] ? '✓': 'x'} Number
		</p>
		
		<p style={{color: `${Scase[0] ? 'green': 'red'}`}}>
			{Scase[0] ? '✓': 'x'} more than 7 characters
		</p>
		
		</div>
		
		<ReCAPTCHA
		sitekey={window.isDebug ? 
			'6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
			: '6LcuHc4jAAAAAJZ4TULnXONYgmbDcwoBf7YHgrT0'
		}
		onChange={()=>ref_cap.current=true}
		onExpired={()=>ref_cap.current=false}
		/>
		
		<div style={{display:'flex', justifyContent: 'center'}}>
			<input 
				onClick={(e)=>ref_terms.current=e.target.checked} 
				type="checkbox" name="terms"/>
			<p>
				I have read and agreed to the &nbsp;
				<a href='/static/terms.txt' target="_blank">terms and conditions</a>
			</p>
		</div>  
		
		<br/>
		
		<BtnTab 
			className='green' 
			onClick={submitMain}
		>Sign up</BtnTab>
				
		</>
    }
    { props.target === 'confirm_signup' && 
		<Confirm 
			uname={location.state.uname} 
			email={location.state.email} 
			password={location.state.password} 
			confirm={location.state.confirm} 
		/> 
	}
	</center>

	)
}
export default Login;
