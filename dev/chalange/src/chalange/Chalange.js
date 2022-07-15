import './Chalange.css'
import CSRFToken from "../shared/csrftoken";
import {useState} from 'react'
import Tag from '../shared/tag/Tag'
import BtnRound from '../shared/buttons/BtnRound'

function Chalange(props){
  
  if( process.env.NODE_ENV === 'development'){
    let chalange = {'id': 2, 'question': 'test question', 'answer': 'test answer', 'hints': 'test hints', 'author': 'test author', 'creationdate': '27-7-1996', 'title': 'test title', 'rating': ['b','c'], 'tags': ['math', 'science']};
		window.jsonData = {
			'chalange': chalange,
			'signInFailure': false,
			'isSignUp': false,
			'isAuth': true,
			'userid': 1
			}
	}
	
	const chalange = window.jsonData['chalange']
	const signInFailure = window.jsonData['signInFailure']
	const isSignUp = window.jsonData['isSignUp']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']

  // dsp = display
  
  const isLike = chalange['rating'].includes(userid); // initial like state
  const isHints = (chalange['hints']);

  const [dspLike, setDspLike] = useState(isLike);
  const [addToLikes, setAddToLikes] = useState(0); // add 1 likes (without database intervension)
  const [dspHints, setDspHints] = useState(false);
  const [dspAnswer, setDspAnswer] = useState(false);
  const [dspAdditionalMenue, setAdditionalMenue] = useState(false);
  const [dspReport, setDspReport] = useState(false);

  function dspLikeHandle() { 
	  if(isLike) { !dspLike ? setAddToLikes(0): setAddToLikes(-1) }
	  else { !dspLike ? setAddToLikes(1): setAddToLikes(0) };
  }
  function hintsHandle() { 
    setDspAnswer(false);
  }
  function answerHandle() { 
    setDspHints(false);
  }
  function additionalMenueHandler(){
    setAdditionalMenue(!dspAdditionalMenue);
  }
  function reportHandle(){
	  setDspReport(!dspReport)
  }
  
  
  return ( <>
    
    <h3>{chalange['question']}</h3>
    { dspAnswer && ( <>
      <hr /><h3>{chalange['answer']}</h3>
      </> ) }
    { dspHints && ( <>
      <hr /><h3>{chalange['hints']}</h3>
      </> ) }
      
      
    <div className='bottomRight'>
    
      <iframe title='dummyframe' name="dummyframe" id="dummyframe" style={{"display": "none"}}></iframe>
      <form action="/poop/" target="dummyframe" method='POST'>
        <CSRFToken />
        <input type="hidden" name="chalangeId" value={chalange['id']}/>
        <input type="hidden" name="like" value={dspLike}/>
        <input type="hidden" name="user" value={userid}/>
		
        <BtnRound state={[dspLike,setDspLike]} onClick={dspLikeHandle} type="submit" active={true}>
          {chalange['rating'].length+addToLikes}<br/>Like
        </BtnRound>

        { isHints &&
          <BtnRound state={[dspHints, setDspHints]} onClick={hintsHandle}>
            Hints
          </BtnRound>
        }

        <BtnRound state={[dspAnswer, setDspAnswer]} onClick={answerHandle}>
          Answer
        </BtnRound>
		
      </form>
    </div>

    
    <div className="bottomLeft">
        
      <button onClick={additionalMenueHandler} className='additional'>...</button>
      
      { dspAdditionalMenue && <>
        <div className='additionalArrow'></div>
        <div className='additionalMenue'>
          
          Created by <a href='/test/'>{chalange['author']}</a> <br/> {chalange['creationdate']}  <br/>
          { props.narrowWindow &&
            chalange['tags'].map(i => <Tag url={'../browse/'+i} key={i}>{i}</Tag>)
          }
          <hr/>
          <p onClick={reportHandle} className='report'>report</p>
          
          { dspReport && 
            <p style={{fontSize: '1rem'}}>Send an email to testEmail@gmail.com with a link to this page and the reason you whant to report this page.</p>
          }
          
        </div>
      </> }

      <div className='vscroll'>
      { !props.narrowWindow && 
        chalange['tags'].map(i => <Tag url={'../browse/'+i} key={i*2}>{i}</Tag>)
      }
      </div>          

    </div>
    
  </> )
}
export default Chalange;