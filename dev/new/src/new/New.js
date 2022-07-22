import './New.css'
import CSRFToken from '../shared/csrftoken'
import BtnMenue from '../shared/buttons/BtnMenue'
import Exercise from './pages/Exercise'
import Hints from './pages/Hints'
import Explain from './pages/Explain'
import TagList from './pages/TagList'
import {useState, useEffect} from 'react'

function New(props){
	
	// state - they're all strings, coresponding to form inputs
	const [title		, setTitle		] = useState('');
	const [exercise	, setExercise	] = useState('');
	const [answer	, setanswer	] = useState('');
	const [hints		, setHints		] = useState('');
	const [explain	, setExplain	] = useState('');
	const [tags			, setTags			] = useState('');
	
	// NOTE - local storage
	// all inputs are being temporarely stored in local storage
	// so that data isn't lost on refresh, only on submit
	const [bmt, setBmt] = useState(''); // bmt - bottom menue tab
	useEffect( () => {
		if(!localStorage.getItem('bmt')){ 
			localStorage.setItem('bmt', 'Exercise')
			setBmt('Exercise');
		} else {
			setBmt(localStorage.getItem('bmt'));
		}
	}, []);
	// NOTE

	// when bottomMenue tab is clicked
	function bottomMenueHandle(e){
		setBmt(e.target.innerHTML);
	}
	
	function submit(){ // validate form, submit and remove local storage
		
		if( title && exercise && answer ) { 
			document.mainForm.submit(); 
			localStorage.removeItem('title');
			localStorage.removeItem('exercise');
			localStorage.removeItem('explain');
			localStorage.removeItem('hints');
			localStorage.removeItem('answer');
			localStorage.removeItem('tags');
			localStorage.removeItem('bmt');
		} 
		else {
			let str = 'You are missing:\n';
			if(!title) { str += '* title (in the exercise tab)\n' }
			if(!exercise) { str += '* exercise bodie\n' }
			if(!answer) { str += '* answer\n' }
			window.alert(str)
		}
		
	}

	return(
	<>
		<form name='mainForm' action="/newSubmited/" target="dummyframe" method='POST'>
			<CSRFToken />
			
			<input type="hidden" name="title" 		value={	title	}			/>
			<input type="hidden" name="exercise" 	value={ exercise }	/>
			<input type="hidden" name="answer" 	value={ answer }		/>
			<input type="hidden" name="hints" 		value={ hints	}			/>
			<input type="hidden" name="tags" 			value={ tags }			/>
			<input type="hidden" name="explain" 	value={ explain }		/>

			<div className='bottomMenue'>
			<BtnMenue type="button" onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Exercise' 		&& 'green'}`}>Exercise</BtnMenue>
			<BtnMenue type="button" onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Hints' 	  		&& 'green'}`}>Hints</BtnMenue>
			<BtnMenue type="button" onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Explanation'	&& 'green'}`}>Explanation</BtnMenue>
			<BtnMenue type="button" onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Tags' 				&& 'green'}`}>Tags</BtnMenue>
			<BtnMenue type='button' onClick={submit} className='btnSubmit'>Submit</BtnMenue>
			</div>
	
			{ bmt === 'Exercise' 		&& <Exercise setState={[setTitle, setExercise, setanswer]}/> }
			{ bmt === 'Hints' 			&& <Hints setState={setHints}/> }
			{ bmt === 'Explanation' && <Explain setState={setExplain}/> }
			{ bmt === 'Tags' 				&& <TagList setState={setTags}/> }
		</form>
		
	</>
	) 
}
export default New;