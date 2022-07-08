import Chalange from './chalange/Chalange'
import Nav from './shared/nav/Nav'
import useWindowResize from './shared/functions'
import './shared/Global.css'

function App() {

  let narrowWindow = useWindowResize();
  
  return (
    <>
    <Nav narrowWindow={narrowWindow}/>
    <Chalange narrowWindow={narrowWindow}/>
    </>
  )
	
} 

export default App;
