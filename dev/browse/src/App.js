import useWindowResize from './shared/functions'
import Nav from "./shared/nav/Nav"
import Browse from './Browse/Browse'

function App() {
  
  //console.log('poop', window.jsonData)
  
  let narrowWindow = useWindowResize();
  
  return (
  <>
	<Nav narrowWindow={narrowWindow}/>
    <Browse/>
	</>
  );
}

export default App;
