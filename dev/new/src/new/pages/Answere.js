
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
		
		</div>
	)
}
export default Answere;
