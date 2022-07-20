

function Hints(props){
	
	localStorage.setItem('bmt', 'Hints');
	
	if(!localStorage.getItem('hints')){
		localStorage.setItem('hints', '');
	}
	
	function onHintsChange(text){
		localStorage.setItem('hints', text.target.value);
		props.setState(text.target.value); // updates in New.js
	}
	
	return(
		<div className='Exercise'>
		<label for="HintsTextArea">Hints bodie</label>
		
		<textarea 
			onChange={(v)=>onHintsChange(v)} 
			defaultValue={localStorage.getItem('hints')} 
			rows='4' 
			className='ExerciseTextArea' 
		/>
		
		</div>
	)
}
export default Hints;
