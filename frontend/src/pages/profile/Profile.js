import {useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router-dom'
import {sendData, useController, uploadError} from '../../shared/Functions'
import Card from '../../shared/card/Card'
import {Btn} from '../../shared/buttons/BtnOnOf'
import BtnMenue from '../../shared/buttons/BtnMenue'
import ExerciseCard from '../../shared/exerciseCard/ExerciseCard'
import './Profile.css'
import { Link } from "react-router-dom";

const TABS = {
	authored: 'authored',
	liked: 'liked',
	messages: 'messages',
}


function Message(props) {

    const ctx = props.ctx;
    const msg = props.message;
    const r_messages = ctx.r_messages;
    const s_render = props.s_render;
    
    function h_delete_message() {
    	
    	if(!window.confirm('Are you sure you want do delete this message ?')) {
    		return false;
    	}

    	sendData('fetch/deleteMsg', 'POST', {
			'msgId': msg['msgId']
		})

		if(r_messages.current) {
			const index = r_messages.current.indexOf(msg);
			r_messages.current.splice(index, 1);
			s_render[1](!s_render[0]);
		}
    }

	return(
	<Card 
		isRedirect={false} 
		className='message'
		style={props.style}
	>

	{/*card children*/}
	<div className='messageBody'>
		<p>
		{msg['message']}
		<br/><br/>
		{msg['name_sender']} - {msg['creationDate']} - <Link to={`/exercise/${msg['exerciseId']}`}>view exercise</Link>
		</p>
	</div>

	<Btn 
		text='X'
		className='btnTab color_btn_default'
		style={{height: '2rem', borderColor: 'black'}}
		onClick={()=>{h_delete_message()}}
	/>
	
	</Card>
	)

}

function WelcomeUname(props) {
	
	const s_uname = props.ctx.s_uname;
	
	const style = {'paddingLeft': '1rem'};

	return(
		<h3 style={style}>
			welcome {s_uname[0]}
		</h3>
	)
}

function Tabs(props) {
	
	const ctx = props.ctx;
	const s_tab = props.s_tab;
	
	function genClassName(target) {
		const condition = s_tab[0] === target;
		return `
			btnTab 
			${condition ? 'color_btn_green' : 'color_btn_default'}
		`
	}

	let isDspMsgDot = ctx.r_messages.current;
	if(isDspMsgDot) {
		const count_msg = ctx.r_messages.current.length;
		if(!count_msg) { 
			isDspMsgDot = false;
		} else {
			isDspMsgDot = true;
		}
	}
	
	return(
	<div className='tab-container'>
	
		<Btn 
			text={TABS.authored}
			className={genClassName(TABS.authored)} 
			onClick={()=>s_tab[1](TABS.authored)}
		/>
		
		<Btn 
			text={TABS.liked}
			className={genClassName(TABS.liked)} 
			onClick={()=>s_tab[1](TABS.liked)}
		/>
		
		<Btn 
			text={TABS.messages}
			className={genClassName(TABS.messages)} 
			onClick={()=>s_tab[1](TABS.messages)}
		/>
		
		{isDspMsgDot && 
			<div className='messagesDot'/>
		}	
		
	</div>
	)
}

function ClientWindow(props) {
	
	const ctx = props.ctx;
	const s_tab = props.s_tab;
	const s_render = props.s_render;
	
	function h_delete(exercise) {
		
		let temp = ctx.r_authored.current;
		if(temp) {
			ctx.r_authored.current = temp.filter(item=>
				exercise['id'] !== item['id']
			);
		}
		
		temp = ctx.r_liked.current;
		if(temp) {
			ctx.r_liked.current = temp.filter(item=>
				exercise['id'] !== item['id']
			);
		}
		
		s_render[1](!s_render[0]);
	}

	const isRender = {
		authored: (
			ctx.r_authored.current != null && 
			s_tab[0] === TABS.authored
		),
		liked: (
			ctx.r_liked.current != null && 
			s_tab[0] === TABS.liked
		),
		messages: (
			ctx.r_messages.current != null && 
			s_tab[0] === TABS.messages
		),
	}

	return(
	<center className='display'>
	
	{ isRender.authored && ctx.r_authored.current.map((item, index)=>
		<ExerciseCard
			userId={window.userId[0]}
			narrowWindow={false}
			key={index}
			url={`/exercise/${item['id']}`} 
			exercise={item}
			isOptions={true}
			onDelete={h_delete}
			renderOnChange={s_render}
		/>
	)}
	
	{ isRender.liked && ctx.r_liked.current.map((item, index)=>
		<ExerciseCard
			userId={window.userId[0]}
			narrowWindow={false}
			key={index}
			url={`/exercise/${item['id']}`} 
			exercise={item}
			isOptions={false}
			renderOnChange={s_render}
		/>
	)}
	
	{ isRender.messages && ctx.r_messages.current.map((item, index)=>
		<Message 
			ctx={ctx} 
			key={index} 
			message={item}
			s_render={s_render}
		/>
	)}
	
	</center>
	)
}

function MainWindow(props) {
	
	const s_tab = useState(TABS.authored);
	const s_render = useState(false);
	
	return (<>
		<Tabs ctx={props.ctx} s_tab={s_tab}/>
		<ClientWindow ctx={props.ctx} s_tab={s_tab} s_render={s_render}/>
	</>)
	
}


function Profile() {
	
	const { userId } = useParams();
	
	const ctx = {		
		s_uname: useState(null),
		r_authored: useRef(null),
		r_liked: useRef(null),
		r_messages: useRef(null),
	}
	
	useEffect(()=>{
		
		sendData('fetch/profile', 'POST', {
			'userId': parseInt(userId),
		})
		.then(data=>{
			ctx.r_authored.current = data['authored'];
			ctx.r_liked.current = data['liked'];
			ctx.r_messages.current = data['messages'];
			ctx.s_uname[1](data['uname']);
		})
		
	},[])
	
	return(<>
		<WelcomeUname ctx={ctx}/>
		<MainWindow ctx={ctx}/>
	</>)
}
export default Profile;
