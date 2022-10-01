import './Chalange.css'
import {useState, useEffect} from 'react'
import Tag from '../shared/tag/Tag'
import BtnRound from '../shared/buttons/BtnRound'
import {sendData, mainText2html} from '../shared/Functions'

function Chalange(props){
  
  // data from server
  // TODO - create structures.txt
  // see structures.txt at root for a structure blueprint of the following:
	const chalange = window.jsonData['chalange'];
	const isAuth = window.jsonData['isAuth'];
  const userid = window.jsonData['userid'];
  const isHints = chalange['hints'];
	const isExplain = chalange['explain'];
  const isLike = chalange['rating'].includes(userid);

	// PERROR
	
	let errorStr = 'cant find the following: \n';
	let isError = false;
	
	if(!chalange['title'] || !chalange['answer'] || !chalange['rating']) {
		
		isError = true;
		
		function castumErr(str) {
			if(!chalange[str]) {
				chalange[str] = '';
				errorStr += '* ' + str + '\n';
			}
		}
		castumErr('title');
		castumErr('answer');
		castumErr('rating');
		castumErr('author');
		castumErr('creationdate');
	}
			
	useEffect( () => {
		isError && window.alert(errorStr);
	}, [errorStr, isError])
	
	// END_PERROR

	// states - dsp = display
  const dspLike = useState(isLike);
  const addToLikes = useState(0); // add 1 likes (without database intervension)
  const dspHints = useState(false);
  const dspAnswer = useState(false);
  const dspAdditionalMenue = useState(false);
  const dspReport = useState(false);
	const dspExplain = useState(false);
	const dspSendMessage = useState(false);


	// latex

	// get server data
	let identifier_latex = chalange['latex'];
	let fromFile_latex = chalange['list_latex'];

	// normal text + latex combination
	const htmlTitle = '<h4>'+mainText2html(identifier_latex, chalange, fromFile_latex, 'title')+'</h4>';
	const htmlExercise = '<p>'+mainText2html(identifier_latex, chalange, fromFile_latex, 'exercise')+'</p>';
	const htmlAnswer = '<p>'+mainText2html(identifier_latex, chalange, fromFile_latex, 'answer')+'</p>';
	const htmlExplain = '<p>'+mainText2html(identifier_latex, chalange, fromFile_latex, 'explain')+'</p>';
	const htmlHints = '<p>'+mainText2html(identifier_latex, chalange, fromFile_latex, 'hints')+'</p>';

	useEffect(()=>{
		document.getElementById('title').innerHTML = htmlTitle;
		document.getElementById('exercise').innerHTML = htmlExercise;
	},[htmlTitle, htmlExercise])
	
	// end_latex

	function sendLike() {
  	if(isAuth) {
			sendData('like', {
				chalangeId: chalange['id'],
				like: !dspLike[0] ? 'True' : 'False', // this is a string for debbuging purposes (in the server)
				user: userid
			})
			.then((response) => response.json())
			.then((data) => {
				
				// data['result'] is 0: success
				// data['result'] is str: data['result'] is an error string
				
				if(data['result']) {
					console.log(data['result']);
					window.alert(data['result']+'\nconsider reporting at the contact page');
				}
			});
		}
  }
  function sendMessage() {

  	if(isAuth) {
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
				chalangeId: chalange['id'],
				sender: userid,
				receiver: window.jsonData['chalange']['author'],
				message: message
			})
			.then((response) => response.json())
			.then((data) => {
				
				// data['result'] is 0: success
				// data['result'] is str: data['result'] is an error string
				
				if(data['result']) {
					console.log(data['result']);
					window.alert(data['result']+'\nconsider reporting at the contact page');
				} else { //success
					window.alert('message sent successfully.');
					dspSendMessage[1](false);
					dspReport[1](false);
					dspAdditionalMenue[1](false);
				}
			});
		}
  }

  function likeHandle() { 
	  if(isLike) { !dspLike[0] ? addToLikes[1](0): addToLikes[1](-1) }
	  else { !dspLike[0] ? addToLikes[1](1): addToLikes[1](0) };
  	sendLike();
  }
  function hintsHandle() { 
    dspAnswer[1](false);
		dspExplain[1](false);
  }
  function answerHandle() { 
    dspHints[1](false);
		dspExplain[1](false);
	}
	function explainHandle() {
		dspExplain[1](!dspExplain[0]);
		dspHints[1](false);
		dspAnswer[1](false);
	}
  function additionalMenueHandler() {
    dspAdditionalMenue[1](!dspAdditionalMenue[0]);
  }
  function sendMessageHandle() {
  	dspSendMessage[1](!dspSendMessage[0]);
  	dspReport[1](false)
  }
  function reportHandle() {
  	dspSendMessage[1](false);
	  dspReport[1](!dspReport[0])
  }

	useEffect(()=>{
		if(dspAnswer[0]) {
			document.getElementById('answer').innerHTML = htmlAnswer;
		}
	},[htmlAnswer, dspAnswer])
	
	useEffect(()=>{
		if(dspHints[0]) {
			document.getElementById('hints').innerHTML = htmlHints;
		}
	},[htmlHints, dspHints])
	
	useEffect(()=>{
		if(dspExplain[0]) {
			document.getElementById('explain').innerHTML = htmlExplain;
		} else {
			document.getElementById('title').innerHTML = htmlTitle;
			document.getElementById('exercise').innerHTML = htmlExercise;
		}
	},[htmlExplain, htmlTitle, htmlExercise, dspExplain])



