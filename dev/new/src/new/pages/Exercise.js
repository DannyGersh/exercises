import './Shared.css'

function Exercise(props){
	
	localStorage.setItem('bmt', 'Exercise');
	
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
	
	return(
	<div className='Exercise'>
		
		<label className='ExerciseLabel' for='title'>title *</label>
		
		<input
			onChange={(v)=>onTitleChange(v)}
			defaultValue={localStorage.getItem('title')}
			className='ExerciseInput' 
			type="text" 
		/>

		<br/><br/>
		
		
		<label for="ExerciseTextArea">Exercise bodie *</label>
		
		<textarea 
			onChange={(v)=>onExerciseChange(v)}
			defaultValue={localStorage.getItem('exercise')}
			rows='4' 
			className='ExerciseTextArea' 
			required
		/>
	
	</div>
	)
}
export default Exercise;