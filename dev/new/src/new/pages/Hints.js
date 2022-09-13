import {useEffect} from 'react'

function Hints(props){
		
	if(!localStorage.getItem('hints')){
		localStorage.setItem('hints', '');
	}
	
	function onHintsChange(text){
		localStorage.setItem('hints', text.target.value);
		props.ref_hints[1].current = text.target.value;
	}
	
	useEffect(()=>{
		if(window.jsonData['isEdit'] && !window.jsonData['EditInProgress']) {
			document.getElementById('hints').value = window.jsonData['chalange']['hints'];
		} else {
			document.getElementById('hints').value = localStorage.getItem('hints');
		}
	},[])
	
	return(
		<div className='Exercise'>
		<label for="HintsTextArea">Hints bodie</label>
		
		<textarea 
			id='hints'
			onChange={(v)=>onHintsChange(v)} 
			defaultValue={localStorage.getItem('hints')} 
			rows='6' 
			className='ExerciseTextArea' 
		/>
		
		<p >Tips:</p>
		<ul>
			<li>try to help the reader</li>
		</ul>
		<br/><br/><br/>
		
		</div>
	)
}
export default Hints;
