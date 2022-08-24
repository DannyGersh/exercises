import Exercise from '../shared/exercise/Exercise'
import BtnMenue from '../shared/buttons/BtnMenue'
import {useState, useRef, useEffect} from 'react'
import './User.css'

function User(){

	const authored = window.jsonData['data'][0]
	const liked = window.jsonData['data'][1]
	const userName = window.jsonData['data'][2]
		
  let [menueSelection, setMenueSelection] = useState("Authored");
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
		if (selection==="Liked") {
			return liked;
		} else {
			return authored;
		}
  }

  return(
  <>	
		<h3 style={{'padding': '0rem 0rem 0rem 1rem'}}>welcome {userName}</h3>
				
		<div ref={refA} style={{'padding': '0rem 0rem 0rem 0.3rem'}}>
			<BtnMenue style={{width:'6rem',height:'2rem'}} className={`${menueSelection==='Authored' && 'green'}`} onClick={(e)=>menueHandle(e,"Authored")}>Authored</BtnMenue>
			<BtnMenue style={{width:'6rem',height:'2rem'}} className={`${menueSelection==='Liked'		 && 'green'}`} onClick={(e)=>menueHandle(e,"Liked")}>Liked</BtnMenue>
		</div>
				
		<div ref={refB} className="hscroll scrollStyle gridContainer">
		{
			selectMenue(menueSelection).map( (item, index) =>
				<Exercise
					style={window.nrw ? {width:'calc(100% - 5rem)'}: {width:'calc(50% - 5rem)'}}
					key={index}
					identifier={index}
					isUser={true}
					url={'../../' + item['id']} 
					chalange={item}
					userid={window.jsonData['userid']}
					isOptions={true}
				/>
			)
		}	
		</div>
	</>
  )
}
export default User;


//selectMenue(menueSelection).map( (item, index) =>
//				<Exercise
//					style={window.nrw ? {width:'100%'}: {width:'calc(50% - 5rem)'}}
//					key={index}
//					title={item['title']} 
//					paragraph={item['question']} 
//					url={'../../' + item['id']} 
//					likes={item['rating'].length} 
//					tags={item['tags']}
//					chalange={item}
//				/>
//				)