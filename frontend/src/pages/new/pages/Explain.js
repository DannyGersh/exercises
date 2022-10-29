import {useEffect} from 'react'

function Explain(props){
		
	const updateRefs = props.refs.current.update;

	if(!localStorage.getItem('Explanation')) {
		localStorage.setItem('Explanation', '');
	}

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
