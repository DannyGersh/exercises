import {useEffect} from 'react'

function Explain(props){
		
	if(!localStorage.getItem('Explanation')) {
		localStorage.setItem('Explanation', '');
	}
	
	function onExplainChange(text){
		localStorage.setItem('Explanation', text.target.value);
		props.ref_explain[1].current = text.target.value;
	}
	
	useEffect(()=>{
		if(props.isEdit && !window.jsonData['EditInProgress']) {
			document.getElementById('explain').value = window.jsonData['chalange']['explain'];
		} else {
			document.getElementById('explain').value = localStorage.getItem('Explanation');
		}
	},[])

	return(
		<div className='Exercise'>
			<label htmlFor="AnswereTextArea">Explanation bodie</label>
			
			<textarea
				id='explain'
				onChange={(v)=>onExplainChange(v)}
				defaultValue={localStorage.getItem('Explanation')}
				className='ExerciseTextArea' 
			/>
			
			<p >Tips:</p>
			<ul>
				<li>go through all the steps of solving your exercise</li>
			</ul>
			<br/><br/><br/>
		
		</div>
	)
}
export default Explain;
