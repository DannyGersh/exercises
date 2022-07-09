import Exercise from '../shared/exercise/Exercise'
import BtnMenue from '../shared/buttons/BtnMenue'
import {useState, useRef, useEffect} from 'react'
import './User.css'

function User(){
  
  let user = 'danny'
  
  let answered = {
  0: [3, 'question 2', 'answer 2', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c', 'd'], ['math', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1']],
  1: [2, 'question 1', 'answer 1', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c'], ['math', 'tag1']],
  2: [4, 'question 3', 'answer 3', '', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c'], ['math', 'tag1']],
  }
  let liked = {
  0: [3, 'question 2', 'answer 2', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c', 'd'], ['math', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1']],
  1: [2, 'question 1', 'answer 1', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c'], ['math', 'tag1']],
  2: [4, 'question 3', 'answer 3', '', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c'], ['math', 'tag1']],
  }
  window.jsonData = [answered, liked]
  let items = Object.values(window.jsonData[0]);
   
  const a = useRef();
  const b = useRef();
  
  function poop(){
	let x = a.current.offsetTop;
	b.current.style.top = String(x)+"px";
  }
  useEffect(() => {
	poop();
  })
  window.addEventListener("myevent", poop)

  return(
    <>	
	<p style={{'padding': '1rem'}}>welcome {user}</p>
	<BtnMenue>Answered</BtnMenue>
	<BtnMenue>Liked</BtnMenue>
	
    <button ref={a}>poop</button>
	
	<div ref={b} className="qscroll" id="poop">
	{
		items.map( i =>
        <Exercise
	      title={i[6]} 
	  	paragraph={i[1]} 
	  	url={'../../' + i[0]} 
	  	likes={i[7].length} 
	  	tags={i[8]}
	    />
      )
	}
	</div>
	</>
  )
}
export default User;