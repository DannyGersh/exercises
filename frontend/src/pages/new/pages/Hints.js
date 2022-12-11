import {useEffect} from 'react'
import {mainText2html} from '../../../shared/Functions'
import {MAIN_STATES} from '../New'

function Hints(props){
		
	const ctx = props.ctx;
	const updateRefs = props.refs.current.update;

	if(!localStorage.getItem('hints')){
		localStorage.setItem('hints', '');
	}

	useEffect(()=>{
		if(ctx.mainState === MAIN_STATES.newExercise || ctx.mainState === MAIN_STATES.editInProgress) {
			document.getElementById('hints').value = localStorage.getItem('hints');
		} else {
			const hints = mainText2html(ctx.exercise_edit, 'hints', true);
			document.getElementById('hints').value = hints;
			localStorage.setItem('hints', hints);
		}	
	},[])
	
	return(
		<div className='Exercise'>
		<label htmlFor="HintsTextArea">Hints bodie</label>
		
		<textarea 
			id='hints'
			onChange={(v)=>updateRefs('hints', props.refs, v.target.value)} 
			defaultValue={localStorage.getItem('hints')} 
			rows='6' 
			className='ExerciseTextArea' 
		/>
		
		<p >Tips:</p>
		<ul>
			<li>try to help the reader</li>
		</ul>
		<br/><br/><br/>
		
		</div>
	)
}
export default Hints;
