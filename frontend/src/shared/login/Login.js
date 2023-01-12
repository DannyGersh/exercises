import './Login.css'
import '../Global.css'
import BtnRound from '../buttons/BtnRound'
import CSRFToken from "../csrftoken";
import {useState, createRef} from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import {sendData} from '../Functions'

function Login(props){
  	
	// props:
  // signInFailure - true if user faild to sign in\up
	// isSignUp - true if user wase triyng to sign up
	// currentPage - string of previous page url
	
	// states:
	// validate - L - lower 
	// validate - U - Upper 
	// validate - N - number
	// validate - S - length
	const [Lcase, setLcase] = useState(false);
	const [Ucase, setUcase] = useState(false);
	const [Ncase, setNcase] = useState(false);
	const [Scase, setScase] = useState(false);
	const ref1 = createRef();
	const ref_uname = createRef('');

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

  const ref_cap = createRef(window.isdebug ? 'isHuman' : false)
  const ref_terms = createRef(window.isdebug ? true : false)
  async function submitMainForm() {

  	if(ls==='signup') {
  		if(ref_cap.current==='isHuman' && ref_terms.current) {
  			
  			let proceed = true;
  			await sendData('testNameUnique', ref_uname.current.value)
					.then((response) => response.json())
					.then((data) => {
						if(!data['isUnique']) { 
							proceed = false;
							window.alert('display name taken, choose another one');
						}
					});

  			proceed && document.getElementById("mainForm").submit();

  		} else {
  			if(ref_cap.current!=='isHuman'){
  				window.alert("make sure that you are human.");
  			} else {
  				window.alert("please read the terms and conditions.");
  			}
  		}
  	} else {
  		document.getElementById("mainForm").submit();
  	}

  }

  return(
  <div className='main'> 
    
		<BtnRound onClick={props.sfLogin} className='escape blue'>x</BtnRound>
		
    <div style={{'display':'flex'}}>
      <button className={`btnLs ${ls==='login' && 'noBottom'}`} onClick={lsHandle}>login</button>
      <button className={`btnLs ${ls==='signup' && 'noBottom'}`} onClick={lsHandle}>signup</button>
    </div>
	
    <div className={`mainBody ${ ls==='login' && 'mainShort'}`}>
	
      <form id='mainForm' action={ ls==='login' ? '/login/': '/signup/'  } method='POST'>
        
        <CSRFToken/>
        
        <input type="hidden" name="login_signup" value={ls}/>
        <input type="hidden" name="currentPage" value={props.currentPage}/>
        <input type="hidden" name="validated" value={Lcase && Ucase && Ncase && Scase}/>

        <p>Display name:</p>
        <input ref={ref_uname} style={{width:'94%'}} onClick={failureHandle} name='uname' type='text'/>
        <p>Password:</p>
        <input style={{width:'94%'}} ref={ref1} onChange={UcaseHandle} onClick={failureHandle} name='password' type='password'/>
        
        { ls === 'signup' &&
          <>
          <p>Verify password:</p>
          <input style={{width:'94%'}} onClick={failureHandle} name='Verify password' type='password'/>
          
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
        
        { ls==='signup' &&
				<>
				<center>
				<ReCAPTCHA
    			sitekey={window.isdebug ? "6Ldtj_AhAAAAAFpTIwb_0P_2bLLnk_cu-SRlYbb5": "6LcK_fIhAAAAAJvixt45z9kf5DWYPYdDvvzhYfqS"}
    			onChange={()=>ref_cap.current='isHuman'}
    			onExpired={()=>ref_cap.current=false}
  			/>
  			</center> 
  			
  			<div style={{display:'flex', marginLeft:'0.5rem'}}>
  				<input onClick={(e)=>ref_terms.current=e.target.checked} type="checkbox" name="terms"/>
  				<p>I have read and agreed to the <a href={window.isdebug ? "http://localhost/terms/terms.txt": "http://www.ididthisforu.com/terms/terms.txt"}>terms and conditio</a></p>
  			</div>
  			</>
  			}     

        <button type='button' onClick={submitMainForm} className='btnLs bottom'>{ls==='login'? 'Log in': 'Sign up'}</button>

      </form>
    
    </div>
		
		
		
  </div>
  )
}
export default Login;  