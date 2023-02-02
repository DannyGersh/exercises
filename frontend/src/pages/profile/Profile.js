import React, {useState, useEffect, useRef} from 'react'
import {useNavigate, useParams} from "react-router-dom";

import {
	sendData, 
} from '../../shared/Functions'

import './Profile.css'


import {MainWindow, WelcomeUname} from './Components.js'



function Profile() {
	
	const { userId } = useParams();
	const navigate = useNavigate();

	const ctx = {		
		s_uname: useState(null),
		r_authored: useRef(null),
		r_liked: useRef(null),
		r_messages: useRef(null),
	}
	
	useEffect(()=>{
		
		if(!parseInt(window.userId)) {
			window.alert("you need to sign in to view this page");
			navigate(-1);
		}
		if(parseInt(userId) !== parseInt(window.userId)) {
			window.alert("you can't view this page");
			navigate(-1);
		}
		
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
