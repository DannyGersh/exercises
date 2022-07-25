import Exercise from '../shared/exercise/Exercise'
import BtnMenue from '../shared/buttons/BtnMenue'
import {useState, useRef, useEffect} from 'react'
import './User.css'

function User(){

  const signInFailure = window.jsonData['signInFailure']
	const isSignUp = window.jsonData['isSignUp']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
	const authored = window.jsonData['data'][0]
	const liked = window.jsonData['data'][1]
	const answered = window.jsonData['data'][2]
	const userName = window.jsonData['data'][3]
		
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
		if(selection==="Answered") {
			return Object.values(answered);	
		} else if (selection==="Liked") {
			return Object.values(liked);
		} else {
			return Object.values(authored);
		}
  }
		
  return(
  <>	
		<p style={{'padding': '0rem 0rem 0rem 1rem'}}>welcome {userName}</p>
		
		<div ref={refA} style={{'padding': '0rem 0rem 0rem 0.3rem'}}>
			<BtnMenue onClick={(e)=>menueHandle(e,"Authored")}>Authored</BtnMenue>
			<BtnMenue onClick={(e)=>menueHandle(e,"Liked")}>Liked</BtnMenue>
			<BtnMenue onClick={(e)=>menueHandle(e,"Answered")}>Answered</BtnMenue>
		</div>
				
		<div ref={refB} className="hscroll scrollStyle">
		{
			selectMenue(menueSelection).map( (item, index) =>
				<Exercise 
					key={index}
					title={item['title']} 
					paragraph={item['question']} 
					url={'../../' + item['id']} 
					likes={item['rating'].length} 
					tags={item['tags']}
				/>
				)
		}	
		</div>
	</>
  )
}
export default User;