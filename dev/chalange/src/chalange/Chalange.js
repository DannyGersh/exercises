import './Chalange.css'
import CSRFToken from "../shared/csrftoken";
import {useState} from 'react'
import Tag from '../shared/tag/Tag'

function Chalange(props){
    
  //window.jsonData = {'id': 2, 'question': 'test question', 'answer': 'test answer', 'hints': 'test hints', 'author': 'test author', 'creationdate': '27-7-1996', 'title': 'test title', 'rating': ['b','c'], 'tags': ['math', 'science']};

  let uid = 'a'
  //console.log('poooooop', window.jsonData);
  
  // dsp = display
  let [dspAdditionalMenue, setAdditionalMenue] = useState(false);
  function additionalMenueHandler(){
    setAdditionalMenue(!dspAdditionalMenue);
  }

  let isLike = window.jsonData['rating'].includes(uid); // initial like state
  let [dspLike, setDspLike] = useState(isLike);
  let [addToLikes, setAddToLikes] = useState(0); // add 1 likes (without database intervension)
  function dspLikeHandle() { 
    setDspLike(!dspLike);
	if(isLike) { !dspLike ? setAddToLikes(0): setAddToLikes(-1) }
	else { !dspLike ? setAddToLikes(1): setAddToLikes(0) };
  }

  let isHints = (window.jsonData['hints'] !== "");
  let [dspHints, setDspHints] = useState(false);
  let [dspAnswer, setDspAnswer] = useState(false);

  function dspAnswerHandle() { 
    setDspAnswer(!dspAnswer);
    setDspHints(false);
  }
  function dspHintsHandle() { 
    setDspHints(!dspHints);
    setDspAnswer(false);
  }
  
  let [dspReport, setDspReport] = useState(false);
  function reportHandle(){
	setDspReport(!dspReport)
  }

  return (
    <>
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

          { dspLike ? 
            <><button type="submit" onClick={dspLikeHandle} className='btn2on'>{window.jsonData['rating'].length+addToLikes}<br/>Like</button></>:
            <><button type="submit" onClick={dspLikeHandle} className='btn2'>{window.jsonData['rating'].length+addToLikes}<br/>Like</button></>
          }
          { isHints && (dspHints ? 
            <><button onClick={dspHintsHandle} className='btn2on'>Hints</button></>:
            <><button onClick={dspHintsHandle} className='btn2'>Hints</button></>)
          }
          { dspAnswer ? 
            <><button onClick={dspAnswerHandle} className='btn2on'>Answer</button></>:
            <><button onClick={dspAnswerHandle} className='btn2'>Answer</button></>
          } 
        </form>

      </div>

      
      {
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
			  { dspReport && <p style={{fontSize: '1rem'}}>Send an email to testEmail@gmail.com with a link to this page and the reason you whant to report this page.</p>}
            </div>
            </>
            }

          <div className='vscroll'>
          { !props.narrowWindow && 
            window.jsonData['tags'].map(i => <Tag url={'../browse/'+i} key={i*2}>{i}</Tag>)
          }
          </div>          

        </div>
      } 
    </>
  )
}
export default Chalange;