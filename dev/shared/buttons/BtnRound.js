import './BtnRound.css'
//import {useState} from 'react'

function BtnRound(props){
  
  // purpose - static or on\of button
  // example use:
  // const [state, setState] = useState('');
  // <BtnRound state={[state, setState]} onClick={func}>Button text</BtnRound>
  // <BtnRound>Button text</BtnRound>

  // props.state - [state, setState] - state is being set outside, no nid for handle function.
  // props.type = "submit" or "static"
  //   submit - for submit button
  //   static - for non changing button
  
  let state = props.state; let dinamic = true;
  if(!state) { state=[0,(x)=> {}]; dinamic = false; } //dummy incase not set
  
  function onHandle(){
	state[1](!state[0]);
	if(props.onClick) props.onClick();
  }
  
  if(dinamic) {
  
    return(
    <>
      { state[0] ? 
        <button type={props.type} onClick={onHandle} className='btnRound activeGreen'>{props.children}</button>:
        <button type={props.type} onClick={onHandle} className='btnRound activeBlue'>{props.children}</button>
      }
    </>
    )
    
  } else { // static button
	return(
	  <>
	  	<button className={'btnRound ${state[0] && "BtnColorGreen"}'}>{props.children}</button>
	  </>
	)
  }
    
}
export default BtnRound;