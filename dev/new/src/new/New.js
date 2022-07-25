import './New.css'
import CSRFToken from '../shared/csrftoken'
import BtnMenue from '../shared/buttons/BtnMenue'
import Exercise from './pages/Exercise'
import Hints from './pages/Hints'
import Explain from './pages/Explain'
import TagList from './pages/TagList'
import {useState, useEffect} from 'react'

/* GUID

bm - bottom menue
bmt - bm tabs

1)
bottom menue tabs all have their own page <element>

2)
all input is stored in local storage, so user wont lose his work.
the selected bmt is allso stored in localStorage.

3) important
there are two submit buttons, the blue ones in the bm.
the preview is submited in a new browser tab
where the submit button submits to the same browser tab

*/


function New(props){
	
	// state - they're all strings, coresponding to form inputs
	const [title		, setTitle		] = useState('');
	const [exercise	, setExercise	] = useState('');
	const [answer		, setanswer		] = useState('');
	const [hints		, setHints		] = useState('');
	const [explain	, setExplain	] = useState('');
	const [tags			, setTags			] = useState('');
	
	const isSubmit = useState('none') // 'none' - default, true - Submit, false - Previe 

	// NOTE - retrievs previous bmt
	const [bmt, setBmt] = useState(''); // current bottom menue tab
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
	
	// submit buttons
	function onSubmit() { isSubmit[1](true); }
	function onPrevie() { isSubmit[1](false); }
	
	/* NOTE
		when the user clicks one of the two submit buttons
		the page is rerendered so that the form
		while update its action and target to the 
		current proper values.
		this useEffect detects if isSubmit is set
		and performs the form submition.
		allso it loads local storage.
	*/
	useEffect(()=>{
		
		setTitle(localStorage.getItem('title'));
		setExercise(localStorage.getItem('exercise'));
		setanswer(localStorage.getItem('answer'));
		setHints(localStorage.getItem('hints'));
		setExplain(localStorage.getItem('Explanation'));
		setTags(localStorage.getItem('tags'));
	 		
		// isSubmit[0] = false - meaning the user clicked 'preview'
		
		if(isSubmit[0] !== 'none') {
		
			if( title && exercise && answer ) {
				document.mainForm.submit();
				if(isSubmit[0]) {
					localStorage.removeItem('title');
					localStorage.removeItem('exercise');
					localStorage.removeItem('Explanation');
					localStorage.removeItem('hints');
					localStorage.removeItem('answer');
					localStorage.removeItem('tags');
					localStorage.removeItem('bmt');
				} else {
					// must reload or previe button wont function
					window.location.reload();
				}
			} else {
				let str = 'You are missing:\n';
				if(!title) { str += '* title (in the exercise tab)\n' }
				if(!exercise) { str += '* exercise bodie\n' }
				if(!answer) { str += '* answer\n' }
				window.alert(str)
			}
			
		}
	},[isSubmit[0]])
	// NOTE
	
	return(
	<>
			<form name='mainForm' action={'/newSubmit/'} isSubmit={isSubmit[0]} method='POST' target={isSubmit[0] ? "_self": "_blank"}>
			<CSRFToken />
			
			<input type="hidden" name="title" 		value={	title	}			/>
			<input type="hidden" name="exercise" 	value={ exercise }	/>
			<input type="hidden" name="answer" 		value={ answer }		/>
			<input type="hidden" name="hints" 		value={ hints	}			/>
			<input type="hidden" name="tags" 			value={ tags }			/>
			<input type="hidden" name="explain" 	value={ explain }		/>
			<input type="hidden" name="isSubmit" 	value={ isSubmit[0] }	/>

			<div className='bottomMenue'>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Exercise' 		&& 'green'}`}>Exercise</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Hints' 	  		&& 'green'}`}>Hints</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Explanation'	&& 'green'}`}>Explanation</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Tags' 				&& 'green'}`}>Tags</BtnMenue>
				<BtnMenue type='button' onClick={onPrevie } className='btnSubmit'>Preview</BtnMenue>
				<BtnMenue type='button' onClick={onSubmit} className='btnSubmit'>Submit</BtnMenue>
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