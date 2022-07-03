import Chalange from './Chalange'
import {useState} from 'react'
import Nav from './shared/Nav'

function App() {

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

  return (
    <>
    <Nav narrowWindow={narrowWindow}/>
    <Chalange narrowWindow={narrowWindow}/>
    </>
  )
	
}

export default App;
