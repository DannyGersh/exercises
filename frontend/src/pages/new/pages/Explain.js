import {useEffect} from 'react'
import {mainText2html} from '../../../shared/Functions'
import {MAIN_STATES} from '../New'

function Explain(props){
		
	const ctx = props.ctx;
	const updateRefs = props.refs.current.update;

	if(!localStorage.getItem('Explanation')) {
		localStorage.setItem('Explanation', '');
	}

	useEffect(()=>{
		if(ctx.mainState === MAIN_STATES.newExercise || ctx.mainState === MAIN_STATES.editInProgress) {
			document.getElementById('explain').value = localStorage.getItem('explain');
		} else {
			const explain = mainText2html(ctx.exercise_edit, 'explain', true);
			document.getElementById('explain').value = explain;
			localStorage.setItem('explain', explain);
		}	
	},[])
	
	return(
		<div className='Exercise'>
			<label htmlFor="AnswereTextArea">Explanation bodie</label>
			
			<textarea
				id='explain'
				onChange={(v)=>updateRefs('explain', props.refs, v.target.value)}
				defaultValue={localStorage.getItem('Explanation')}
				className='ExerciseTextArea' 
			/>
			
			<p >Tips:</p>
			<ul>
				<li>go through all the steps of solving your exercise</li>
			</ul>
			<br/><br/><br/>
		
		</div>
	)
}
export default Explain;
