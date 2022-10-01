

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
