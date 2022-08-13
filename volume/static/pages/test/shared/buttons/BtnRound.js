import './BtnRound.css'
//import {useState} from 'react'

function BtnRound(props){
  
  // purpose - static or on\of button
  // example use:
  // const [state, setState] = useState('');
  // <BtnRound state={[state, setState]} onClick={func}>Button text</BtnRound>
  // <BtnRound>Button text</BtnRound>

  // props:
	//	state - [state, setState] - state is being set outside, no nid for handle function.
	//	style, type, onClick, className
	
  let state = props.state; let dinamic = true;
  if(!state) { state=[0, ()=>{}]; dinamic = false; } //dummy incase not set
  
  function onHandle(){
		state[1](!state[0]);
		if(props.onClick) props.onClick();
  }
	
  if(dinamic) {
  
    return(
      <button 
				style={props.style} 
				type={props.type==='submit'? 'submit': 'button'} 
				onClick={onHandle} 
				className={`btnRound ${state[0] ? 'activeGreen': 'activeBlue'} ${props.className}`}
			>
				{props.children}
			</button>
    )
    
  } else { // static button
		return(
			<button 
				type='button' 
				style={props.style} 
				onClick={props.onClick}
				className={`btnRound ${state[0] && "BtnColorGreen"} ${props.className}`}
			>
				{props.children}
			</button>
		)
  }
    
}
export default BtnRound;