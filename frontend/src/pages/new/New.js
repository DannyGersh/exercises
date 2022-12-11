import './New.css'
import CSRFToken from '../../shared/Csrftoken'
import BtnMenue from '../../shared/buttons/BtnMenue'
import Exercise from './pages/Exercise'
import Hints from './pages/Hints'
import Explain from './pages/Explain'
import {useState, useEffect, useRef, useCallback} from 'react'
import {mainText2html, compArr, sendData, getStackTrace, uploadError} from '../../shared/Functions'
import {useNavigate, useLocation} from "react-router-dom";

import regex_escape from '../../shared/regex_escape'

import Btn from '../../shared/buttons/BtnOnOf'

const BMT_TARGETS = { // bottom menue targets
	exercise: 'Exercise',
	hints: 'Hints',
	explain: 'Explanation',
}
const CON = { // constants
	title: 'title',
	exercise: 'exercise',
	answer: 'answer',
	hints: 'hints',
	explain: 'explain',
	bmt: 'bmt',
	tags: 'tags',
	latex_pkg: 'latex_pkg',
}
const MAIN_STATES = {
	newExercise: 'newExercise',
	editInitial: 'editInitial',
	editInProgress: 'editInProgress', 
}
export {CON, MAIN_STATES}


function compileLatex(target, refs, text, compile=true, dir_exercise='temp') {
	
	// refs:
	// { target : [text, formated_text, timeoutId, {0: 'latex1', 1: 'latex2' ...}] , ... }
	
	if(!refs.current) { return -1 }

	if(!text) text='';
	let temp = text.match(/(\$\$.+?\$\$)/gms);
	if(!temp) temp=[];

	let old_latex = refs.current[target][3];
	let new_latex = temp.map(i=>i.substring(2,i.length-2)); // remove $$

	let latex_pkg = localStorage.getItem(CON.latexp);
	if(!latex_pkg) latex_pkg = ''; 

	new Set(Object.entries(old_latex)).forEach(i=>{
		if(!new_latex.includes(i[1])) {
			if(compile) {
				sendData('fetch/deleteLatex', 'POST', {
					userId : window.userId[0],
					target : target,
					latexId : parseInt(i[0]),
					dir_exercise : dir_exercise,
				})
			}
			delete refs.current[target][3][i[0]];
		} 
	})
	new Set(new_latex).forEach(i=>{
		if(!Object.values(old_latex).includes(i)) {
			let new_id = 0;
			if(Object.keys(old_latex).length) {
				new_id = Math.max(...Object.keys(old_latex))+1;
			}
			if(compile) {
				sendData('fetch/addLatex', 'POST', {
					userId : window.userId[0],
					dir_exercise : dir_exercise,
					target : target,
					latexId : new_id,
					latex : i,
					latex_pkg: latex_pkg,
				})
			}
			refs.current[target][3][new_id] = i
		} 
	})
	Object.entries(refs.current[target][3]).forEach(i=>{
		const reg = regex_escape(i[1]);
		text = text.replace(reg, i[0]);
	})
	refs.current[target][1] = text;
}

function updateRefs(target, refs, text, compile=true) {

	clearTimeout(refs.current[target][2]);

	refs.current[target][2] = (
		setTimeout(()=>{
			localStorage.setItem(target, text)
			refs.current[target][0] = text;
			compileLatex(target, refs, text, compile)
		}, 500)
	);
}

function tagsStrToArray(tagsStr) {
	let temp = [ ... new Set(tagsStr.split(','))];
	temp = temp.filter(i=>i!=='');
	return temp;
}