// ---

const jsx_exercise_body = 
<>
	<div id='title' className='textWithLatex'></div>
	<div id='exercise' className='textWithLatex'></div>
		
	{ dspAnswer[0] && ( <>
		<hr />
		<div id='answer' className='textWithLatex'></div>
		</> ) }
	{ dspHints[0] && ( <>
		<hr/>
		<div id='hints' className='textWithLatex'></div>
		</> ) }

</>

// ---

const jsx_explain_body = 
<div id='explain' style={{whiteSpace: 'break-spaces'}}/>

// ---

const jsx_bottom_right_menue = 
<div className='bottomRight'>

	{ isAuth ?
    <BtnRound state={dspLike} onClick={likeHandle} active={true}>
    	{chalange['rating'].length+addToLikes[0]}<br/>Like
    </BtnRound>
		: 
		<BtnRound onClick={sendLike}>{chalange['rating'].length}<br/>Like</BtnRound>
	}
			
  { isHints &&
    <BtnRound state={dspHints} onClick={hintsHandle}>
      Hints
    </BtnRound>
  }
  
  <BtnRound state={dspAnswer} onClick={answerHandle}>
    Answer
  </BtnRound>
			
	{ isExplain &&
		<BtnRound state={dspExplain} onClick={explainHandle}>
			Explain
		</BtnRound>
	}

</div>

// ---

const jsx_tooltip = 
<div className='tooltip'>

	<BtnRound className='info'>i</BtnRound>
	<span className="tooltiptext">
		inform the author of typos, mistakes, improvements, etc.<br/>
		the message would be sent with this exercise attached.
	</span>

</div>

// ---

const jsx_send_message = 
<>
  <hr/>
	<div style={{display: 'flex', alignItems:'center'}}>

	<p onClick={sendMessageHandle} className='sendMessage'>send message</p>

	{ jsx_tooltip }

	</div>

  { dspSendMessage[0] &&
	<>
	  <textarea id='sendMessage' rows='4' type='textarea'/>
	  <br/>
	  <button onClick={sendMessage}>Send</button>
	</>
	}

</>

// ---

const jsx_popup_menue = 
<>

  <div className='additionalArrow'/>

  <div className='additionalMenue'>

    Created by {chalange['authorName']} <br/> {chalange['creationdate']}  <br/>
    { props.narrowWindow &&
      chalange['tags'].map(i => <Tag url={'../browse/'+i} key={i}>{i}</Tag>)
    }

    { isAuth && jsx_send_message}

    <hr/>
    <p onClick={reportHandle} className='report'>report</p>

  	{ dspReport[0] && 
  	  <p style={{fontSize: '1rem'}} >
  	  	see <a href='/contact/'>contact page</a>
  	  </p>
  	}

  </div>

</>

// ---

const jsx_bottom_left_menue = 
<div className="bottomLeft">
  
	{/* adittional menue button (...) */}      
	<button onClick={additionalMenueHandler} className='additional'>...</button>

	{ dspAdditionalMenue[0] && jsx_popup_menue}

  {/* tags in wide window mode */}
  <div className='vscroll'>
  	{ !props.narrowWindow && 
    	chalange['tags'].map((e, i) => <Tag url={'/browse/'+e} key={i}>{e}</Tag>)
  	}
 	</div>          

</div>

// ---

const jsx_main = 
<div style={{paddingLeft: '1rem'}}>
			
	<div className='hscroll' style={{height:'calc(100vh - 6rem)'}}>
			
		{ dspExplain[0] ? 
			jsx_explain_body
			: jsx_exercise_body
		}

	</div>
				
	{ jsx_bottom_right_menue }

	{ jsx_bottom_left_menue }

</div>

// ---

	return(jsx_main)

}
export default Chalange;
