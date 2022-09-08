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
		props.state[0][1](text.target.value); // updates in New.js
		console.log(props.state[0][0])
	}
	function onExerciseChange(text){
		localStorage.setItem('exercise', text.target.value);
		props.state[1][1](text.target.value); // updates in New.js
	}
	function onAnswerChange(text){
		localStorage.setItem('answer', text.target.value);
		props.state[2][1](text.target.value); // updates in New.js
	}

	useEffect(()=>{
		if(window.jsonData['isEdit'] && !window.jsonData['EditInProgress']) {
			localStorage.setItem('title', window.jsonData['chalange']['title']);
			localStorage.setItem('exercise', window.jsonData['chalange']['exercise']);
			localStorage.setItem('answer', window.jsonData['chalange']['answer']);
		}
		document.getElementById('title').value = localStorage.getItem('title');
		document.getElementById('exercise').value = localStorage.getItem('exercise');
		document.getElementById('answer').value = localStorage.getItem('answer');
	},[])

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
			id='exercise'
			ref={props.ref_exercise[1][1]}
			onChange={(v)=>onExerciseChange(v)}
			rows='6' 
			className='ExerciseTextArea' 
			required
		/>
		
		<label>answer *</label>
		<textarea
			id='answer'
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