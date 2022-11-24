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

	const likes = useRef(ctx.r_exercise.current['rating'].length);
	const r_btn_like_text = useRef(`${likes.current}\nLikes`)

	function h_like() { // user clicked like btn
		
		if(window.userId[0]) {
			
			if( ctx.c_isLike[0]() ) {
				likes.current-=1;
				r_btn_like_text.current = `${likes.current}\nLikes`;
				ctx.c_isLike[1](false);
			} else {
				likes.current+=1;
				r_btn_like_text.current = `${likes.current}\nLikes`;
				ctx.c_isLike[1](true);
			}
			
			/*
			sendData('fetch/like', 'POST', {
				exerciseId: ctx.exercise['id'],
				userId: window.userId[0]
			})
			*/
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
					r_text={r_btn_like_text}
					onClick={h_like}
				/>
				: 
				<BtnOnOf 
					className='btnRound'
					r_text={r_btn_like_text}
				/>
			}
					
		</div>

	)

}

function SendMessage(props) {

	const ctx = props.ctx;
	const dspSendMsg = useState(false);
	
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
		  <textarea id='sendMessage' rows='4' type='textarea'/>
		  <br/>
		  <button onClick={()=>{}}>Send</button>
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
	})
	
	const jsx = <>	
		
		{/* what makes the popup look like a talking buble */}
		<div className='additionalArrow'/>	
		
		{/* main popup */}
		<div className='additionalMenue'>	
	
			<p>
				Created by 
				{ctx.r_exercise.current['author']} 
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

	let { exerciseId } = useParams();

	const ctx = {
		
		s_finLoad: useState(false),
		
		c_hae:		useController([null, BTM_TARGETS.exercise]),
		c_isLike:	useController(null),
		c_isPopup:	useController(false),
		
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
		sendData(
			'fetch/exercisePage', 
			'POST', 
			{'exerciseId':exerciseId}
		)
		.then(e=>{ // e == exercise

			e['title'] = mainText2html(e, 'title');
			e['exercise'] = mainText2html(e, 'exercise');
			e['answer'] = mainText2html(e, 'answer');
			e['hints'] = mainText2html(e, 'hints');
			e['explain'] = mainText2html(e, 'explain');
			
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
			ctx.s_finLoad[1](!ctx.s_finLoad[0]);
		
		})
	},[])
	
/*
	const a = {

		// server data
		chalange 	: window.jsonData.chalange,
		userid		: window.jsonData.userid,

	// states
		dspLike 						: useState(window.jsonData.chalange.rating.includes(window.jsonData.userid)),
		likes								: useState(0),
		dspHints						: useState(false),
		dspAnswer						: useState(false),
		dspAdditionalMenue	: useState(false),
		dspReport						: useState(false),
	dspExplain					: useState(false),
	dspSendMessage			: useState(false),
	dspHae							: useState('Exercise'), // Hinst, Anser, Explain. default - Exercise

	// functions and handles:

	sendMessage: ()=> {

			if(a.isAuth) {
				let message = document.getElementById('sendMessage').value;
				
				if(message.length > 800) {
				window.alert('over 800 characters not allowed.');
				return;
			}
			if(message.length < 5) {
				window.alert('less then 5 characters not allowed.');
				return;
			}

				sendData('message2user', {
					chalangeId: a.chalange['id'],
					sender: a.userid,
					receiver: window.jsonData['chalange']['author'],
					message: message
				})
				.then((data) => {
					if(!data['error']) {
						window.alert('message sent successfully.');
						a.dspSendMessage[1](false);
						a.dspReport[1](false);
						a.dspAdditionalMenue[1](false);
					}
				});
			}
		},
		likeHandle: ()=> { 
			
			// determine like number
			a.dspLike[0] ? a.likes[1](a.likes[0]-1) : a.likes[1](a.likes[0]+1);
			
			// send like
			if(a.isAuth && !window.is_debug) {
				sendData('like', {
					chalangeId: a.chalange['id'],
					user: a.userid
				})
			}
		},
		additionalMenueHandler: ()=> {
		a.dspAdditionalMenue[1](!a.dspAdditionalMenue[0]);
		},
		sendMessageHandle: ()=> {
			a.dspSendMessage[1](!a.dspSendMessage[0]);
			a.dspReport[1](false)
		},
		reportHandle: ()=> {
			a.dspSendMessage[1](false);
			a.dspReport[1](!a.dspReport[0])
		},
		haeHandle: (target)=> {
			if(a.dspHae[0] === target) {
				a.dspHae[1]('Exercise')
			} else {
				a.dspHae[1](target)
			}
		}

	}
*/
	
	return(<MainBodie ctx={ctx}/>)

}


export default ExercisePage;
