import React, {useState, useEffect, useRef} from 'react'
import {useParams, useLocation, Link} from "react-router-dom";
import {sendData, mainText2html} from '../../shared/Functions'
import useController from '../../shared/Hooks'
import Btn, {BtnOnOf, BtnRadio} from '../../shared/buttons/Buttons'
import ToolTip from '../../shared/tooltip/ToolTip'
import Tag from '../../shared/tag/Tag'
import Loading from '../../shared/loading/Loading'
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
		main : useRef(null),
		exercise : useRef(null),
		answer : useRef(null),
		hints : useRef(null),
		explain : useRef(null),
	}
	
	
	function setVisibility(ref, target) {
		
		const style = ref.current.style;
		
		if(ctx.c_hae[0]()[1]===target) {
			style.visibility = 'visible';
			refs.main.current.style.height = `
				${ref.current.getBoundingClientRect().height}px
			`;
		} else {
			style.visibility = 'hidden';
		}
	}
	
	ctx.c_hae[2]('renderMainBody', ()=>{
		setVisibility(refs.exercise, BTM_TARGETS.exercise);
		setVisibility(refs.hints, BTM_TARGETS.hints);
		setVisibility(refs.answer, BTM_TARGETS.answer);
		setVisibility(refs.explain, BTM_TARGETS.explain);
	})
		
	function genParagraphStyle(target) {
		
		const condition = ctx.c_hae[0]()[1] === target;

		return {
			position: 'absolute',
			visibility: condition ? 'visible' : 'hidden',
		}
	}

	const style_main = {
		height:'calc(100vh - 7.5rem)',
		marginLeft: '1rem',
	}

	const style_mainRef = {
		overflow:'hidden', 
		backgruondColor: 'blue', 
		position: 'relative',
		top: '-1rem',
	}
	
	if(refs.main.current && ctx.s_finLoad[0]) {
		let id_interval = setInterval(()=>{
			refs.main.current.style.height = `
			${refs.exercise.current.getBoundingClientRect().height}px
			`;
		},100);
		setTimeout(()=>{
			clearInterval(id_interval);
		}, 1000)
	}
	
	
	return(
	
	<div className='vscroll' style={style_main}>

		{ctx.s_finLoad[0] !== true &&
			<Loading vcenter={true}/>
		}
		
		<div id={BTM_TARGETS.title} 
			className='textWithLatex'
		/>
		
		<div style={style_mainRef} ref={refs.main}>
		
		<div id={BTM_TARGETS.exercise} 
			ref={refs.exercise}
			className='textWithLatex' 
			style={genParagraphStyle(BTM_TARGETS.exercise)}
		/>	
		<div id={BTM_TARGETS.answer}
			ref={refs.answer} 
			className='textWithLatex'
			style={genParagraphStyle(BTM_TARGETS.answer)}
		/>	
		<div id={BTM_TARGETS.hints} 
			ref={refs.hints} 
			className='textWithLatex'
			style={genParagraphStyle(BTM_TARGETS.hints)}
		/>
		<div id={BTM_TARGETS.explain} 
			ref={refs.explain}
			className='textWithLatex'
			style={genParagraphStyle(BTM_TARGETS.explain)}
		/>

		</div>
	
	</div>
	
	)
	
}

function SendMessage(props) {

	const ctx = props.ctx;
	const states = props.states;
	const id_sendMsg = 'id_sendMsg';
	
	function h_sendMsg() {
		
		const message = document.getElementById(id_sendMsg).value;

		sendData('fetch/sendMsg', 'POST', {
			'exerciseId': ctx.r_exercise.current['exerciseId'], 
			'sender': window.userId[0], 
			'receiver': ctx.r_exercise.current['author'], 
			'message': message,
		}).then(d=>{
			if(d.success) {
				window.alert('message sent successfully');
			}
		})

		states.s_dspReport[1](false);		
		states.s_dspSendMsg[1](false);
	}
	
	function h_togleSendMsg() {
		states.s_dspSendMsg[1](!states.s_dspSendMsg[0]);
		states.s_dspReport[1](false);
	}
	
	const info_message = `
		inform the author of typos, mistakes, improvements, etc. 
		the message would be sent with this exercise attached.
	`
	
	return (
	<>
		<hr/>
		<div style={{display: 'flex', alignItems:'center'}}>	

		<p 
			onClick={h_togleSendMsg} 
			className='sendMessage'
		>
			send message
		</p>	

		<ToolTip 
			id1 = 'ToolTip1'
			id2 = 'ToolTip2'
			text = {info_message}
		>ⓘ</ToolTip>

		</div>	

		{ Boolean(states.s_dspSendMsg[0]) &&
		<>
			<textarea id={id_sendMsg} rows='4' type='textarea'/>
			<br/>
			<button onClick={h_sendMsg}>Send</button>
		</>
		}	

	</>
	)
}

function TagsList(props) {

		const ctx = props.ctx;
		
		return(<div className='hscroll tags'>
		{ctx.exercise_preview && ctx.exercise_preview.tags.map(i=>
			<Tag 
				isDisabled={true} 
				url={`/search/${i}`} 
				key={i}
			>{i}</Tag>
		)}
		{!ctx.exercise_preview && ctx.r_exercise.current.tags.map(i=>
			<Tag 
				url={`/search/${i}`} 
				key={i}
			>{i}</Tag>
		)}
		</div>)
}

