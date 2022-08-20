
function Explain(props){
		
	if(!localStorage.getItem('Explanation')) {
		localStorage.setItem('Explanation', '');
	}
	
	function onExplainChange(text){
		localStorage.setItem('Explanation', text.target.value);
		props.state[1](text.target.value); // updates in New.js
	}
	
	return(
		<div className='Exercise'>
			<label for="AnswereTextArea">Explanation bodie</label>
			
			<textarea
				ref={props.ref_explain[1]}
				onChange={(v)=>onExplainChange(v)}
				defaultValue={localStorage.getItem('Explanation')}
				rows='4' 
				className='ExerciseTextArea' 
			/>
			
			<p >Tips:</p>
			<ul>
				<li>go through all the steps of solving your exercise</li>
				<li>avoid confusing the reader with fancy jargon</li>
			</ul>
			<br/><br/><br/>
		
		</div>
	)
}
export default Explain;
