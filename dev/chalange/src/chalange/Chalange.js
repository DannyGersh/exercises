import MainJsx from './Chalange.jsx'
import {useState, useEffect} from 'react'
import {sendData, mainText2html} from '../shared/Functions'

// TODO - fix like

function Chalange(props){
  
  const a = {

  	// server data
  	chalange 	: window.jsonData.chalange,
		isAuth		: window.jsonData.isAuth,
  	userid		: window.jsonData.userid,
  	isHints		: window.jsonData.chalange.hints,
  	isExplain	: window.jsonData.chalange.explain,
  	isLike		: window.jsonData.chalange.rating.includes(window.jsonData.userid),
  	
  	// latex folder name in which the svgs for this exercise are stored
  	identifier_latex	: window.jsonData.chalange.latex,
		
		// json structure containing names of svgs
		fromFile_latex		: window.jsonData.chalange.list_latex,

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

  // normal text + latex combination
	const htmlTitle = '<h4>'+mainText2html(a.identifier_latex, a.chalange, a.fromFile_latex, 'title')+'</h4>';
	const htmlExercise = '<p>'+mainText2html(a.identifier_latex, a.chalange, a.fromFile_latex, 'exercise')+'</p>';
	const htmlAnswer = '<p>'+mainText2html(a.identifier_latex, a.chalange, a.fromFile_latex, 'answer')+'</p>';
	const htmlExplain = '<p>'+mainText2html(a.identifier_latex, a.chalange, a.fromFile_latex, 'explain')+'</p>';
	const htmlHints = '<p>'+mainText2html(a.identifier_latex, a.chalange, a.fromFile_latex, 'hints')+'</p>';

  // PERROR - alert missing information
	useEffect(()=>{

		let errorStr = 'cant find the following: \n';
		let isError = false;
		
		if(!a.chalange['title'] || !a.chalange['answer'] || !a.chalange['rating']) {
			
			isError = true;
			
			function castumErr(str) {
				if(!a.chalange[str]) {
					a.chalange[str] = '';
					errorStr += '* ' + str + '\n';
				}
			}
			castumErr('title');
			castumErr('answer');
			castumErr('rating');
			castumErr('author');
			castumErr('creationdate');
		}
		
		isError && window.alert(errorStr);
	},[a.chalange])

	// set text elements to initialized latex + text
	useEffect(()=>{
		document.getElementById('title').innerHTML = htmlTitle;
		document.getElementById('exercise').innerHTML = htmlExercise;
		document.getElementById('answer').innerHTML = htmlAnswer;
		document.getElementById('hints').innerHTML = htmlHints;
		document.getElementById('explain').innerHTML = htmlExplain;
	},[
		htmlTitle, 
		htmlExercise, 
		htmlAnswer,
		htmlHints,
		htmlExplain
	])

	return(<MainJsx a={a}/>)

}


export default Chalange;
