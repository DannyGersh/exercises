import useWindowResize from './shared/Functions'
import Nav from "./shared/nav/Nav"
import './shared/Global.css'
import User from './user/User'

function App() {
  
  //console.log('poop', window.jsonData)
  
  let narrowWindow = useWindowResize();
  
  return (
  <>
	<Nav narrowWindow={narrowWindow}/>
	<User/>
  </>
  );
}

export default App;
