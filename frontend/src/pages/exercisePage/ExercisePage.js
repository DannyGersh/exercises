//import MainJsx from './ExercisePageJsx.js'
import {useCallback, useState, useEffect, useRef} from 'react'
import {useController, sendData, mainText2html} from '../../shared/Functions'
import { useParams } from "react-router-dom";
import BtnOnOf, {BtnRadio} from '../../shared/buttons/BtnOnOf'
import ToolTip from '../../shared/tooltip/ToolTip'
import './ExercisePage.css'


const BTM_TARGETS = {
	title: 'Title',
	exercise: 'Exercise',
	hints: 'Hints',
	answer: 'Answer',
	explain: 'Explain',
}


function ExerciseBody(props) {
	
	const ctx = props.ctx;

	const refs = {
		exercise : useRef(null),
		answer : useRef(null),
		hints : useRef(null),
		explain : useRef(null),
	}
	
	function setVisibility(ref, target) {
		
		const style = ref.current.style;
		
		if(ctx.c_hae[0]()[1]===target) {
			style.visibility = 'visible';
		} else {
			style.visibility = 'hidden';
		}
			
	}
	
	function setVisibilityStyle(target) {
		
		const condition = ctx.c_hae[0]()[1] === target;
		
		return {
			visibility: condition ? 'visible' : 'hidden',
			position: 'fixed',
			top: '6rem',
		}
				
	}
	
	ctx.c_hae[2]('renderMainBody', ()=>{
		setVisibility(refs.exercise, BTM_TARGETS.exercise);
		setVisibility(refs.hints, BTM_TARGETS.hints);
		setVisibility(refs.answer, BTM_TARGETS.answer);
		setVisibility(refs.explain, BTM_TARGETS.explain);
	})
	
	const mainStyle = {
		height:'calc(100vh - 7rem)',
		marginLeft: '1rem'
	}

	
	return(
	
	<div className='hscroll' style={mainStyle}>

		<div id={BTM_TARGETS.title} 
			className='textWithLatex'
		/>
		<div id={BTM_TARGETS.exercise} 
			ref={refs.exercise}
			className='textWithLatex' 
			style={setVisibilityStyle(BTM_TARGETS.exercise)}
		/>	
		<div id={BTM_TARGETS.answer}
			ref={refs.answer} 
			className='textWithLatex clientBody'
			style={setVisibilityStyle(BTM_TARGETS.answer)}
		/>	
		<div id={BTM_TARGETS.hints} 
			ref={refs.hints} 
			className='textWithLatex clientBody'
			style={setVisibilityStyle(BTM_TARGETS.hints)}
		/>
		<div id={BTM_TARGETS.explain} 
			ref={refs.explain}
			className='textWithLatex clientBody'
			style={setVisibilityStyle(BTM_TARGETS.explain)}
		/>

	</div>
	
	)
	
}

function BottomRightMenue(props) {

	const ctx = props.ctx;

	function h_like() { // user clicked like btn
		
		if(window.userId[0]) {
			
			if( ctx.c_isLike[0]() ) {
				ctx.r_likes.current-=1;
				ctx.r_btn_like_text.current = `${ctx.r_likes.current}\nLikes`;
				ctx.c_isLike[1](false);
			} else {
				ctx.r_likes.current+=1;
				ctx.r_btn_like_text.current = `${ctx.r_likes.current}\nLikes`;
				ctx.c_isLike[1](true);
			}
			
			sendData('fetch/like', 'POST', {
				exerciseId: ctx.r_exercise.current['exerciseId'],
				userId: window.userId[0],
			})
			
		}
	}
	
	
	return(

		<div className='bottomRight'>
			
			<BtnRadio 
				c_selected={ctx.c_hae}
				name={BTM_TARGETS.exercise}
				className='btnRound'
			/>
			
			{ ctx.r_exercise.current['hints'] &&
				<BtnRadio 
					c_selected={ctx.c_hae}
					name={BTM_TARGETS.hints}
					className='btnRound'
				/>
			}
			
			<BtnRadio 
				c_selected={ctx.c_hae}
				name={BTM_TARGETS.answer}
				className='btnRound'
			/>
			
			{ ctx.r_exercise.current['explain'] && 
				<BtnRadio 
					c_selected={ctx.c_hae}
					name={BTM_TARGETS.explain}
					className='btnRound'
				/>
			}
			
			{/* like btn */}
			{ window.userId[0] ?
				<BtnOnOf 
					className='btnRound'
					c_isOn={ctx.c_isLike} 
					r_text={ctx.r_btn_like_text}
					onClick={h_like}
				/>
				: 
				<BtnOnOf 
					className='btnRound'
					r_text={ctx.r_btn_like_text}
				/>
			}
					
		</div>

	)

}