function PopupMenue(props) {

	const ctx = props.ctx;
	const s_dspReport = useState(false);
	const s_dspSendMsg = useState(false);
	const s_render = useState(false);
	
	const states = {
		s_dspReport: s_dspReport,
		s_dspSendMsg: s_dspSendMsg,
	}
	
	ctx.c_isPopup[2]('c_isPopup', ()=>{
		s_dspReport[1](false); 
		s_dspSendMsg[1](false);
		// while not render if both false so:
		s_render[1](!s_render[0]);
	})
	
	function h_report() {
		s_dspReport[1](!s_dspReport[0]);
		s_dspSendMsg[1](false);
	}
	
	const jsx_reportText = <Link to={'/about'}>about page</Link>

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
			
			{ Boolean(window.userId[0]) && 
				<SendMessage ctx={ctx} states={states}/>
			}	
			<hr/>
			
			{Boolean(ctx.s_finLoad[0] && window.nrw && ctx.r_exercise.current.tags.length) && <>
				<TagsList ctx={ctx}/>
				<hr/>
			</>}
			
			<p 
				onClick={h_report} 
				className='report'
			>
				report
			</p>	
			
			{s_dspReport[0] && <p>
					read the &quot;contact&quot; section of the {jsx_reportText}. 
					thank you for the cooperation
			</p>}
			
		</div>	
		
	</>
		
	if(ctx.c_isPopup[0]()) {
		return (jsx) 
	} else {
		return <></>
	}
}

function BottomMenue(props) {
	
	const ctx = props.ctx;
	
	function h_popup() {
		if(!ctx.exercise_preview) {
			ctx.c_isPopup[1](!ctx.c_isPopup[0]());
		}
	}
	
	function h_like() { // user clicked like btn
		
		if(window.userId[0]) {
			
			if( ctx.c_isLike[0]() ) {
				ctx.r_likes.current-=1;
				ctx.r_btn_like_text.current = 
					`${ctx.r_likes.current}\nLikes`;
				ctx.c_isLike[1](false);
			} else {
				ctx.r_likes.current+=1;
				ctx.r_btn_like_text.current = 
					`${ctx.r_likes.current}\nLikes`;
				ctx.c_isLike[1](true);
			}
			
			sendData('fetch/like', 'POST', {
				exerciseId: ctx.r_exercise.current['exerciseId'],
				userId: window.userId[0],
			})
			
		}
	}
	
	
	return(<div className='ExercisePage_bottomMenue'>

		{/* adittional menue button (...) */}      
		<Btn 
			onClick={h_popup} 
			className={`
				bottomLeft
				${ctx.exercise_preview ? 
					'color_static_blue': 
					'color_btn_blue' 
				}
			`}
		>...</Btn>
		
		<PopupMenue ctx={ctx}/>	

		{!window.nrw &&
			<TagsList ctx={ctx}/>
		}
		
		{/* RIGHT */}
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
			{ Boolean(window.userId[0]) && !ctx.exercise_preview?
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
		
	</div>)
}


function ExercisePage(){

	const params = useParams();
	const exerciseId = parseInt(params['exerciseId']);
	const exercise_preview = useLocation().state;

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
		
		exercise_preview: exercise_preview,
	}

	if(exercise_preview) {
		
		exercise_preview['author'] = window.userId[0];
		exercise_preview['latex_dir'] = 'temp';
		
		ctx.r_exercise.current = {
		
			id          : 0,
			creationdate: '',
			rating      : [],
			tags        : [],
			
			title   	: mainText2html(exercise_preview, 'title'),
			exercise	: mainText2html(exercise_preview, 'exercise'),
			answer  	: mainText2html(exercise_preview, 'answer'),
			hints   	: mainText2html(exercise_preview, 'hints'),
			explain 	: mainText2html(exercise_preview, 'explain'),
			
		}
	}
	
	function fillTargetsInnerHtml() {
		
		const n_title = 
			document.getElementById(BTM_TARGETS.title);
		const n_exercise = 
			document.getElementById(BTM_TARGETS.exercise);
		const n_answer = 
			document.getElementById(BTM_TARGETS.answer);
		const n_hints = 
			document.getElementById(BTM_TARGETS.hints);
		const n_explain = 
			document.getElementById(BTM_TARGETS.explain);

		n_title.innerHTML = 
			`<h3>${ctx.r_exercise.current['title']}</h3>`
		n_exercise.innerHTML = 
			`<p>${ctx.r_exercise.current['exercise']}</p>`
		n_answer.innerHTML = 
			`<p>${ctx.r_exercise.current['answer']}</p>`
		n_hints.innerHTML = 
			`<p>${ctx.r_exercise.current['hints']}</p>`
		n_explain.innerHTML = 
			`<p>${ctx.r_exercise.current['explain']}</p>`
	}
	
	useEffect(()=>{
		if(!exercise_preview) {
		
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
				ctx.r_btn_like_text.current = 
					`${ctx.r_likes.current}\nLikes`;
				ctx.c_isLike[1](e['rating'].includes(window.userId[0]));

				ctx.r_exercise.current = e;
				fillTargetsInnerHtml();
				ctx.s_finLoad[1](true);
			})
			
		} else {
			
			fillTargetsInnerHtml();
			ctx.s_finLoad[1](true);

		}
		
	}, [])
	
	return(<>
		<ExerciseBody ctx={ctx}/>
		<BottomMenue ctx={ctx}/>
	</>)

}


export default ExercisePage;
