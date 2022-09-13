import './Shared.css'
import {useEffect} from 'react'

function Exercise(props){
		
	if(!localStorage.getItem('title')) {
		localStorage.setItem('title', '');
	}
	if(!localStorage.getItem('exercise')) {
		localStorage.setItem('exercise', '');
	}
	if(!localStorage.getItem('answer')) {
		localStorage.setItem('answer', '');
	}
	
	function onLatexpChange(text) {
		localStorage.setItem('latexp', text.target.value)
	}
	
	function onTitleChange(text) {
		localStorage.setItem('title', text.target.value)
		props.ref_exercise[0][1].current = text.target.value;
	}
	function onExerciseChange(text) {
		localStorage.setItem('exercise', text.target.value)
		props.ref_exercise[1][1].current = text.target.value;
	}
	function onAnswerChange(text) {
		localStorage.setItem('answer', text.target.value)
		props.ref_exercise[2][1].current = text.target.value;
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
		
		<label>latex pacages</label>
		<input
			id='latexp'
			onChange={(v)=>onLatexpChange(v)}
			defaultValue={localStorage.getItem('latexp')}
			style={{width:'100%'}}
			type="text" 
		/>
		
		<br/><br/>
		
		<label>title *</label>
		<input
			id='title'
			onChange={(v)=>onTitleChange(v)}
			defaultValue={localStorage.getItem('title')}
			style={{width:'100%'}}
			type="text" 
		/>

		<br/><br/>
		
		<label>Exercise bodie</label>
		<textarea 
			id='exercise'
			onChange={(v)=>onExerciseChange(v)}
			rows='6' 
			className='ExerciseTextArea' 
			required
		/>
		
		<label>answer *</label>
		<textarea
			id='answer'
			onChange={(v)=>onAnswerChange(v)}
			defaultValue={localStorage.getItem('answer')}
			rows='6' 
			className='ExerciseTextArea' 
		/>
		
		<br/><br/>

		<label>Tips:</label>
		<ul>
			<li>make the title short and to the point</li>
			<li>make the exercise focused on the topic you choose</li>
			<li>be as clear as possible</li>
			<li>avoid confusing the reader with fancy jargon</li>
		</ul>
		
		<br/>

		<label>Latex:</label>
		<ul>
			<li>the latex installation is "texlive-latex-extra"</li><br/>
			<li>"latex pacages" is a <u>double comma</u> separated list of latex package directives. example:</li><br/>
			<ul><li>{"\\usepackage{amsmath},, \\usepackage{some_other_pacage},, \\usepackage[left=2.00cm, right=1.00cm]{geometry}"}</li></ul><br/>
			<li>try to split your latex into small chunks, for better text wraping:</li><br/>
			<ul>
				<li>insted of $$ some very long latex ... $$, go for: $$ some very $$ $$ long latex ... $$</li><br/>
				<li>this increasess the quality of the exercise</li>
			</ul><br/>

		</ul>

		<br/><br/>

	</div>
	)
}
export default Exercise;