function SendMessage(props) {

	const ctx = props.ctx;
	const dspSendMsg = useState(false);

	const id_sendMsg = 'id_sendMsg';
	
	function h_sendMsg() {
		
		const message = document.getElementById(id_sendMsg).value;

		sendData('fetch/sendMsg', 'POST', {
			'exerciseId': ctx.r_exercise.current['exerciseId'], 
			'sender': window.userId[0], 
			'receiver': ctx.r_exercise.current['author'], 
			'message': message,
		})
		
		dspSendMsg[1](false);
	}
	
	return (
	<>
	  <hr/>
		<div style={{display: 'flex', alignItems:'center'}}>	

		<p 
			onClick={()=>{dspSendMsg[1](!dspSendMsg[0])}} 
			className='sendMessage'>send message
		</p>	

		<ToolTip 
			id1 = 'ToolTip1'
			id2 = 'ToolTip2'
			text = 'inform the author of typos, mistakes, improvements, etc. the message would be sent with this exercise attached.'
		>
		<button className='btnRound info'>i</button>
		</ToolTip>	
	

		</div>	

	  { dspSendMsg[0] &&
		<>
		  <textarea id={id_sendMsg} rows='4' type='textarea'/>
		  <br/>
		  <button onClick={h_sendMsg}>Send</button>
		</>
		}	

	</>
	)
}

function PopupMenue(props) {

	const ctx = props.ctx;
	const dspReport = useState(false);
	const s_render = useState(false);
	
	ctx.c_isPopup[2]('c_isPopup', ()=>{
		s_render[1](!s_render[0]);
		dspReport[1](false);
	})
	
	const jsx = <>	
		
		{/* what makes the popup look like a talking buble */}
		<div className='additionalArrow'/>	
		
		{/* main popup */}
		<div className='additionalMenue'>	
	
			<p>
				Created by 
				{` ${ctx.r_exercise.current['username']}`} 
				<br/> 
				{ctx.r_exercise.current['creationdate']}
				<br/>
			</p>
			
			{ window.userId[0] && <SendMessage ctx={ctx}/>}	
			<hr/>
			
			<p onClick={()=>{dspReport[1](!dspReport[0])}} 
				className='report'>report
			</p>	
			{dspReport[0] && <p>temp</p>}
			
		</div>	
		
	</>
		
	if(ctx.c_isPopup[0]()) {
		return (jsx) 
	} else {
		return <></>
	}
}

function BottomLeftMenue(props) {

	const ctx = props.ctx;

	return (

	<div className="bottomLeft">
	  
		{/* adittional menue button (...) */}      
		<button 
			onClick={()=>{ctx.c_isPopup[1](!ctx.c_isPopup[0]())}} 
			className='additional'
		>...</button>	

		<PopupMenue ctx={ctx}/>	

	</div>

	)
}

function MainBodie(props) {
	
	return (<>
		<ExerciseBody ctx={props.ctx}/>
		<BottomLeftMenue ctx={props.ctx}/>
		<BottomRightMenue ctx={props.ctx}/>
	</>)
	
}


function ExercisePage(props){

	const params = useParams();
	const exerciseId = parseInt(params['exerciseId']);

	const ctx = {
		
		s_finLoad: useState(false),
		
		c_hae:		useController([null, BTM_TARGETS.exercise]),
		c_isLike:	useController(null),
		c_isPopup:	useController(false),
		
		r_likes: useRef(0),
		r_btn_like_text: useRef(`0\nLikes`),
	
		r_exercise: useRef({
			
			id          : exerciseId,
			author      : 0,
			creationdate: '',
			rating      : [],
			tags        : [],
			latex_dir   : '',
			
			title   	: '',
			exercise	: '',
			answer  	: '',
			hints   	: '',
			explain 	: '',
			
		}),
		
	}

	useEffect(()=>{
		sendData('fetch/exercisePage', 'POST', {
			'exerciseId': exerciseId
		})
		.then(e=>{ // e == exercise

			e['title'] = mainText2html(e, 'title');
			e['exercise'] = mainText2html(e, 'exercise');
			e['answer'] = mainText2html(e, 'answer');
			e['hints'] = mainText2html(e, 'hints');
			e['explain'] = mainText2html(e, 'explain');
			
			ctx.r_likes.current = e['rating'].length;
			ctx.r_btn_like_text.current = `${ctx.r_likes.current}\nLikes`;
			ctx.c_isLike[1](e['rating'].includes(window.userId[0]));
			
			ctx.r_exercise.current = e;
			
			const n_title = document.getElementById(BTM_TARGETS.title);
			const n_exercise = document.getElementById(BTM_TARGETS.exercise);
			const n_answer = document.getElementById(BTM_TARGETS.answer);
			const n_hints = document.getElementById(BTM_TARGETS.hints);
			const n_explain = document.getElementById(BTM_TARGETS.explain);

			n_title.innerHTML = `<h3>${ctx.r_exercise.current['title']}</h3>`
			n_exercise.innerHTML = `<p>${ctx.r_exercise.current['exercise']}</p>`
			n_answer.innerHTML = `<p>${ctx.r_exercise.current['answer']}</p>`
			n_hints.innerHTML = `<p>${ctx.r_exercise.current['hints']}</p>`
			n_explain.innerHTML = `<p>${ctx.r_exercise.current['explain']}</p>`
			
			// reload page after fetch exercise
			ctx.s_finLoad[1](true);
		
		})
	},[])
	
	return(<MainBodie ctx={ctx}/>)

}


export default ExercisePage;
