import {useState} from 'react';
import Nav from './Nav'

function Body(props){

  /*
  let WidthHeightRatio = 1.1;
  const [narrowWindow, setNarrowWindow] = useState(
      (window.innerWidth / window.innerHeight < WidthHeightRatio)
      ? true : false
  );
  
  function windowResizeHandler(){
  	const w = window.innerWidth;
  	const h = window.innerHeight;

    if( w / h < WidthHeightRatio ){
  		setNarrowWindow(true);
  	} else {
  		setNarrowWindow(false);
  	}
  }

  window.addEventListener('resize', windowResizeHandler);
  */

  return(
    <div>
        <Nav narrowWindow={props.narrowWindow}/>
        {props.children}
    </div>
  )
}
export default Body;
