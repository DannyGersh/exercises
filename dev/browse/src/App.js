import useWindowResize from './shared/functions'
import Nav from "./shared/Nav"
//import Browse from './Browse'

function App() {
  
  console.log('poop', window.jsonData)
  
  let narrowWindow = useWindowResize();
  
  return (
  <>
	<Nav narrowWindow={narrowWindow}/>
    <h1>poop</h1>
	</>
  );
}

export default App;
