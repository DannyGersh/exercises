import Exercise from '../shared/exercise/Exercise'
import BtnMenue from '../shared/buttons/BtnMenue'
import {useState, useRef, useEffect} from 'react'
import './User.css'

function User(){

  const signInFailure = window.jsonData['signInFailure']
	const isSignUp = window.jsonData['isSignUp']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
	const answered = window.jsonData['data'][0]
	const liked = window.jsonData['data'][1]
	const userName = window.jsonData['data'][2]
	  
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
		if(selection==="Answered"){
			return Object.values(answered);	
		} else {
			return Object.values(liked);
		}
  }
  
  return(
  <>	
		<p style={{'padding': '0rem 0rem 0rem 1rem'}}>welcome {userName}</p>
		
		<div ref={refA} style={{'padding': '0rem 0rem 0rem 0.3rem'}}>
			<BtnMenue onClick={(e)=>menueHandle(e,"Answered")}>Answered</BtnMenue>
			<BtnMenue onClick={(e)=>menueHandle(e,"Liked")}>Liked</BtnMenue>
		</div>
	
		<div ref={refB} className="hscroll scrollStyle">
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