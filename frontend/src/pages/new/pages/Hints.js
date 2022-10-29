import {useEffect} from 'react'

function Hints(props){
		
	const updateRefs = props.refs.current.update;

	if(!localStorage.getItem('hints')){
		localStorage.setItem('hints', '');
	}

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
