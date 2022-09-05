import './New.css'
import CSRFToken from '../shared/csrftoken'
import BtnMenue from '../shared/buttons/BtnMenue'
import Exercise from './pages/Exercise'
import Hints from './pages/Hints'
import Explain from './pages/Explain'
import TagList from './pages/TagList'
import {useState, useEffect, useRef} from 'react'
import {compArr} from '../shared/Functions'
import {sendData} from '../shared/Functions'
 
let targets = [
	'title',
	'exercise',
	'answer',
	'hints',
	'explain'
]
	
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

// custom timer
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

	let temp_title 		= ''
	let temp_exercise = ''
	let temp_answer   = ''
	let temp_hints    = ''
	let temp_explain  = ''
	let temp_tags     = ''
	
	if(window.jsonData['isEdit'] && !window.jsonData['EditInProgress']) {
		localStorage.setItem('title',				window.jsonData['chalange']['title']   )
		localStorage.setItem('exercise',		window.jsonData['chalange']['exercise'])
		localStorage.setItem('answer',			window.jsonData['chalange']['answer']  )
		localStorage.setItem('hints',				window.jsonData['chalange']['hints']   )
		localStorage.setItem('Explanation',	window.jsonData['chalange']['explain'] )
		localStorage.setItem('tags',				JSON.stringify(window.jsonData['chalange']['tags'])    )
	}
	temp_title 		= localStorage.getItem('title')				
	temp_exercise = localStorage.getItem('exercise')		
	temp_answer   = localStorage.getItem('answer')			
	temp_hints    = localStorage.getItem('hints')				
	temp_explain  = localStorage.getItem('Explanation')	
	temp_tags     = JSON.parse(localStorage.getItem('tags'))	
	
	// state - they're all strings, coresponding to form inputs, 
	// except tags which is a list of strings                     
	const title		 = useState(temp_title)
	const exercise = useState(temp_exercise)
	const answer 	 = useState(temp_answer)
	const hints		 = useState(temp_hints)
	const explain  = useState(temp_explain)
	const tags		 = useState(temp_tags)
	const bmt 		 = useState('Exercise'); // current bottom menue tab
	const issubmit = useState('none') // 'none' - default, true - Submit, false - Previe 

	// references to inputs - structure: [ref_to_latex_list, ref_to_input_title, target]
	// latex_list - list of evaluated latex strings 
	// ref_to_input_title - string representing the current input
	// target - corresponding targets from list
	const temp_titleRef 		= [useRef([]), useRef(''), targets[0] ];
	const temp_exerciseRef 	= [useRef([]), useRef(''), targets[1] ];
	const temp_answerRef 		= [useRef([]), useRef(''), targets[2] ];
	const temp_hintsRef 		= [useRef([]), useRef(''), targets[3] ];
	const temp_explainRef 	= [useRef([]), useRef(''), targets[4] ];
	
	const ref_exercise 	= [temp_titleRef, temp_exerciseRef, temp_answerRef];
	const ref_hints 		= temp_hintsRef;
	const ref_explain 	= temp_explainRef;

	/* NOTE - evalRefChange
		POST latex if detected change 
		POST structure(json):
		[target , value]
		- target: str, one of targets array
		- value: str, array of latex expressions without $$
	*/
	function evalRefChange(ref) {
		
		// get latex list

		if(ref[1].current) {
			let temp = ref[1].current.value.match(/(\$\$.+?\$\$)/g);
			if(!temp) temp=[];
			// remove $$
			temp = temp.map(i=>i.substring(2,i.length-2));
			
			if(!compArr(temp,ref[0].current)) {
				
				// DEBUG
				if(!targets.includes(ref[2])) {
					console.log('ref[2] not in targets');
				}
				
				ref[0].current = temp; // IMPORTENT - renew ref[0].current

				if(!window.is_debug) {
					sendData(!window.isdebug ? 'http://63.250.61.251/test/': 'http://localhost/test/', [ ref[2] , ref[0].current ]);
				} else {
					// console.log([ ref[2] , ref[0].current ])
				}
			}
		}
		
	}
	function init_ref(ref, str) {
		
		let temp = []
		try {
			temp = ref[1].current.value.match(/(\$\$.+?\$\$)/g);
		} catch {
			temp = str.match(/(\$\$.+?\$\$)/g);
		}
		
		if(temp) {
			temp = temp.map(i=>i.substring(2,i.length-2));
		}
		
		ref[0].current = temp;
	}

	// when bottomMenue tab is clicked
	function bottomMenueHandle(e){
		
		// update latex immediately on bmt change
		// only for current bmt, for avoiding null ref
		if(bmt[0]==='Exercise') {
			evalRefChange(ref_exercise[0])
			evalRefChange(ref_exercise[1])
			evalRefChange(ref_exercise[2])
		} else if(bmt[0]==='Hints') {
			evalRefChange(ref_hints)
		} else if(bmt[0]==='Explain') {
			evalRefChange(ref_explain)
		}
			
		bmt[1](e.target.innerHTML);
	}
	
	// submit buttons
	function onSubmit() { 
	
		evalRefChange(ref_exercise[0] )
		evalRefChange(ref_exercise[1]	)
		evalRefChange(ref_exercise[2] )
		evalRefChange(ref_hints		 		)
		evalRefChange(ref_explain 		)
			
		issubmit[1](true); 
	}
	function onPrevie() { 
	
		evalRefChange(ref_exercise[0]	)
		evalRefChange(ref_exercise[1]	)
		evalRefChange(ref_exercise[2] )
		evalRefChange(ref_hints		 		)
		evalRefChange(ref_explain 		)
		
		issubmit[1](false); 
	}
		
	// updating latex periodically
	useEffect(()=>{
	
		// for avoiding multiple timers
		window.rmTimer(window.id);
		
		// update refs every 2 sec
		// if statments are necessary not to update with null ref
		window.id = window.setTimer(()=>{
			if(bmt[0]=='Exercise') {
				evalRefChange(ref_exercise[0]);
				evalRefChange(ref_exercise[1]);
				evalRefChange(ref_exercise[2]);
			}
			if(bmt[0]=='Hints') {
				
				evalRefChange(ref_hints);
			}
			if(bmt[0]=='Explanation') {
				evalRefChange(ref_explain);
			}
			
		}, 2000);
		
	},[bmt[0]])
	
	/* NOTE - submit & preview
		when the user clicks one of the two submit buttons
		the page is rerendered so that the form
		while update its action and target to the 
		current proper values.
		this useEffect detects if issubmit is set
		and performs the form submition.
		allso it loads local storage.
	*/
	useEffect(()=>{
				
		title[1](localStorage.getItem('title'));		
		exercise[1](localStorage.getItem('exercise'));
		answer[1](localStorage.getItem('answer'));
		hints[1](localStorage.getItem('hints'));
		explain[1](localStorage.getItem('Explanation'));
		tags[1](JSON.parse(localStorage.getItem('tags')));

		if(issubmit[0] !== 'none') {
		
			if( title[0] && answer[0] ) {
				document.mainForm.submit();
				if(issubmit[0]) {
					localStorage.removeItem('title');
					localStorage.removeItem('exercise');
					localStorage.removeItem('Explanation');
					localStorage.removeItem('hints');
					localStorage.removeItem('answer');
					localStorage.removeItem('tags');
				} else {	
					/* 
						NOTE - get (hopefully) current inputs,
						default to empty string
						
						must use local storage for the ref's aren't defined
						
						the '2' is because they are allready defined,
						but I rather not use the already defined
						for avoiding reacdt weirdness
					*/
					let temp_title2 = localStorage.getItem('title')
					let temp_exercise2 = localStorage.getItem('exercise')
					let temp_answer2 = localStorage.getItem('answer')
					let temp_hints2 = localStorage.getItem('hints')
					let temp_explain2 = localStorage.getItem('Explanation')
					if(!temp_title2) { temp_title2 = '' }
					if(!temp_exercise2) { temp_exercise2 = '' }
					if(!temp_answer2) { temp_answer2 = '' }
					if(!temp_hints2) { temp_hints2 = '' }
					if(!temp_explain2) { temp_explain2 = '' }
					
					// evalRefChange onley excepts ref's
					ref_exercise[0][1] = temp_title2
					ref_exercise[1][1] = temp_exercise2
					ref_exercise[2][1] = temp_answer2
					ref_hints      [1] = temp_hints2
					ref_explain	   [1] = temp_explain2
					
					// evaluate latex
					evalRefChange(ref_exercise[0])
					evalRefChange(ref_exercise[1])
					evalRefChange(ref_exercise[2])
					evalRefChange(ref_hints)
					evalRefChange(ref_explain)
					
					// must reload or previe button wont function
					window.location.reload()
				}
			} else {
				let str = 'You are missing:\n';
				if(!title[0]) { str += '* title (in the exercise tab)\n' }
				if(!answer[0]) { str += '* answer\n' }
				window.alert(str)
			}
			
		}

	},[issubmit[0]])
	// NOTE

	return(
	<>

		<form name='mainForm' action={'/newSubmit/'} issubmit={issubmit[0]} method='POST' target={issubmit[0] ? "_self": "_blank"}>
			<CSRFToken/>
			
			<input type="hidden" name="title" 		 value={	title[0]	}	/>
			<input type="hidden" name="exercise" 	 value={ exercise[0] }	/>
			<input type="hidden" name="answer" 		 value={ answer[0] }		/>
			<input type="hidden" name="hints" 		 value={ hints[0]	}			/>
			<input type="hidden" name="tags" 			 value={ tags[0] }			/>
			<input type="hidden" name="explain" 	 value={ explain[0] }		/>
				{/* TODO - turn issubmit to isSubmit*/}   
			<input type="hidden" name="issubmit" 	 value={ issubmit[0] }	/>
			<input type="hidden" name="isEdit" 		 value={ window.jsonData['isEdit'] }	/>
				{/* TODO - rename chalange to exercise in the project*/}
			<input type="hidden" name="exerciseId" value={ window.jsonData['chalange']['id'] }	/>
			<input type="hidden" name="oldLatex" value={ window.jsonData['chalange']['latex'] }	/>

			<div className='bottomMenue'>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Exercise' 		&& 'green'}`}>Exercise</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Hints' 	  	&& 'green'}`}>Hints</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Explanation'	&& 'green'}`}>Explanation</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Tags' 				&& 'green'}`}>Tags</BtnMenue>
				<BtnMenue type='button' onClick={onPrevie} className='btnSubmit'>Preview</BtnMenue>
				<BtnMenue type='button' onClick={onSubmit} className='btnSubmit'>{window.jsonData['isEdit'] ? 'Update': 'Submit'}</BtnMenue>
			</div>
	
			{ bmt[0] === 'Exercise' 		&& <Exercise ref_exercise={ref_exercise} state={[title, exercise, answer]}/> }
			{ bmt[0] === 'Hints' 				&& <Hints ref_hints={ref_hints} state={hints}/> }
			{ bmt[0] === 'Explanation' 	&& <Explain ref_explain={ref_explain} state={explain}/> }
			{ bmt[0] === 'Tags' 				&& <TagList state={tags}/> }
		</form>
		
	</>
	) 
}
export default New;