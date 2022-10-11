import Exercise from '../shared/exercise/Exercise'
import BtnMenue from '../shared/buttons/BtnMenue'
import {sendData} from '../shared/Functions'
import {useState, useRef, useEffect} from 'react'
import './User.css'
import Card from '../shared/card/Card'


function Message(props) {

	// User.js is the only place this component is used

    // props:
    // messageId (int)
    // chalangeId (int)
    // creationDate (str)
    // sender (int)
    // message (str)
    // messages (react state - array of messages)

    function deleteMessage() {
    	
    	if(!window.confirm('Are you sure you want do delete this message ?')) {
    		return false;
    	}
		
    	sendData('deleteMessage', {'messageId': props.messageId})
    	.then((data)=>{
    		
    		if(!data['error']) {
    			// success
    			let temp = props.messages[0];
    			temp = temp.filter(e=>e[0]!=props.messageId);
    			props.messages[1](temp);
    		}

    	})
    }

	return(
	<Card 
		isRedirect={false} 
		className={`message ${props.className}`}
		style={props.style}
	>

	{/*card children*/}
	<div className='messageBody'>
		<p>
		{props.children}
		<br/><br/>
		{props.sender} - {props.creationDate} - <a href={'/'+props.chalangeId}>view exercise</a>
		</p>
	</div>
	<BtnMenue onClick={deleteMessage} style={{height:'2rem'}}>X</BtnMenue>
	
	</Card>
	)

}

function User(){
	const authored = window.jsonData['data'][0];
	const liked = window.jsonData['data'][1];
	const userName = window.jsonData['data'][2];

	let messages = useState([]);
	useEffect(()=>{
		// only load messages once
		// from server data, on window load.	
		messages[1](window.jsonData['messages']);
	},[])

	// menueSelection[0] must be one of tabs:
	const tabs = ['Authored', 'Liked', 'Messages'];
	const menueSelection = useState("Authored");
	function menueHandle(event, selection){
		menueSelection[1](selection);
	}
  
	const ref_menueTabs = useRef();
	const ref_mainBody = useRef();
  
	function onNavDropDown(){
		if(ref_menueTabs.current) {
			let q = ref_menueTabs.current.offsetTop + ref_menueTabs.current.offsetHeight;
			ref_mainBody.current.style.top = String(q)+"px";
		}
	}
	useEffect(() => {
		onNavDropDown();
	}, [menueSelection[0]])
  	useEffect(()=>{
  		window.addEventListener("navDropDown", onNavDropDown)
  	},[])

	function selectMenue(selection){
		if (selection==="Liked") {
			return liked;
		} else if (selection==="Authored") {
			return authored;
		} else {
			return null; 
		}
	}

	return( <>		
	
	{/* greeting */}
	<h3 style={{'padding': '0rem 0rem 0rem 1rem'}}>welcome {userName}</h3>
		
	{/* menue tabs (buttons) */}	
	<div ref={ref_menueTabs} style={{'padding': '0rem 0rem 0rem 0.3rem'}}>
		
		<BtnMenue 
			className={`menueTabs ${menueSelection[0]==='Authored' && 'green'}`} 
			onClick={(e)=>menueHandle(e,"Authored")}
		>
		Authored
		</BtnMenue>		

		<BtnMenue 
			className={`menueTabs ${menueSelection[0]==='Liked' && 'green'}`} 
			onClick={(e)=>menueHandle(e,"Liked")}
		>
		Liked
		</BtnMenue>
		
		<BtnMenue 
			className={`menueTabs ${menueSelection[0]==='Messages' && 'green'}`} 
			onClick={(e)=>menueHandle(e,"Messages")}
		>
		Messages
		
		{ messages[0].length !== 0 &&
			<div className='messagesDot'/>
		}

		</BtnMenue>
	</div>
	
	{/* main body */}	
	<div 
		ref={ref_mainBody} 
		className="hscroll scrollStyle ${menueSelection[0]===tabs[2] && gridContainer}"
	>
	
	{ tabs.slice(0,2).includes(menueSelection[0]) && 
		selectMenue(menueSelection[0]).map( (item, index) =>
			<Exercise
				narrowWindow={window.nrw}
				userId={window.jsonData['userid']}
				key={index}
				identifier={index}
				url={'/' + item['id']} 
				chalange={item}
				isOptions={menueSelection[0]===tabs[0] ? true : false}
				forceRenderDummyState={menueSelection}
			/>
		)
	}
	
	{ menueSelection[0] === tabs[2] &&
		
		messages[0].map((e,i) => 
			<Message 
				key={i}
				messages={messages}
				messageId={e[0]}
				chalangeId={e[1]} 
				creationDate={e[2]}
				sender={e[3]}
				>
			{e[4]}
			</Message>
		)
	}

	</div>
	
	
	</> )
}
export default User;

