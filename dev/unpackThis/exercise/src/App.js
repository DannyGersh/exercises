import {useState} from 'react';
import './styles.css'
import Nav from './shared/Nav.js'


let startNarrowWindow = false;
if( window.innerWidth / window.innerHeight < 1.1 ){
	startNarrowWindow = true;
}
else{
	startNarrowWindow = false;
}
  
function App() {

  console.log('pooop', window.jsonData);
  
  const [narrowWindow, setNarrowWindow] = useState(startNarrowWindow);
  
  function windowResizeHandler(){
  	const w = window.innerWidth;
  	const h = window.innerHeight;
  	if( w /h < 1.1 ){
  		setNarrowWindow(true);
  	}
  	else{
  		setNarrowWindow(false);
  	}
  }
  window.addEventListener('resize', windowResizeHandler);

if(narrowWindow){
  return (
    <div>
      <Nav poop={{narrowWindow}}/>
    </div>
  )
} else {
  return (
    <div>
      <Nav poop={{narrowWindow}}/>
    </div>
  )
}

	
}

export default App;
