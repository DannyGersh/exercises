import './Shared.css'

function Exercise(props){
		
	if(!localStorage.getItem('title')){
		localStorage.setItem('title', '');
	}
	if(!localStorage.getItem('exercise')){
		localStorage.setItem('exercise', '');
	}
	
	function onTitleChange(text){
		localStorage.setItem('title', text.target.value);
		props.state[0][1](text.target.value); // updates in New.js
	}
	function onExerciseChange(text){
		localStorage.setItem('exercise', text.target.value);
		props.state[1][1](text.target.value); // updates in New.js
	}
	function onAnswerChange(text){
		localStorage.setItem('answer', text.target.value);
		props.state[2][1](text.target.value); // updates in New.js
	}

	return(
	<div className='Exercise'>
		
		<label>title *</label>
		
		<input
			id = 'title'
			ref={props.ref_exercise[0][1]}
			onChange={(v)=>onTitleChange(v)}
			defaultValue={localStorage.getItem('title')}
			className='ExerciseInput' 
			type="text" 
		/>

		<br/><br/>
		
		<label>Exercise bodie *</label>
		<textarea 
			ref={props.ref_exercise[1][1]}
			onChange={(v)=>onExerciseChange(v)}
			defaultValue={localStorage.getItem('exercise')}
			rows='6' 
			className='ExerciseTextArea' 
			required
		/>
		
		<label>answer *</label>
		<textarea
			ref={props.ref_exercise[2][1]}
			onChange={(v)=>onAnswerChange(v)}
			defaultValue={localStorage.getItem('answer')}
			rows='6' 
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