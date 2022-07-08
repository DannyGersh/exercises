import './BtnRound.css'
import {useState} from 'react'

function BtnRound(props){
  
  // props.type = "submit" or "static"
  // submit - for submit button
  // static - for non changing button
  
  let [on, setOn] = useState(props.on);
  function onHandle(){
	setOn(!on);
  }
  
  if(props.active === true) {
  
    return(
    <>
      { on ? 
        <button type={props.type} onClick={onHandle} className='btnRound activeGreen'>{props.children}</button>:
        <button type={props.type} onClick={onHandle} className='btnRound activeBlue'>{props.children}</button>
      }
    </>
    )
    
  } else if(props.on == false) {
	return(
	  <>
	    <button className='btnRound'>{props.children}</button>
	  </>
	)
  } else {
	return(
	  <>
	    <button className='btnRound BtnColorGreen'>{props.children}</button>
	  </>
	)  
  }
    
}
export default BtnRound;