function New(props){
	
	const ctx = {
		exercise_edit: useLocation().state,
		mainState: MAIN_STATES.newExercise,
	}
	const navigate = useNavigate();
	const editInitial = localStorage.getItem(MAIN_STATES.editInitial);

	if(ctx.exercise_edit && editInitial) {
		
		// user clicked edit and got here
		ctx.mainState = MAIN_STATES.editInitial;
		localStorage.removeItem(MAIN_STATES.editInitial);
		
	} else if(ctx.exercise_edit && !editInitial) {
		
		// edit is in progress
		ctx.mainState = MAIN_STATES.editInProgress;

	} else {
	
		// this is a brand new exercise
		ctx.mainState = MAIN_STATES.newExercise;
	
	}

	const isEdit = ctx.mainState === MAIN_STATES.editInitial || ctx.mainState === MAIN_STATES.editInProgress;
	
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
	const temp = localStorage.getItem(CON.bmt);
	const bmt = useState(temp ? temp : BMT_TARGETS.exercise);
	// when bottom menue tab is clicked
	function h_btm(e){
		
		bmt[1](e.target.innerHTML);
		localStorage.setItem(CON.bmt, e.target.innerHTML)
	}

	function getLocalExercise() {
				
		const latex_pkg = localStorage.getItem(CON.latex_pkg)
		const title = localStorage.getItem(CON.title)
		const exercise = localStorage.getItem(CON.exercise)
		const answer = localStorage.getItem(CON.answer)
		const hints = localStorage.getItem(CON.hints)
		const explain = localStorage.getItem(CON.explain)
		let tags = localStorage.getItem(CON.tags)
		if(!tags) tags = '';
		tags = tagsStrToArray(tags);
		
		
		// PERROR - input validation
		
		function val_input(str) { 
			// val_input - validate input
			const q = str ? str.match(/<.*\/.*>/gms): '';
			return q
		}
		function val_isTagValid(tagStr) {
			return !/[^a-zA-Z0-9]/gms.test(tagStr);
		}
		
		
		for(let i=0; i< tags.length; i++) {
			if(!val_isTagValid(tags[i])) {
				window.alert(`invalid tag: ${tags[i]}`)
				return
			}
		}
		
		if(
			val_input(title) ||
			val_input(exercise) ||
			val_input(answer) ||
			val_input(hints) ||
			val_input(explain)
		) {
			window.alert("invalid input")
			return
		}
		// PERROR

		if( title && answer ) {
			
			const local_exercise = { 
				
				userId: window.userId[0],
				latex_pkg: latex_pkg,
				tags: tags,
				
				title		: refs.current[CON.title][1],
				exercise	: refs.current[CON.exercise][1],
				answer		: refs.current[CON.answer][1],
				hints		: refs.current[CON.hints][1],
				explain		: refs.current[CON.explain][1],
				
				latex_title		: refs.current[CON.title][3],
				latex_exercise	: refs.current[CON.exercise][3],
				latex_answer	: refs.current[CON.answer][3],
				latex_hints		: refs.current[CON.hints][3],
				latex_explain	: refs.current[CON.explain][3],
			
			}
			if(ctx.exercise_edit) {
				local_exercise['latex_dir'] = ctx.exercise_edit['latex_dir'];
			}
			
			return local_exercise;
			
		} else {
			let str = 'You are missing:\n';
			if(!title) { str += '* title (in the exercise tab)\n' }
			if(!answer) { str += '* answer\n' }
			window.alert(str)
		}
	}
	
	function h_submit() {
		
		const local_exercise = getLocalExercise();
		if(!local_exercise) return
		
		if(!ctx.exercise_edit) {
			sendData('fetch/submitExercise', 'POST', local_exercise)
			.then(result=>{
				if(!result['error']) {
					window.alert('successfully uploaded exercises.')
				}
			})
		} else {
			local_exercise['exerciseId'] = ctx.exercise_edit['exerciseId'];
			sendData('fetch/updateExercise', 'POST', local_exercise)
			.then(result=>{
				if(!result['error']) {
					window.alert('successfully updated exercises.')
					for (const [key, value] of Object.entries(CON)) {
						localStorage.removeItem(value);
					}
					navigate(`/profile/${window.userId[0]}`)
				}
			})
		}
	}

	function h_preview() {
		// timeout until all input timeout finishe
		// input timout is set to 500, so 150 would do
		setTimeout(()=>{
			const local_exercise = getLocalExercise();
			if(local_exercise) {
				return navigate('/exercise/preview', {state: local_exercise});
			}
		}, 150)
	}
	
	function genClassName(target) {
		const condition = bmt[0]===target;
		return `btnMenue ${condition ? 'color_btn_green' : 'color_btn_default'}`
	}
	
	useEffect(()=>{
		if(ctx.mainState === MAIN_STATES.newExercise || ctx.mainState === MAIN_STATES.editInProgress) {
			let title = localStorage.getItem(CON.title)
			let exercise = localStorage.getItem(CON.exercise)
			let answer = localStorage.getItem(CON.answer)
			let hints = localStorage.getItem(CON.hints)
			let explain = localStorage.getItem(CON.explain)
			updateRefs(CON.title, refs, title, false)
			updateRefs(CON.exercise, refs, exercise, false)
			updateRefs(CON.answer, refs, answer, false)
			updateRefs(CON.hints, refs, hints, false)
			updateRefs(CON.explain, refs, explain, false)
		} else {
			// ctx.mainState === MAIN_STATES.editInitial
			const title = mainText2html(ctx.exercise_edit, CON.title, true);
			const exercise = mainText2html(ctx.exercise_edit, CON.exercise, true);
			const answer = mainText2html(ctx.exercise_edit, CON.answer, true);
			const hints = mainText2html(ctx.exercise_edit, CON.hints, true);
			const explain = mainText2html(ctx.exercise_edit, CON.explain, true);
			updateRefs(CON.title, refs, title)
			updateRefs(CON.exercise, refs, exercise)
			updateRefs(CON.answer, refs, answer)
			updateRefs(CON.hints, refs, hints)
			updateRefs(CON.explain, refs, explain)
		}
	},[])

	return(
	<>
		{bmt[0]===BMT_TARGETS.exercise	&& <Exercise refs={refs} ctx={ctx}/>}
		{bmt[0]===BMT_TARGETS.hints		&& <Hints	 refs={refs} ctx={ctx}/>}
		{bmt[0]===BMT_TARGETS.explain	&& <Explain  refs={refs} ctx={ctx}/>}

		<div className='bottomMenue'>
			<Btn text={BMT_TARGETS.exercise}
				onClick={h_btm} 
				className={genClassName(BMT_TARGETS.exercise)}
			/>
			<Btn 
				text={BMT_TARGETS.hints}
				onClick={h_btm}
				className={genClassName(BMT_TARGETS.hints)}
			/>
			<Btn 
				text={BMT_TARGETS.explain}
				onClick={h_btm}
				className={genClassName(BMT_TARGETS.explain)}
			/>
			<BtnMenue onClick={h_preview} className='color_btn_blue'>Preview</BtnMenue>
			<BtnMenue onClick={h_submit} className='color_btn_blue'>{!isEdit ? 'Submit' : 'Update'}</BtnMenue>
		</div>
	</>
	) 
}
export default New;
