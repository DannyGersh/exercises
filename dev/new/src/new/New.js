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
	
	if(window.jsonData['isEdit'] && !window.jsonData['EditInProgress']) {
		localStorage.setItem('latexp', window.jsonData['chalange']['latexp'])
		localStorage.setItem('title', window.jsonData['chalange']['title'])
		localStorage.setItem('exercise', window.jsonData['chalange']['exercise'])
		localStorage.setItem('answer', window.jsonData['chalange']['answer'])
		localStorage.setItem('hints', window.jsonData['chalange']['hints'])
		localStorage.setItem('Explanation', window.jsonData['chalange']['explain'])
		localStorage.setItem('tags', JSON.stringify( window.jsonData['chalange']['tags']))
		localStorage.setItem('bmt', 'Exercise')

		window.jsonData['EditInProgress'] = true;
		window.location.reloadd();
	}
	
	/* NOTE -  references to inputs

		structure: [ref_to_latex_list, ref_to_input_title, target]

		latex_list - list of evaluated latex strings without $$
		ref_to_input_title - string representing the current input text
		target - corresponding targets from targets array

	*/
	const temp_titleRef     = [useRef([]), useRef(''), targets[0] ];
	const temp_exerciseRef  = [useRef([]), useRef(''), targets[1] ];
	const temp_answerRef    = [useRef([]), useRef(''), targets[2] ];
	const temp_hintsRef     = [useRef([]), useRef(''), targets[3] ];
	const temp_explainRef   = [useRef([]), useRef(''), targets[4] ];

	const ref_exercise 	= [temp_titleRef, temp_exerciseRef, temp_answerRef];
	const ref_hints 	= temp_hintsRef;
	const ref_explain 	= temp_explainRef;

	/* evalRefChange
		POST latex if detected change 
		POST structure(json):
		[target , value, latexp]
		- target: constant str, one of targets array
		- value: array of latex expressions without $$
		- latexp: str, latex pacages
	*/
	function evalRefChange(ref) {
		
		// get latex list
		if(!ref[1]) { return -1 }

		if(ref[1].current) {
			let temp = ref[1].current.match(/(\$\$.+?\$\$)/gms);
			if(!temp) temp=[];
			// remove $$
			temp = temp.map(i=>i.substring(2,i.length-2));
			
			if(!compArr(temp,ref[0].current)) {
				
				// DEBUG
				if(!targets.includes(ref[2])) {
					console.log('ref[2] not in targets');
				}
				
				ref[0].current = temp; // IMPORTENT - renew ref[0].current

				let temp_latexp_local = localStorage.getItem('latexp')
				temp_latexp_local = temp_latexp_local ? temp_latexp_local : '';

				if(!window.is_debug) {
					sendData('test', [ ref[2] , ref[0].current, temp_latexp_local ])
				} else {
					console.log([ ref[2] , ref[0].current, temp_latexp_local ])
				}
			}
		}
		
	}

	// bmt - bottom menue tab - str representing which tab is currently selected
	const temp = localStorage.getItem('bmt')
	const bmt = useState(temp ? temp : 'Exercise')

	// isSubmit - should be one of ['submit', 'preview', 'none']
	const isSubmit = useState('none')

	// when bottom menue tab is clicked
	function bottomMenueHandle(e){
		
		bmt[1](e.target.innerHTML);
	}
	
	// updating latex periodically
	useEffect(()=>{
		
		// TODO - rename window.id

		// for avoiding multiple timers
		window.rmTimer(window.id);
		
		// update refs every 2 sec
		// if statments are necessary not to update with null ref
		window.id = window.setTimer(()=>{
			
			evalRefChange(ref_exercise[0])
			evalRefChange(ref_exercise[1])
			evalRefChange(ref_exercise[2])
			evalRefChange(ref_hints)
			evalRefChange(ref_explain)

		}, 2000);
		
		localStorage.setItem('bmt', bmt[0])
		
	},[bmt[0]])
	

	// submition
	useEffect(()=>{

		if(bmt[0]==='Exercise') {
			evalRefChange(ref_exercise[0])
			evalRefChange(ref_exercise[1])
			evalRefChange(ref_exercise[2])
		} else if(bmt[0]==='Hints') {
			evalRefChange(ref_hints)
		} else if(bmt[0]==='Explain') {
			evalRefChange(ref_explain)
		}

		if(!['submit','preview'].includes(isSubmit[0])) { return }

		let temp_title = localStorage.getItem('title')
		let temp_exercise = localStorage.getItem('exercise')
		let temp_answer = localStorage.getItem('answer')
		let temp_hints = localStorage.getItem('hints')
		let temp_explain = localStorage.getItem('Explanation')
		let temp_tags = JSON.parse(localStorage.getItem('tags'))

		// NOTE - input validation
		function valin(str) { 
			// valin - validate input
			const q = str ? str.match(/<.*\/.*>/gms): '';
			return q
		}

		if(
			valin(temp_title) ||
			valin(temp_exercise) ||
			valin(temp_answer) ||
			valin(temp_hints) ||
			valin(temp_explain)
		) {
			window.alert("invalid input")
			return
		}
		// NOTE

		if( temp_title && temp_answer ) {
			
			ref_exercise[0][1].current = temp_title
			ref_exercise[1][1].current = temp_exercise
			ref_exercise[2][1].current = temp_answer
			ref_hints      [1].current = temp_hints
			ref_explain	   [1].current = temp_explain
			
			// evalRefChange onley excepts ref's
			evalRefChange(ref_exercise[0])
			evalRefChange(ref_exercise[1])
			evalRefChange(ref_exercise[2])
			evalRefChange(ref_hints)
			evalRefChange(ref_explain)

			document.getElementById('mainForm').submit();

			// clean local storage on submit
			if(isSubmit[0]==='submit') {
				localStorage.removeItem('latexp');
				localStorage.removeItem('title');
				localStorage.removeItem('exercise');
				localStorage.removeItem('Explanation');
				localStorage.removeItem('hints');
				localStorage.removeItem('answer');
				localStorage.removeItem('tags');
				localStorage.removeItem('bmt');
			}

			// window.location.reload();

		} else {

			let str = 'You are missing:\n';
			if(!temp_title) { str += '* title (in the exercise tab)\n' }
			if(!temp_answer) { str += '* answer\n' }
			window.alert(str)

		}

		if(isSubmit[0]!=='none'){
			isSubmit[1]('none')
		}
	
	}, [isSubmit[0]])

	function onSubmit() {
		isSubmit[1]('submit')
	}
	function onPreview() {
		isSubmit[1]('preview')
	}

	return(
	<>

		<form id='mainForm' name='mainForm' action={'/newSubmit/'} isSubmit={isSubmit[0]} method='POST' target={isSubmit[0]==='submit' ? "_self": "_blank"}>
			<CSRFToken/>
			
			<input type="hidden" name="latexp" 	   value={ localStorage.getItem('latexp')   } />
			<input type="hidden" name="title" 	   value={ localStorage.getItem('title')    } />
			<input type="hidden" name="exercise"   value={ localStorage.getItem('exercise') } />
			<input type="hidden" name="answer"     value={ localStorage.getItem('answer')   } />
			<input type="hidden" name="hints"      value={ localStorage.getItem('hints')    } />
			<input type="hidden" name="tags"       value={ localStorage.getItem('tags')     } />
			<input type="hidden" name="explain"    value={ localStorage.getItem('Explanation')  } />
			<input type="hidden" name="isSubmit"   value={ isSubmit[0]==='submit' ? true : false } />
			<input type="hidden" name="isEdit"     value={ window.jsonData['isEdit'] } />
			<input type="hidden" name="exerciseId" value={ window.jsonData['chalange']['id'] } />
			<input type="hidden" name="oldLatex"   value={ window.jsonData['chalange']['latex'] } />

			<div className='bottomMenue'>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Exercise'    && 'green'}`}>Exercise</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Hints'       && 'green'}`}>Hints</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Explanation' && 'green'}`}>Explanation</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Tags'        && 'green'}`}>Tags</BtnMenue>
				<BtnMenue type='button' onClick={onPreview} className='btnSubmit'>Preview</BtnMenue>
				<BtnMenue type='button' onClick={onSubmit} className='btnSubmit'>{window.jsonData['isEdit'] ? 'Update': 'Submit'}</BtnMenue>
			</div>
	
			{ bmt[0] === 'Exercise'     && <Exercise ref_exercise={ref_exercise}/> }
			{ bmt[0] === 'Hints'        && <Hints ref_hints={ref_hints}/> }
			{ bmt[0] === 'Explanation' 	&& <Explain ref_explain={ref_explain}/> }
			{ bmt[0] === 'Tags'			&& <TagList/> }
		</form>
		
	</>
	) 
}
export default New;