import React, {useState, useRef} from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import {BtnTab} from '../../shared/buttons/Buttons'
import * as CON from '../../shared/Functions'
import {msg} from '../../shared/Messages';
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
		CON.sendData('fetch/newConfirmationPassword', 'POST', {
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
			CON.sendData('fetch/register_submit', 'POST', {
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
		Scase[1](text.length >= CON.MIN_PASS_LEN);
	}

	async function submitMain() {
		
		// ceck if empty		
		if(!ref_uname.current.value || !ref_password.current.value) {
			window.alert(msg.input_not_valid);
			return;
		}
		
		else if(props.target === 'signup') { 
			
			const uname = ref_uname.current.value;
			
			// validate user name
			if(uname.length < CON.MIN_UNAME_LEN) {
				window.alert(msg.uname_short);
				return;
			}
			// validate user name
			else if(uname.length > CON.MAX_UNAME_LEN) {
				window.alert(msg.uname_long);
				return;
			}
			// validate email
			else if(!CON.isEmail(ref_email.current.value)) {
				window.alert(msg.valid_email);
				return;
			}
			// passwords dont match
			else if(ref_password.current.value !== ref_confirm_password.current.value) {
				window.alert(msg.pass_mismatch);
				return;
			}
			// validate password
			else if(ref_password.current.value.length < CON.MIN_PASS_LEN) {
				window.alert(msg.pass_short);
				return;
			}
			// validate password
			else if(ref_password.current.value.length >= CON.MAX_PASS_LEN) {
				window.alert(msg.pass_long);
				return;
			}
			// validate password
			else if(!Lcase[0] || !Ucase[0] || !Ncase[0] || !Scase[0]) {
				window.alert(msg.valid_password);
				return;
			}
			// captcha not human
			else if(!ref_cap.current) {
				window.alert(msg.ver_human);
				return;
			}
			// terms not checked
			else if(!ref_terms.current) {
				window.alert(msg.read_terms);
				return;
			}
			
			// dont convert last "else if" to "else".
			// this is to ensure the script keeps on going.
		}

		if(props.target==='signup') {
			if(!window.confirm(msg.no_pass_redoo)) {
				return;
			}
		}

		CON.sendData('fetch/register_submit', 'POST', {
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
	<form>
	<center style={{margin:'1rem'}}>

    { props.target === 'login' && 
		<>
		<label htmlFor='uname'>Display name:</label>
		<input id='uname' name='uname' ref={ref_uname} type='text'/>
		<label htmlFor='password'>Password:</label>
		<input id='password' name='password' ref={ref_password} type='password'/>		
		
		<br/><br/>

		<BtnTab 
			className='green' 
			onClick={submitMain}
		>Log in</BtnTab>

		<br/><br/>
		<Link to='/signup/'>Sign up here</Link>
		</>
	}
    { props.target === 'signup' &&
		<>

		<div style={{display:'block', textAlign: 'left'}}>
		<label htmlFor='uname'>Display name:</label>
		<input 
			ref={ref_uname} 
			name='uname' 
			id='uname' 
			type='text'
			data-testid="id_input_uname"
		/>
		<br/>
		<label htmlFor='email'>Email:</label>
		<input 
			ref={ref_email} 
			name='email' 
			id='email' 
			type='text'
			data-testid="id_input_email"
		/>
		<br/>
		<label htmlFor='password'>Password:</label>
		<input 
			onChange={validate} 
			ref={ref_password} 
			name='password' 
			id='password' 
			type='password'
			data-testid="id_input_password"
		/>
		<br/>
		<label htmlFor='Verify password'>Verify password:</label>
		<input 
			name='Verify password' 
			id='Verify password' 
			ref={ref_confirm_password} 
			type='password'
			data-testid="id_input_ver_password"
		/>
		</div>
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
				id='terms'
				data-testid='id_input_radio_conditions'
				onClick={(e)=>ref_terms.current=e.target.checked} 
				type="checkbox" 
				name="terms"/>
			<label htmlFor='terms'>
				I have read and agreed to the &nbsp;
				<a href='/static/terms.txt' target="_blank">terms and conditions</a>
			</label>
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
	</form>
	)
}
export default Login;
