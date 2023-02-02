import React from 'react'
import {TARGETS} from '../../../shared/Functions'


function Hints(props){
		
	const updateRefs = props.refs.current.update;
	
	return(
		<div className='Exercise'>
		<label htmlFor="HintsTextArea">Hints bodie</label>
		
		<textarea 
			id='hints'
			className='ExerciseTextArea' 
			onChange={(e)=>
				updateRefs(TARGETS.hints, props.refs, e.target.value)
			} 
			rows='6' 
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
