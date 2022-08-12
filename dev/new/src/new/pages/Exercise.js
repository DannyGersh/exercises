import './Shared.css'
import {useEffect} from 'react'

function Exercise(props){
		
	if(!localStorage.getItem('title')){
		localStorage.setItem('title', '');
	}
	if(!localStorage.getItem('exercise')){
		localStorage.setItem('exercise', '');
	}
	
	function onTitleChange(text){
		localStorage.setItem('title', text.target.value);
		props.setState[0](text.target.value); // updates in New.js
	}
	function onExerciseChange(text){
		localStorage.setItem('exercise', text.target.value);
		props.setState[1](text.target.value); // updates in New.js
	}
	function onAnswerChange(text){
		localStorage.setItem('answer', text.target.value);
		props.setState[2](text.target.value); // updates in New.js
	}
	
	
	
	return(
	<div className='Exercise'>
		
		<label>title *</label>
		
		<input
			id = 'title'
			onChange={(v)=>onTitleChange(v)}
			defaultValue={localStorage.getItem('title')}
			className='ExerciseInput' 
			type="text" 
		/>

		<br/><br/>
		
		<label>Exercise bodie *</label>
		<textarea 
			onChange={(v)=>onExerciseChange(v)}
			defaultValue={localStorage.getItem('exercise')}
			rows='6' 
			className='ExerciseTextArea' 
			required
		/>
		
		<label>answer *</label>
		<textarea
			onChange={(v)=>onAnswerChange(v)}
			defaultValue={localStorage.getItem('answer')}
			rows='4' 
			className='ExerciseTextArea' 
		/>
			
		<label>Tips:</label>
		<ul>
			<li>make the title short and to the point</li>
			<li>make the exercise focused on the topic you choose</li>
			<li>be as clear as possible</li>
		</ul>
		<br/><br/><br/>
		
	</div>
	)
}
export default Exercise;