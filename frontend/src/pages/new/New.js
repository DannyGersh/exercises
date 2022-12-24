import {useState, useEffect, useRef, useCallback} from 'react'
import {useNavigate, useLocation} from "react-router-dom";
import {REG_NEW_LINE, TARGETS, mainText2html, sendData} from '../../shared/Functions'
import regex_escape from '../../shared/regex_escape'
import Btn, {BtnTab} from '../../shared/buttons/Buttons'
import Exercise from './pages/Exercise'
import Hints from './pages/Hints'
import Explain from './pages/Explain'
import './New.css'


const BMT_TARGETS = { // bottom menue targets
	exercise: 'Exercise',
	hints: 'Hints',
	explain: 'Explanation',
}
const CON = { // constants
	bmt: 's_bmt',
	tags: 'tags',
	latex_pkg: 'latex_pkg',
	main_state: 'main_state',
}
const MAIN_STATES = {
	newExercise: 'newExercise',
	editInitial: 'editInitial',
	editInProgress: 'editInProgress', 
}
export {CON, MAIN_STATES}


function compileLatex(
	target, refs, text, compile=true, dir_exercise='temp') {
	
	/* refs:
		{ target : [
			text, 
			formated_text, 
			timeoutId, 
			{0: 'latex1', 1: 'latex2' ...}
		] , ... }
	*/

	if(!refs.current) { return -1 }

	if(!text) text='';
	let temp = text.match(/(\$\$.+?\$\$)/gms);
	if(!temp) temp=[];

	let old_latex = refs.current[target][3];
	// remove $$
	let new_latex = temp.map(i=>i.substring(2,i.length-2)); 

	let latex_pkg = localStorage.getItem(CON.latex_pkg);
	if(!latex_pkg) latex_pkg = ''; 

	// delete latex
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
	// add latex
	new Set(new_latex).forEach((item, index)=>{
		if(!Object.values(old_latex).includes(item)) {
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
					latex : item,
					latex_pkg: latex_pkg,
				})
			}
			refs.current[target][3][new_id] = item
		} 
	})
	Object.entries(refs.current[target][3]).forEach(i=>{
		const reg = regex_escape(`\$\$${i[1]}\$\$`);
		text = text.replace(reg, `\$\$\$${i[0]}\$\$\$`);
	})
	refs.current[target][1] = text;
	
	localStorage.setItem(
		target, 
		JSON.stringify([text, refs.current[target][3]])
	);
}

function updateRefs(target, refs, text, compile=true) {

	clearTimeout(refs.current[target][2]);

	refs.current[target][2] = (
		setTimeout(()=>{
			refs.current[target][0] = text;
			compileLatex(target, refs, text, compile)
		}, 1000)
	);
}

