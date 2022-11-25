import './New.css'
import CSRFToken from '../../shared/Csrftoken'
import BtnMenue from '../../shared/buttons/BtnMenue'
import Exercise from './pages/Exercise'
import Hints from './pages/Hints'
import Explain from './pages/Explain'
import TagList from './pages/TagList'
import {useState, useEffect, useRef, useCallback} from 'react'
import {compArr, sendData, getStackTrace, uploadError} from '../../shared/Functions'


function compileLatex(target, refs, text, exercise='temp') {
	
	// refs:
	// { target : [text, formated_text, timeoutId, latex_object] , ... }
	
	if(!refs.current) { return -1 }

	let temp = text.match(/(\$\$.+?\$\$)/gms);
	if(!temp) temp=[];
	
	let old_latex = refs.current[target][3];
	let new_latex = temp.map(i=>i.substring(2,i.length-2)); // remove $$

	new Set(Object.entries(old_latex)).forEach(i=>{
		if(!new_latex.includes(i[1])) {
			sendData('fetch/deleteLatex', 'POST', {
				userid : window.userId[0],
				exercise : exercise,
				target : target,
				latexid : i[0],
				packages: localStorage.getItem('latexp'),
			})
			delete refs.current[target][3][i[0]];
		} 
	})
	new Set(new_latex).forEach(i=>{
		if(!Object.values(old_latex).includes(i)) {
			let new_id = 0;
			if(Object.keys(old_latex).length) {
				new_id = Math.max(...Object.keys(old_latex))+1;
			}
			sendData('fetch/addLatex', 'POST', {
				userid : window.userId[0],
				exercise : exercise,
				target : target,
				latexid : new_id,
				latex : i,
				packages: localStorage.getItem('latexp'),
			})
			refs.current[target][3][new_id] = i
		} 
	})
	Object.entries(refs.current[target][3]).forEach(i=>{
		const reg = RegExp(`(?<=\\$\\$)${i[1]}(?=\\$\\$)`,'gms');
		text = text.replace(reg, i[0]);
	})

	refs.current[target][1] = text;
}

function updateRefs(target, refs, text) {
	
	clearTimeout(refs.current[target][1]);
		
	refs.current[target][2] = (
		setTimeout(()=>{
			localStorage.setItem(target, text)
			refs.current[target][0] = text;
			compileLatex(target, refs, text)
		}, 500)
	);
}
	
function New(props){
	
	if(props.isEdit && !localStorage.getItem('editInProgress')) {
		localStorage.setItem('latexp', props.exercise['latexp'])
		localStorage.setItem('title', props.exercise['title'])
		localStorage.setItem('exercise', props.exercise['exercise'])
		localStorage.setItem('answer', props.exercise['answer'])
		localStorage.setItem('hints', props.exercise['hints'])
		localStorage.setItem('Explanation', props.exercise['explain'])
		localStorage.setItem('tags', JSON.stringify( props.exercise['tags']))
		localStorage.setItem('bmt', 'Exercise')

		localStorage.setItem('editInProgress', true)
	} 

	const refs = useRef({
		// target : [text, formated_text, timeoutId, latex_object]
		// text - the raw text of an input field
		// formated_text - same as text but all latex is replased with ids from latex_object: $$latex$$ => $$id1$$ where id1 is a number
		// timeoutId - the id of a timeout clock
		// latex_object - {id1: 'latex1', id2: 'latex2', ...}
		title 	 : ['', '', '', {}],
		exercise : ['', '', '', {}],
		answer 	 : ['', '', '', {}],
		hints 	 : ['', '', '', {}],
		explain  : ['', '', '', {}],
		update   : updateRefs,
	})

	// bmt - bottom menue tab - str representing which tab is currently selected
	const temp = localStorage.getItem('bmt')
	const bmt = useState(temp ? temp : 'Exercise')

	// when bottom menue tab is clicked
	function bottomMenueHandle(e){
		
		bmt[1](e.target.innerHTML);
		localStorage.setItem('bmt', e.target.innerHTML)
	}

	function submit() {
		
		let latexp = localStorage.getItem('latexp')
		let title = localStorage.getItem('title')
		let exercise = localStorage.getItem('exercise')
		let answer = localStorage.getItem('answer')
		let hints = localStorage.getItem('hints')
		let explain = localStorage.getItem('Explanation')
		let tags = JSON.parse(localStorage.getItem('tags'))

		// PERROR - input validation
		function valin(str) { 
			// valin - validate input
			const q = str ? str.match(/<.*\/.*>/gms): '';
			return q
		}

		if(
			valin(title) ||
			valin(exercise) ||
			valin(answer) ||
			valin(hints) ||
			valin(explain)
		) {
			window.alert("invalid input")
			return
		}
		// PERROR

		if( title && answer ) {
			
			// clean local storage on submit
			//if(isSubmit[0]==='submit') {
			//	localStorage.removeItem('latexp');
			//	localStorage.removeItem('title');
			//	localStorage.removeItem('exercise');
			//	localStorage.removeItem('Explanation');
			//	localStorage.removeItem('hints');
			//	localStorage.removeItem('answer');
			//	localStorage.removeItem('tags');
			//	localStorage.removeItem('bmt');
			//}
			
			const submit_exercise = { 
				
				userid: window.userId[0],
				latexp: latexp,

				title: [
					refs.current['title'][1],
					refs.current['title'][3],
				],
				exercise: [
					refs.current['exercise'][1],
					refs.current['exercise'][3],
				],
				answer: [
					refs.current['answer'][1],
					refs.current['answer'][3],
				],
				hints: [
					refs.current['hints'][1],
					refs.current['hints'][3],
				],
				explain: [
					refs.current['explain'][1],
					refs.current['explain'][3],
				],
			}

			sendData('fetch/submitExercise', 'POST', submit_exercise)
			.then(result=>{
				if(!result['error']) {
					window.alert('successfully uploaded exercises.')
				}
			})

		} else {
			let str = 'You are missing:\n';
			if(!title) { str += '* title (in the exercise tab)\n' }
			if(!answer) { str += '* answer\n' }
			window.alert(str)
		}
	}

	useEffect(()=>{
		let title = localStorage.getItem('title')
		let exercise = localStorage.getItem('exercise')
		let answer = localStorage.getItem('answer')
		let hints = localStorage.getItem('hints')
		let explain = localStorage.getItem('Explanation')
		updateRefs('title', refs, title)
		updateRefs('exercise', refs, exercise)
		updateRefs('answer', refs, answer)
		updateRefs('hints', refs, hints)
		updateRefs('explain', refs, explain)
	},[])

	return(
	<>
		{bmt[0]==='Exercise' && <Exercise refs={refs}/>}
		{bmt[0]==='Hints' && <Hints refs={refs}/>}
		{bmt[0]==='Explanation' && <Explain refs={refs}/>}
		{bmt[0]==='Tags' && <TagList refs={refs}/>}

		<div className='bottomMenue'>
			<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Exercise'    && 'green'}`}>Exercise</BtnMenue>
			<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Hints'       && 'green'}`}>Hints</BtnMenue>
			<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Explanation' && 'green'}`}>Explanation</BtnMenue>
			<BtnMenue type='button' onClick={bottomMenueHandle} className={`btnBottomMenue ${bmt[0]==='Tags'        && 'green'}`}>Tags</BtnMenue>
			<BtnMenue type='button' onClick={submit} className='btnSubmit'>Preview</BtnMenue>
			<BtnMenue type='button' onClick={submit} className='btnSubmit'>Submit</BtnMenue>
		</div>
	</>
	) 
}
export default New;
