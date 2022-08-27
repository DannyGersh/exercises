import {useEffect} from 'react'

function Hints(props){
		
	if(!localStorage.getItem('hints')){
		localStorage.setItem('hints', '');
	}
	
	function onHintsChange(text){
		localStorage.setItem('hints', text.target.value);
		props.state[1](text.target.value); // updates in New.js
	}
	
	useEffect(()=>{
		if(window.jsonData['isEdit']) {
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
			ref={props.ref_hints[1]}
			onChange={(v)=>onHintsChange(v)} 
			defaultValue={localStorage.getItem('hints')} 
			rows='6' 
			className='ExerciseTextArea' 
		/>
		
		<p >Tips:</p>
		<ul>
			<li>try to help the reader</li>
			<li>don't give away too much</li>
		</ul>
		<br/><br/><br/>
		
		</div>
	)
}
export default Hints;
