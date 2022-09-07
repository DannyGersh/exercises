import Card from '../card/Card'
import BtnRound from '../../shared/buttons/BtnRound'
import Tag from '../../shared/tag/Tag'
import BtnMenue from '../../shared/buttons/BtnMenue'
import './Exercise.css'
import {mainText2html} from '../../shared/Functions'
import {useState, useEffect} from 'react'
import {sendData} from '../../shared/Functions'
import CSRFToken from '../../shared/csrftoken'

function Exercise(props){
  
	let identifier_latex = props.chalange['latex'];
	let fromFile_latex = props.chalange['list_latex'];
	
	const htmlTitle = '<h4>'+mainText2html(identifier_latex, props.chalange, fromFile_latex, 'title')+'</h4>';
	const htmlExercise = '<p>'+mainText2html(identifier_latex, props.chalange, fromFile_latex, 'exercise')+'</p>';
	
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
	
	function onDelete(evt) {
		
		evt.stopPropagation();
		
		try{
			if(window.confirm("Delete this exercise ?")) {
				const promise = sendData(
					'delete', 
					[
						props.chalange['id'],
						props.chalange['latex'],
					]
				)
				
				promise.then(res => ()=>{
				if(!res.status===200) {
					window.alert('Failed deleting this exercise');
				}});
				
				window.location.reload()
			}
		} catch {
			window.alert('Failed deleting this exercise');
		}

	}
	
  return(
  <>
	<Card url={props.url} style={props.style} className={props.className} narrowWindow={props.narrowWindow}>
      
			<div className='topRight'>
				{ props.isOptions && <BtnMenue onClick={(evt)=>onOptions(evt)}>...</BtnMenue>}
			</div>
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
			
			<div className='bottomRight'>
				<BtnRound>
				{props.chalange['rating'].length}<br/>Likes
				</BtnRound>
			</div>
      
      <div style={{overflow:'hidden'}} id={'title_'+props.identifier.toString()}></div>
	    <div style={{overflow:'hidden'}} id={'exercise_'+props.identifier.toString()}></div>
			<br/><br/><br/>
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

