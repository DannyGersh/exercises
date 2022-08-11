import {useState} from 'react'

function useWindowResize(){
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
  return narrowWindow;
}
export default useWindowResize;

function remToPx(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
export {remToPx};
	
