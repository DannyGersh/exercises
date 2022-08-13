import './New.css'
import CSRFToken from '../shared/csrftoken'
import BtnMenue from '../shared/buttons/BtnMenue'
import Exercise from './pages/Exercise'
import Hints from './pages/Hints'
import Explain from './pages/Explain'
import TagList from './pages/TagList'
import {useState, useEffect, useRef} from 'react'
import {compArr} from '../shared/Functions'

/* GUID

bm - bottom menue
bmt - bm tabs

1)
bottom menue tabs all have their own page <element>

2)
all input is stored in local storage, so user wont lose his work.

3) important
there are two submit buttons, the blue ones in the bm.
the preview is submited in a new browser tab
where the submit button submits to the same browser tab

*/

window.activeTimers = 0;
window.setTimer = function(func, delay) {
    window.activeTimers++;
    return window.setInterval(func, delay);
};
window.rmTimer = function(timerID) {
    window.activeTimers--;
    window.clearInterval(timerID);
};


function New(props){
	
	const m = [useRef([]), useRef('')]
			
	// m[0].current - list of latex expressions in title
	// m[1] - refrence to title text

	// state - they're all strings, coresponding to form inputs, 
	// except tags which is a list of strings
	const title = useState('');
	const [exercise	, setExercise	] = useState('');
	const [answer		, setanswer		] = useState('');
	const [hints		, setHints		] = useState('');
	const [explain	, setExplain	] = useState('');
	const [tags			, setTags			] = useState('');
	const [bmt, setBmt] = useState('Exercise'); // current bottom menue tab
	const issubmit = useState('none') // 'none' - default, true - Submit, false - Previe 

	// when bottomMenue tab is clicked
	function bottomMenueHandle(e){
		setBmt(e.target.innerHTML);
	}
	
	// submit buttons
	function onSubmit() { issubmit[1](true); }
	function onPrevie() { issubmit[1](false); }
	
	/* NOTE
		when the user clicks one of the two submit buttons
		the page is rerendered so that the form
		while update its action and target to the 
		current proper values.
		this useEffect detects if issubmit is set
		and performs the form submition.
		allso it loads local storage.
	*/
		
	// initiate m[0] with default title text
	useEffect(()=>{
		let t = m[1].current.value.match(/(\$\$.+?\$\$)/g);
		if(t) {
		t = t.map(i=>i.substring(2,i.length-2));
		} else {
			t = [];
		}
		m[0].current = t;
	},[])
	
	useEffect(()=>{
		
		// for avoiding multiple timers
		window.rmTimer(window.id);
		
		// update m[0] every 2 sec
		window.id = window.setTimer(()=>
		{
			let temp = m[1].current.value.match(/(\$\$.+?\$\$)/g);
			if(!temp) temp=[];
			temp = temp.map(i=>i.substring(2,i.length-2));
			// POST if change detected
			if(!compArr(temp,m[0].current)){
				m[0].current = temp;
				console.log(m[0].current);
				document.getElementById("compileLatex").submit();
			}
		}, 2000);
		
	},[title[0]])
	
	useEffect(()=>{
				
		title[1](localStorage.getItem('title'));		
		setExercise(localStorage.getItem('exercise'));
		setanswer(localStorage.getItem('answer'));
		setHints(localStorage.getItem('hints'));
		setExplain(localStorage.getItem('Explanation'));
		setTags(localStorage.getItem('tags'));

		if(issubmit[0] !== 'none') {
		
			if( title && exercise && answer ) {
				document.mainForm.submit();
				if(issubmit[0]) {
					localStorage.removeItem('title');
					localStorage.removeItem('exercise');
					localStorage.removeItem('Explanation');
					localStorage.removeItem('hints');
					localStorage.removeItem('answer');
					localStorage.removeItem('tags');
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

	},[issubmit[0]])
	// NOTE
	
	
	return(
	<>
			<iframe name="dummyframe" id="dummyframe" style={{display:'none'}}></iframe>
			<form method='POST' id='compileLatex' action='../../../../compileLatex/' target="dummyframe">
				<input type='hidden' name='title' value={m[0].current}/>
			</form>
			
			<form name='mainForm' action={'/newSubmit/'} issubmit={issubmit[0]} method='POST' target={issubmit[0] ? "_self": "_blank"}>
			<CSRFToken />
			
			<input type="hidden" name="title" 		value={	title	}			/>
			<input type="hidden" name="exercise" 	value={ exercise }	/>
			<input type="hidden" name="answer" 		value={ answer }		/>
			<input type="hidden" name="hints" 		value={ hints	}			/>
			<input type="hidden" name="tags" 			value={ tags }			/>
			<input type="hidden" name="explain" 	value={ explain }		/>
			<input type="hidden" name="issubmit" 	value={ issubmit[0] }	/>

			<div className='bottomMenue'>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Exercise' 		&& 'green'}`}>Exercise</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Hints' 	  		&& 'green'}`}>Hints</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Explanation'	&& 'green'}`}>Explanation</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Tags' 				&& 'green'}`}>Tags</BtnMenue>
				<BtnMenue type='button' onClick={onPrevie } className='btnSubmit'>Preview</BtnMenue>
				<BtnMenue type='button' onClick={onSubmit} className='btnSubmit'>Submit</BtnMenue>
			</div>
	
			{ bmt === 'Exercise' 		&& <Exercise m={m[1]} state={[title, setExercise, setanswer]}/> }
			{ bmt === 'Hints' 			&& <Hints setState={setHints}/> }
			{ bmt === 'Explanation' && <Explain setState={setExplain}/> }
			{ bmt === 'Tags' 				&& <TagList setState={setTags}/> }
		</form>
		
	</>
	) 
}
export default New;