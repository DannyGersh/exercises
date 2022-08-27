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

	// refrences to unputs - structure: [ref_to_latex_list, ref_to_input_title, target]
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
					throw new Error('ref[2] not in targets');
				}
				
				ref[0].current = temp; // IMPORTENT - stops perpetual nonsence
				
				if(!window.is_debug) {
					sendData('http://localhost/test/', [ ref[2] , ref[0].current ]);
				} else {
					// console.log([ ref[2] , ref[0].current ])
				}
			}
		}
		
	}
	function init_ref(ref) {
		
		let temp = []
		try {
			temp = ref[1].current.value.match(/(\$\$.+?\$\$)/g);
		} catch {
			// pass
		}
		
		if(temp) {
			temp = temp.map(i=>i.substring(2,i.length-2));
		}
		
		ref[0].current = temp;
	}
		
	// state - they're all strings, coresponding to form inputs, 
	// except tags which is a list of strings
	const title		 = useState('');
	const exercise = useState('');
	const answer 	 = useState('');
	const hints		 = useState('');
	const explain  = useState('');
	const tags		 = useState('');
	// TODO - change bmt to be like the rest
	const [bmt, setBmt] = useState('Exercise'); // current bottom menue tab
	const issubmit = useState('none') // 'none' - default, true - Submit, false - Previe 
		
	// when bottomMenue tab is clicked
	function bottomMenueHandle(e){
		
		//if(bmt==='Exercise') {
			evalRefChange(ref_exercise[0])
			evalRefChange(ref_exercise[1])
			evalRefChange(ref_exercise[2])
		//} else if(bmt==='Hints') {
			evalRefChange(ref_hints)
		//} else if(bmt==='Explain') {
			evalRefChange(ref_explain)
		//}
			
		setBmt(e.target.innerHTML);
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
	
		evalRefChange(ref_exercise[1]	)
		evalRefChange(ref_exercise[2] )
		evalRefChange(ref_hints		 		)
		evalRefChange(ref_explain 		)
		
		issubmit[1](false); 
	}
		
	/* NOTE
		when the user clicks one of the two submit buttons
		the page is rerendered so that the form
		while update its action and target to the 
		current proper values.
		this useEffect detects if issubmit is set
		and performs the form submition.
		allso it loads local storage.
	*/
	useEffect(()=>{
		
		// initiate refs with default title text
		init_ref(ref_exercise[0])
		init_ref(ref_exercise[1])
		init_ref(ref_exercise[2])
		init_ref(ref_hints)
		init_ref(ref_explain)
		
		// send back latex
		sendData('http://localhost/test/', [ ref_exercise[0][2] , ref_exercise[0][0].current ]);
		sendData('http://localhost/test/', [ ref_exercise[1][2] , ref_exercise[1][0].current ]);
		sendData('http://localhost/test/', [ ref_exercise[2][2] , ref_exercise[2][0].current ]);
		sendData('http://localhost/test/', [ ref_hints[2] , ref_hints[0].current ]);
		sendData('http://localhost/test/', [ ref_explain[2] , ref_explain[0].current ]);

		// for avoiding multiple timers
		window.rmTimer(window.id);
		
		// update refs every 2 sec
		window.id = window.setTimer(()=>{
			// TODO - optimise
			evalRefChange(ref_exercise[0]);
			evalRefChange(ref_exercise[1]);
			evalRefChange(ref_exercise[2]);
			evalRefChange(ref_hints);
			evalRefChange(ref_explain);
		}, 2000);
		
	},[])
	
	useEffect(()=>{
				
		title[1](localStorage.getItem('title'));		
		exercise[1](localStorage.getItem('exercise'));
		answer[1](localStorage.getItem('answer'));
		hints[1](localStorage.getItem('hints'));
		explain[1](localStorage.getItem('Explanation'));
		tags[1](localStorage.getItem('tags'));

		if(issubmit[0] !== 'none') {
		
			if( title[0] && exercise[0] && answer[0] ) {
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
				if(!title[0]) { str += '* title (in the exercise tab)\n' }
				if(!exercise[0]) { str += '* exercise bodie\n' }
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
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Exercise' 		&& 'green'}`}>Exercise</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Hints' 	  		&& 'green'}`}>Hints</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Explanation'	&& 'green'}`}>Explanation</BtnMenue>
				<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt==='Tags' 				&& 'green'}`}>Tags</BtnMenue>
				<BtnMenue type='button' onClick={onPrevie } className='btnSubmit'>Preview</BtnMenue>
				<BtnMenue type='button' onClick={onSubmit} className='btnSubmit'>Submit</BtnMenue>
			</div>
	
			{ bmt === 'Exercise' 		&& <Exercise ref_exercise={ref_exercise} state={[title, exercise, answer]}/> }
			{ bmt === 'Hints' 			&& <Hints ref_hints={ref_hints} state={hints}/> }
			{ bmt === 'Explanation' && <Explain ref_explain={ref_explain} state={explain}/> }
			{ bmt === 'Tags' 				&& <TagList state={tags}/> }
		</form>
		
	</>
	) 
}
export default New;