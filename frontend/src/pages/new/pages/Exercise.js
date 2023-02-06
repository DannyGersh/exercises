import React, {useEffect} from 'react'
import {TARGETS} from '../../../shared/Functions'
import {CON, MAIN_STATES} from '../New'
import ToolTip from '../../../shared/tooltip/ToolTip'
import './Shared.css'


function Exercise(props){
	
	const ctx = props.ctx;
	const updateRefs = props.refs.current.update;

	useEffect(()=>{
		const node_tags = document.getElementById(CON.tags);
		const node_latex_pkg = document.getElementById(CON.latex_pkg);

		if(ctx.mainState === MAIN_STATES.editInitial) {
			const def_tags = ctx.exercise_edit['tags'].join();
			const def_latex_pkg = ctx.exercise_edit['latex_pkg'];
			localStorage.setItem(CON.tags, def_tags);
			localStorage.setItem(CON.latex_pkg, def_latex_pkg);
			node_tags.value = def_tags;
			node_latex_pkg.value = def_latex_pkg;
		} else {
			let def_tags = localStorage.getItem(CON.tags)
			const def_latex_pkg = localStorage.getItem(CON.latex_pkg)
			if(ctx.mainState === MAIN_STATES.newExercise && !def_tags) {
				def_tags = 'private'
			}
			node_tags.value = def_tags;
			node_latex_pkg.value = def_latex_pkg;
		}
	}, [ctx.s_bmt, ctx.exercise_edit, ctx.mainState])

	const str_tooltip_tags = `
	comma separated list of tags.
	the "private" tag keeps this 
	exercise only accessible in your profile
	`
	const str_tooltip_latex_pkg = `
	double comma separated list 
	of latex packages. 
	see the "latex" section 
	below the tips
	`	
	const style_label = {display:'flex', alignItems:'center'};
	
	return(
	<form className='Exercise'>
		
		<div style={style_label}>
		<label htmlFor='tags'>tags</label>
		<ToolTip 
			id1 = 'tooltip_tags1'
			id2 = 'tooltip_tags2'
			text = {str_tooltip_tags}
		>ⓘ</ToolTip>	
		</div>
		
		<input 
			name='tags'
			id={CON.tags}
			onChange={(e)=>
				localStorage.setItem(CON.tags, e.target.value)
			}
			placeholder='private'
			style={{width:'100%'}}
			type="text" 
		/>
		
		<br/><br/>
		
		<div style={style_label}>
		<label htmlFor={CON.latex_pkg}>latex packages</label>
		<ToolTip 
			id1 = 'tooltip_latex_pkg1'
			id2 = 'tooltip_latex_pkg2'
			text = {str_tooltip_latex_pkg}
		>ⓘ</ToolTip>
		</div>
		
		<input
			name={CON.latex_pkg}
			id={CON.latex_pkg}
			onChange={(e)=>
				localStorage.setItem(CON.latex_pkg, e.target.value)
			}
			style={{width:'100%'}}
			type="text" 
		/>
		
		<br/><br/><br/>
		
		<label  htmlFor='title'>title *</label>
		<input
			name='title'
			id={TARGETS.title}
			onChange={(e)=>
				updateRefs(TARGETS.title, props.refs, e.target.value)
			}
			style={{width:'100%'}}
			type="text" 
		/>

		<br/><br/>
		
		<label htmlFor={TARGETS.exercise}>exercise_bodie</label>
		<textarea 
			name={TARGETS.exercise}
			id={TARGETS.exercise}
			className='ExerciseTextArea' 
			onChange={(e)=>
				updateRefs(TARGETS.exercise, props.refs, e.target.value)
			}
			rows='6' 
		/>
		
		<br/><br/>
		
		<label htmlFor='answer'>answer *</label>
		<textarea
			name='answer'
			id={TARGETS.answer}
			className='ExerciseTextArea' 
			onChange={(e)=>
				updateRefs(TARGETS.answer, props.refs, e.target.value)
			}
			rows='6' 
		/>
		
		<br/><br/>

		<label>Tips:</label>
		<ul>
			<li>make sure you never use a new line, unless you are starting a new paragraph or for example; you want a math equation to be separated by new lines.</li>
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
				the latex installation is &quot;texlive-latex-extra&quot;
			</li><br/>
			<li>
				&quot;latex packages&quot; is a 
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

	</form>
	)
}
export default Exercise;
