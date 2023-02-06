import React from 'react'
import {TARGETS} from '../../../shared/Functions'


function Explain(props){
		
	const updateRefs = props.refs.current.update;
	
	return(
		<form className='Exercise'>
			<label htmlFor="explain">explanation bodie</label>
			
			<textarea
				name='explain'
				id={TARGETS.explain}
				onChange={
					(e)=>updateRefs(
						TARGETS.explain, props.refs, e.target.value
					)
				}
				className='ExerciseTextArea' 
			/>
			
			<p >Tips:</p>
			<ul>
				<li>
					go through all the steps 
					of solving your exercise
				</li>
			</ul>
			<br/><br/><br/>
		
		</form>
	)
}
export default Explain;
