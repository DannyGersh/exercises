import './Chalange.css'
import CSRFToken from "../shared/csrftoken";
import {useState} from 'react'
import Tag from '../shared/tag/Tag'
import BtnRound from '../shared/buttons/BtnRound'

function Chalange(props){
  
  if( process.env.NODE_ENV === 'development'){
    window.jsonData = {'id': 2, 'question': 'test question', 'answer': 'test answer', 'hints': 'test hints', 'author': 'test author', 'creationdate': '27-7-1996', 'title': 'test title', 'rating': ['b','c'], 'tags': ['math', 'science']};
  }
  
  let uid = 'a'
  //console.log('poooooop', window.jsonData);
  
  // dsp = display
  
  const isLike = window.jsonData['rating'].includes(uid); // initial like state
  const isHints = (window.jsonData['hints']);

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
    
    <h3>{window.jsonData['question']}</h3>
    { dspAnswer && ( <>
      <hr /><h3>{window.jsonData['answer']}</h3>
      </> ) }
    { dspHints && ( <>
      <hr /><h3>{window.jsonData['hints']}</h3>
      </> ) }
      
      
    <div className='bottomRight'>
    
      <iframe title='dummyframe' name="dummyframe" id="dummyframe" style={{"display": "none"}}></iframe>
      <form action="/poop/" target="dummyframe" method='POST'>
        <CSRFToken />
        <input type="hidden" name="chalangeId" value={window.jsonData['id']}/>
        <input type="hidden" name="like" value={dspLike}/>
        <input type="hidden" name="user" value={uid}/>
		
        <BtnRound state={[dspLike,setDspLike]} onClick={dspLikeHandle} type="submit" active={true}>
          {window.jsonData['rating'].length+addToLikes}<br/>Like
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
          
          Created by <a href='/test/'>{window.jsonData['author']}</a> <br/> {window.jsonData['creationdate']}  <br/>
          { props.narrowWindow &&
            window.jsonData['tags'].map(i => <Tag url={'../browse/'+i} key={i}>{i}</Tag>)
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
        window.jsonData['tags'].map(i => <Tag url={'../browse/'+i} key={i*2}>{i}</Tag>)
      }
      </div>          

    </div>
    
  </> )
}
export default Chalange;