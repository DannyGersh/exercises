import Exercise from '../shared/exercise/Exercise'
import BtnMenue from '../shared/buttons/BtnMenue'
import {useState, useRef, useEffect} from 'react'
import './User.css'

function User(){

  //let answered = {
  //0: [3, 'question 2', 'answer 2', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title(answered)', ['a','b','c', 'd'], ['math', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1']],
  //1: [2, 'question 1', 'answer 1', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title(answered)', ['a','b','c'], ['math', 'tag1']],
  //2: [4, 'question 3', 'answer 3', '', 'test-Author', '2022-07-03T20:40:36.210', 'test title(answered)', ['a','b','c'], ['math', 'tag1']],
  //}
  //let liked = {
  //0: [3, 'question 2', 'answer 2', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title (liked)', ['a','b','c', 'd'], ['math', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1']],
  //1: [2, 'question 1', 'answer 1', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title (liked)', ['a','b','c'], ['math', 'tag1']],
  //2: [4, 'question 3', 'answer 3', '', 'test-Author', '2022-07-03T20:40:36.210', 'test title(liked)', ['a','b','c'], ['math', 'tag1']],
  //}
  //window.jsonData = [answered, liked]
  //let items = Object.values(window.jsonData[0]);
  //console.log(window.jsonData[0])
  
  let user = window.jsonData[2];
  
  let [menueSelection, setMenueSelection] = useState("Answered");
  function menueHandle(event, selection){
	setMenueSelection(selection);
  }
  
  const refA = useRef();
  const refB = useRef();
  
  function onNavDropDown(){
	if(refA.current) {
		let q = refA.current.offsetTop + refA.current.offsetHeight;
		refB.current.style.top = String(q)+"px";
	}
  }
  window.addEventListener("navDropDown", onNavDropDown)
  useEffect(() => {
	onNavDropDown();
  })
  
  function selectMenue(selection){
	switch (selection){
		case "Answered":
		  return Object.values(window.jsonData[0]);
		  break;
		case "Liked":
		  return Object.values(window.jsonData[1]);
		  break;
		default:
		  return Object.values(window.jsonData[0]);
		  break;
	}
  }
  
  return(
    <>	
	<p style={{'padding': '0rem 0rem 0rem 1rem'}}>welcome {user}</p>
	
	<div ref={refA} style={{'padding': '0rem 0rem 0rem 0.3rem'}}>
	  <BtnMenue onClick={(e)=>menueHandle(e,"Answered")}>Answered</BtnMenue>
	  <BtnMenue onClick={(e)=>menueHandle(e,"Liked")}>Liked</BtnMenue>
	</div>
	
	<div ref={refB} className="qscroll">
	{
	  selectMenue(menueSelection).map( (item, i) =>
        <Exercise 
	      key={i}
	      title={item[6]} 
	      paragraph={item[1]} 
	      url={'../../' + item[0]} 
	      likes={item[7].length} 
	      tags={item[8]}
	    />
      )
	}	
	</div>
	</>
  )
}
export default User;