function tagsStrToArray(tagsStr) {
	let temp = [ ... new Set(tagsStr.split(','))];
	temp = temp.filter(i=>i!=='');
	return temp;
}
export {tagsStrToArray}


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

	const isEdit = (
		ctx.mainState === MAIN_STATES.editInitial || 
		ctx.mainState === MAIN_STATES.editInProgress
	);

	const refs = useRef({
		/*
			target : [text, formated_text, timeoutId, latex_object]
			text - the raw text of an input field
			
			formated_text - 
				same as text but all latex is replased 
				with ids from latex_object: $$latex$$ => $$id1$$ 
				where id1 is a number
			
			timeoutId - the id of a timeout clock
			latex_object - {id1: 'latex1', id2: 'latex2', ...}
		*/
		title 	 : ['', '', '', {}],
		exercise : ['', '', '', {}],
		answer 	 : ['', '', '', {}],
		hints 	 : ['', '', '', {}],
		explain  : ['', '', '', {}],
		update   : updateRefs,
	})

	// s_bmt (bottom menue tab) -
	//		str representing which tab is currently selected
	const temp = localStorage.getItem(CON.bmt);
	const s_bmt = useState(temp ? temp : BMT_TARGETS.exercise);
	
	// when bottom menue tab is clicked
	function h_btm(e){
		
		s_bmt[1](e.target.innerHTML);
		localStorage.setItem(CON.bmt, e.target.innerHTML)
	}

	function getLocalExercise() {
			
		// PERROR - input validation
		
		let tags = localStorage.getItem(CON.tags)
		let latex_pkg = localStorage.getItem(CON.latex_pkg)
		if(!tags) tags = '';
		if(!latex_pkg) latex_pkg = '';
		tags = tagsStrToArray(tags);
		
		for(const [target, value] of Object.entries(TARGETS)) {
			if(refs.current[target][0].match(/<.*\/.*>/gms)) {
				window.alert("invalid input")
				return
			}
		}
		for(const tag of tags) {
			if(/[^a-zA-Z0-9\s]/gms.test(tag)) {
				window.alert(`invalid tag: ${tag}`);
				return;
			}
		}

		// END_PERROR

		if( refs.current[TARGETS.title][1] && 
			refs.current[TARGETS.answer][1] ) {
			
			const local_exercise = { 
				
				userId: window.userId[0],
				latex_pkg: latex_pkg,
				tags: tags,
				
				title		: refs.current[TARGETS.title][1],
				exercise	: refs.current[TARGETS.exercise][1],
				answer		: refs.current[TARGETS.answer][1],
				hints		: refs.current[TARGETS.hints][1],
				explain		: refs.current[TARGETS.explain][1],
				
				latex_title		: refs.current[TARGETS.title][3],
				latex_exercise	: refs.current[TARGETS.exercise][3],
				latex_answer	: refs.current[TARGETS.answer][3],
				latex_hints		: refs.current[TARGETS.hints][3],
				latex_explain	: refs.current[TARGETS.explain][3],
			
			}
			if(ctx.exercise_edit) {
				local_exercise['latex_dir'] = 
					ctx.exercise_edit['latex_dir'];
			}
			
			return local_exercise;
			
		} else {
			let errorStr = 'You are missing:\n';
			if(!refs.current[TARGETS.title][1]) { 
				errorStr += '* title (in the exercise tab)\n' 
			}
			if(!refs.current[TARGETS.answer][1]) { 
				errorStr += '* answer\n' 
			}
			window.alert(errorStr)
		}
	}
	
	const str_wdnConf_nonPrivate = `
	this exercises does not contain the "private" tag, 
	thus it will be public. 
	continue ?
	`.replace(REG_NEW_LINE, '');
	
	function h_submit() {
		
		const local_exercise = getLocalExercise();
		if(!local_exercise) return
		
		console.log(local_exercise['tags'])
		if(!local_exercise['tags'].includes('private')) {
			if(!window.confirm(str_wdnConf_nonPrivate)) return;
		}
		
		if(!ctx.exercise_edit) {
			sendData('fetch/submitExercise', 'POST', local_exercise)
			.then(result=>{
				if(!result['error']) {
					window.alert('successfully uploaded exercises.')
					for (const [key, value] of Object.entries(CON)) {
						localStorage.removeItem(value);
					}
					for (const [key, value] of Object.entries(TARGETS)) {
						localStorage.removeItem(value);
					}
					navigate(`/profile/${window.userId[0]}`)
				}
			})
		} else {
			
			local_exercise['exerciseId'] = 
				ctx.exercise_edit['exerciseId'];
				
			sendData('fetch/updateExercise', 'POST', local_exercise)
			.then(result=>{
				if(!result['error']) {
					window.alert('successfully updated exercises.')
					for (const [key, value] of Object.entries(CON)) {
						localStorage.removeItem(value);
					}
					for (const [key, value] of Object.entries(TARGETS)) {
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
				return navigate('/exercise/preview', {
					state: local_exercise
				});
			}
		}, 150)
	}
	
	function genClassName(target) {
		const condition = s_bmt[0]===target;
		return (`
			btnTab 
			${condition ? 'color_btn_green' : 'color_btn_default'}
		`)
	}
		
	useEffect(()=>{

		if(ctx.mainState!==MAIN_STATES.editInitial){
			for (const [key, value] of Object.entries(TARGETS)) {
				
				let item = localStorage.getItem(value);
				
				if(!item) {
					localStorage.setItem(value, '');
					item = '["",{}]';
				}
				
				item = JSON.parse(item);
				
				refs.current[key][1] = item[0];
				refs.current[key][3] = item[1];
	
				for(const [index, latex] of Object.entries(item[1])) {
					item[0] = item[0].replace(
						`\$\$${index}\$\$`, 
						`\$\$\$${latex}\$\$\$`
					);
				}
				refs.current[key][0] = item[0];
			
				const node = document.getElementById(key);
				if(node) node.value = item[0];
			}
		} else {
			for (const [key, value] of Object.entries(TARGETS)) {
				
				let string = ctx.exercise_edit[key];
				const replacment = ctx.exercise_edit[`latex_${key}`];
				
				localStorage.setItem(
					key, 
					JSON.stringify([string, replacment])
				);
				
				refs.current[key][1] = string;
				for(const [index, latex] of Object.entries(replacment)) {
					string = string.replaceAll(
						`\$\$${index}\$\$`, 
						`\$\$\$${latex}\$\$\$`
					);
				}
				refs.current[key][0] = string;
				refs.current[key][3] = replacment;
				
				const node = document.getElementById(key);
				if(node) node.value = string;
			}
			sendData('fetch/initialEdit', 'POST', {
				'latex_dir': ctx.exercise_edit['latex_dir'],
				'author': ctx.exercise_edit['author'],
			})
		}
	},[s_bmt])
	
	
	return(
	<>
		{s_bmt[0]===BMT_TARGETS.exercise && 
			<Exercise refs={refs} ctx={ctx}/>
		}
		{s_bmt[0]===BMT_TARGETS.hints && 
			<Hints refs={refs} ctx={ctx}/>
		}
		{s_bmt[0]===BMT_TARGETS.explain && 
			<Explain refs={refs} ctx={ctx}/>
		}
		
		{/* btm tabs */}
		<div className='NewBottomMenue'>
			<Btn 
				children={BMT_TARGETS.exercise}
				onClick={h_btm} 
				className={genClassName(BMT_TARGETS.exercise)}
			/>
			<Btn 
				children={BMT_TARGETS.hints}
				onClick={h_btm}
				className={genClassName(BMT_TARGETS.hints)}
			/>
			<Btn 
				children={BMT_TARGETS.explain}
				onClick={h_btm}
				className={genClassName(BMT_TARGETS.explain)}
			/>
			
			{/* previe and submit btn */}
			<BtnTab 
				onClick={h_preview} 
				className='color_btn_blue'
				children='Preview'
			/>
			<BtnTab 
				onClick={h_submit} 
				className='color_btn_blue'
				children={!isEdit ? 'Submit' : 'Update'}
			/>
		</div>
	</>
	) 
}
export default New;
