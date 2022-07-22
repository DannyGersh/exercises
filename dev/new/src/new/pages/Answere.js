
function Answere(props){
	
	localStorage.setItem('bmt', 'Answere');
	
	if(!localStorage.getItem('answere')) {
		localStorage.setItem('answere', '');
	}
	
	function onAnswereChange(text){
		localStorage.setItem('answere', text.target.value);
		props.setState(text.target.value); // updates in New.js
	}
	
	return(
		<div className='Exercise'>
		<label for="AnswereTextArea">Answere bodie *</label>
		
		<textarea
			onChange={(v)=>onAnswereChange(v)}
			defaultValue={localStorage.getItem('answere')}
			rows='4' 
			className='ExerciseTextArea' 
		/>
		
		<p >Tips:</p>
		<ul>
			<li>go through all the steps of solving your exercise</li>
			<li>
			<li>avoid confusing the reader with fancy jargon</li>
			<li></li>
		</ul>
		<br/><br/><br/>
		
		</div>
	)
}
export default Answere;
