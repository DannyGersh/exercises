import React from 'react'
import {TARGETS} from '../../../shared/Functions'


function Hints(props){
		
	const updateRefs = props.refs.current.update;
	
	return(
		<form className='Exercise'>
		<label htmlFor="hints">hints bodie</label>
		
		<textarea 
			name='hints'
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
		
		</form>
	)
}
export default Hints;
