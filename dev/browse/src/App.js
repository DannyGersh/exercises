import useWindowResize from './shared/functions'
import Nav from "./shared/nav/Nav"
import Browse from './Browse/Browse'
import './shared/Global.css'

function App() {
  
  //console.log('poop', window.jsonData)
  
  let narrowWindow = useWindowResize();
  if( process.env.NODE_ENV === 'development'){
    window.jsonData = {'search term': 'math'}; 
  }
  
  return (
  <>
    <Nav 
      narrowWindow={narrowWindow}
      currentPage={'./../../../../../../browse/' + window.jsonData['search term'] }
    />
    <Browse/>
	</>
  );
}

export default App;
