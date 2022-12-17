import './Shared.css'
import {useEffect, useRef} from 'react'
import {mainText2html} from '../../../shared/Functions'

import {CON, MAIN_STATES} from '../New'

function Exercise(props){
	
	const ctx = props.ctx;
	const updateRefs = props.refs.current.update;

	if(!localStorage.getItem(CON.tags)) {
		localStorage.setItem(CON.tags, '');
	}
	if(!localStorage.getItem(CON.title)) {
		localStorage.setItem(CON.title, '');
	}
	if(!localStorage.getItem(CON.exercise)) {
		localStorage.setItem(CON.exercise, '');
	}
	if(!localStorage.getItem(CON.answer)) {
		localStorage.setItem(CON.answer, '');
	}
	
	useEffect(()=>{
		const temp_cond = (
			ctx.mainState === MAIN_STATES.newExercise || 
			ctx.mainState === MAIN_STATES.editInProgress
		)
		
		if(temp_cond) {
			document.getElementById(CON.tags).value = 
				localStorage.getItem(CON.tags);
			document.getElementById(CON.latex_pkg).value = 
				localStorage.getItem(CON.latex_pkg);
			document.getElementById(CON.title).value = 
				localStorage.getItem(CON.title);
			document.getElementById(CON.exercise).value = 
				localStorage.getItem(CON.exercise);
			document.getElementById(CON.answer).value = 
				localStorage.getItem(CON.answer);
		} else {
			const tags = ctx.exercise_edit.tags;
			const latex_pkg = ctx.exercise_edit.latex_pkg;
			
			const title = mainText2html(
				ctx.exercise_edit, CON.title, true
			);
			const exercise = mainText2html(
				ctx.exercise_edit, CON.exercise, true
			);
			const answer = mainText2html(
				ctx.exercise_edit, CON.answer, true
			);
			
			document.getElementById(CON.tags).value = tags;
			document.getElementById(CON.latex_pkg).value = latex_pkg;
			document.getElementById(CON.title).value = title;
			document.getElementById(CON.exercise).value = exercise;
			document.getElementById(CON.answer).value = answer;
			localStorage.setItem(CON.tags, tags);
			localStorage.setItem(CON.latex_pkg, latex_pkg);
			localStorage.setItem(CON.title, title);
			localStorage.setItem(CON.exercise, exercise);
			localStorage.setItem(CON.answer, answer);
		}	
	},[])

	return(
	<div className='Exercise'>
		
		<label>tags</label>
		<input
			id={CON.tags}
			onChange={(v)=>
				localStorage.setItem(CON.tags, v.target.value)
			}
			defaultValue={localStorage.getItem(CON.tags)}
			style={{width:'100%'}}
			type="text" 
		/>
		
		<label>latex packages</label>
		<input
			id={CON.latex_pkg}
			onChange={(v)=>
				localStorage.setItem(CON.latex_pkg, v.target.value)
			}
			defaultValue={localStorage.getItem(CON.latexp)}
			style={{width:'100%'}}
			type="text" 
		/>
		
		<br/><br/>
		
		<label>title *</label>
		<input
			id={CON.title}
			onChange={(v)=>
				updateRefs(CON.title, props.refs, v.target.value)
			}
			defaultValue={localStorage.getItem(CON.title)}
			style={{width:'100%'}}
			type="text" 
		/>

		<br/><br/>
		
		<label>Exercise bodie</label>
		<textarea 
			id={CON.exercise}
			onChange={(v)=>
				updateRefs(CON.exercise, props.refs, v.target.value)
			}
			rows='6' 
			className='ExerciseTextArea' 
			required
		/>
		
		<br/><br/>
		
		<label>answer *</label>
		<textarea
			id={CON.answer}
			onChange={(v)=>
				updateRefs(CON.answer, props.refs, v.target.value)
			}
			defaultValue={localStorage.getItem(CON.answer)}
			rows='6' 
			className='ExerciseTextArea' 
		/>
		
		<br/><br/>

		<label>Tips:</label>
		<ul>
			<li>make the title short and to the point</li>
			<li>make the exercise focused on the topic you choose</li>
			<li>be as clear as possible</li>
			<li>avoid confusing the reader with fancy jargon</li>
		</ul>
		
		<br/>

		<label>Latex:</label>
		
		<ul>
			<li>insert your latex in the following way:</li><br/>
			<ul><li>
				... some example normal text 
				 &nbsp;<font color="green">$$ latex goes here $$
				</font> some other example normal text ... 
			</li></ul><br/>
		
			<li>
				for easy math editing, use this free  &nbsp;
				<a href='https://latex.codecogs.com/eqneditor/editor.php'>
				online latex equation editor</a>, 
				microsoft word equation editor, 
				or any other tool that can yield latex.
			</li><br/>
			<li>
				the latex installation is "texlive-latex-extra"
			</li><br/>
			<li>
				"latex packages" is a 
				<u>double comma</u> separated list 
				of latex package directives. example:
			</li><br/>
			<ul><li>{`
				\\usepackage{amsmath},, 
				\\usepackage{some_other_pacage},, 
				\\usepackage[left=2.00cm, right=1.00cm]{geometry}
			`}</li></ul><br/>
			<li>
				try to split your latex into small chunks, 
				for better text wrapping:
			</li><br/>
			<ul>
				<li>
					instead of: 
					$$ some very long latex ... $$, 
					go for: 
					$$ some very $$ $$ long latex ... $$
				</li><br/>
				<li>
					this increases the quality of the exercise
				</li>
			</ul><br/>

		</ul>

		<br/><br/>

	</div>
	)
}
export default Exercise;
