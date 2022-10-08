import './Chalange.css'
import Tag from '../shared/tag/Tag'
import BtnRound from '../shared/buttons/BtnRound'
import ToolTip from '../shared/tooltip/ToolTip'


function ExerciseBody(props) {
	
	const a = props.a;

	return(
	
	<div className='hscroll' style={{height:'calc(100vh - 7rem)'}}>

		<div 
			id='title' 
			className='textWithLatex'
			style={{visibility: a.dspHae[0]==='Exercise' ? 'visible' : 'hidden'}}
		/>
		<div 
			id='exercise' 
			className='textWithLatex' 
			ref={a.ref_exercise}
			style={{visibility: a.dspHae[0]==='Exercise' ? 'visible' : 'hidden'}}
		/>	

		<div id='answer'
			ref={a.ref_answer} 
			style={{visibility: a.dspHae[0]==='Answer' ? 'visible' : 'hidden'}}
			className='textWithLatex clientBody'
		/>	

		<div id='hints' 
			ref={a.ref_hints} 
			style={{visibility: a.dspHae[0]==='Hints' ? 'visible' : 'hidden' }}
			className='textWithLatex clientBody'
		/>

		<div id='explain' 
			ref = {a.ref_explain}
			style={{visibility: a.dspHae[0]==='Explain' ? 'visible' : 'hidden'}}
			className='textWithLatex clientBody'
		/>

	</div>
	)
}

function BottomRightMenue(props) {

	const a = props.a;

	return(

		<div className='bottomRight'>		

			{/* like btn */}
			{ a.isAuth ?
		    <BtnRound state={a.dspLike} onClick={a.likeHandle} active={true}>
		    	{a.chalange['rating'].length+a.likes[0]}<br/>Like
		    </BtnRound>
				: 
				<BtnRound onClick={a.sendLike}>{a.chalange['rating'].length}<br/>Like</BtnRound>
			}
					
		  { a.isHints &&
		    <BtnRound className={`${a.dspHae[0]==='Hints' ? 'green' : 'blue'}`} onClick={()=>a.haeHandle('Hints')}>
		      Hints
		    </BtnRound>
		  }
		  
		  <BtnRound className={`${a.dspHae[0]==='Answer' ? 'green' : 'blue'}`} onClick={()=>a.haeHandle('Answer')}>
		    Answer
		  </BtnRound>
					
			{ a.isExplain &&
				<BtnRound className={`${a.dspHae[0]==='Explain' ? 'green' : 'blue'}`} onClick={()=>a.haeHandle('Explain')}>
					Explain
				</BtnRound>
			}		

		</div>

	)
}

function SendMessage(props) {

	const a = props.a;

	return (
	<>
	  <hr/>
		<div style={{display: 'flex', alignItems:'center'}}>	

		<p onClick={a.sendMessageHandle} className='sendMessage'>send message</p>	

		<ToolTip 
			id1 = 'ToolTip1'
			id2 = 'ToolTip2'
			text = '
			inform the author of typos, mistakes, improvements, etc.
			the message would be sent with this exercise attached.
			'
		>
		<BtnRound className='info'>i</BtnRound>
		</ToolTip>	
	

		</div>	

	  { a.dspSendMessage[0] &&
		<>
		  <textarea id='sendMessage' rows='4' type='textarea'/>
		  <br/>
		  <button onClick={a.sendMessage}>Send</button>
		</>
		}	

	</>
	)
}

function PopupMenue(props) {

	const a = props.a;

	return (
	<>	

		{/* what makes the popup look like a talking buble */}
	  <div className='additionalArrow'/>	

		{/* main popup */}
	  <div className='additionalMenue'>	

	    Created by {a.chalange['authorName']} <br/> {a.chalange['creationdate']}  <br/>
	    { window.narrowWindow &&
	      a.chalange['tags'].map(i => <Tag url={'/browse/'+i} key={i}>{i}</Tag>)
	    }	

	    { a.isAuth && <SendMessage a={a}/>}	

	    <hr/>
	    <p onClick={a.reportHandle} className='report'>report</p>	

	  	{ a.dspReport[0] && 
	  	  <p style={{fontSize: '1rem'}} >
	  	  	see <a href='/contact/'>contact page</a>
	  	  </p>
	  	}	

	  </div>	

	</>
	)
}

function BottomLeftMenue(props) {

	const a = props.a;

	return (

	<div className="bottomLeft">
	  
		{/* adittional menue button (...) */}      
		<button onClick={a.additionalMenueHandler} className='additional'>...</button>	

		{ a.dspAdditionalMenue[0] && <PopupMenue a={a}/> }	

	  {/* tags in wide window mode */}
	  <div className='vscroll'>
	  	{ !window.narrowWindow && 
	    	a.chalange['tags'].map((e, i) => <Tag url={'/browse/'+e} key={i}>{e}</Tag>)
	  	}
	 	</div>          	

	</div>

	)
}

function MainJsx(props) {

	const a = props.a;

	return(

		<div style={{paddingLeft: '1rem'}}>
						
			<ExerciseBody a={a}/>
						
			<BottomRightMenue a={a}/>		

			<BottomLeftMenue a={a}/>		

		</div>

	)
}


export default MainJsx;