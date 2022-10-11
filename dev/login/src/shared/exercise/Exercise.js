import './Exercise.css'
import Card from '../card/Card'
import BtnRound from '../../shared/buttons/BtnRound'
import Tag from '../../shared/tag/Tag'
import BtnMenue from '../../shared/buttons/BtnMenue'
import {mainText2html, sendData} from '../../shared/Functions'
import {useState, useEffect} from 'react'
import CSRFToken from '../../shared/csrftoken'

function Exercise(props){
  
	let identifier_latex = props.chalange['latex'];
	let fromFile_latex = props.chalange['list_latex'];
	
	const htmlTitle = '<h4>'+mainText2html(identifier_latex, props.chalange, fromFile_latex, 'title')+'</h4>';
	const htmlExercise = '<p>'+mainText2html(identifier_latex, props.chalange, fromFile_latex, 'exercise')+'</p>';
	
	const isLike = props.chalange['rating'].includes(props.userId)

	useEffect(()=>{
		document.getElementById('title_'+props.identifier.toString()).innerHTML = htmlTitle;
		document.getElementById('exercise_'+props.identifier.toString()).innerHTML = htmlExercise;
	},[props.forceRenderDummyState[0]])
	
	const dspOptions = useState(false);
	function onOptions(evt) {
		evt.stopPropagation();
		dspOptions[1]( !dspOptions[0] );
	}
	
	function onEdit(evt) {
		evt.stopPropagation();
	}
	
	async function onDelete(evt) {
		
		evt.stopPropagation();
		
		if(window.confirm("Delete this exercise ?")) {
			sendData(
				'delete', 
				[
					props.chalange['id'],
					props.chalange['latex'],
				]
			)
			await new Promise(r => setTimeout(r, 200));
			window.location.reload()
		}

	}
	
  return(
  <>
	<Card 
		url={props.url} 
		style={props.style} 
		className={props.className} 
		narrowWindow={props.narrowWindow}
		isRedirect={true}
	>
    
    {/*Card children*/} 

	{/* aditional menue button - only on profile */}
	{ props.isOptions && 
		<div className='topRight'>
			<BtnMenue onClick={(evt)=>onOptions(evt)}>...</BtnMenue>
		</div>
	}

	{/* aditional menue - only on profile */}
	{ dspOptions[0] && 
		
		<div style={{display:'flex'}}>
					
		<form name='Edit' action={'/new/'} method='POST'>
			<CSRFToken/>
			<input type="hidden" name="id_exercise" value={	props.chalange['id'] } />
			<BtnMenue onClick={(evt)=>onEdit(evt)} style={{width:'4rem', marginRight:'0.5rem'}}>Edit</BtnMenue>
		</form>

		<BtnMenue onClick={(evt)=>onDelete(evt)} style={{width:'4rem', marginRight:'0.5rem'}}>Delete</BtnMenue>
		</div>

	}
	
	{/* likes */}		
	<div className='bottomRight'>
		<BtnRound style={{backgroundColor: isLike ? 'var(--DKgreen)' : 'var(--UNblue)'}}>
		{props.chalange['rating'].length}<br/>Likes
		</BtnRound>
	</div>

	{/* title, exercise */}
	<div style={{maxHeight: '12rem', overflow:'hidden'}}>
		<div style={{whiteSpace: 'break-spaces', overflow:'hidden'}} id={'title_'+props.identifier.toString()}></div>
		<div style={{whiteSpace: 'break-spaces', overflow:'hidden'}} id={'exercise_'+props.identifier.toString()}></div>
	</div>
	
	{/* tags */}		
	<div style={{height:'3rem'}}/>
			
	    <div className="vscroll bottomLeft">
	    { 
			props.chalange['tags'].map((i) => 
				<Tag key={i} url={'/browse/'+i}>{i}</Tag>
			)
		}
    
    </div>
		    
    </Card>
  </>
  )
}
export default Exercise;

