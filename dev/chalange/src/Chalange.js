import './shared/styles.css'
import './App.css'
import CSRFToken from "./shared/csrftoken";
import {useState} from 'react'
import Tag from './shared/tag.js'

function Chalange(props){
  
  //window.jsonData = {'id': 2, 'author': 'danny','question': 'wazzza?', 'answer': 'all good bro', 'hints': 'hint', 'tags': 'tag1,tag2,tag3', 'rating': 'a,b,c,d,', 'creationdate': '2022-06-30T19:08:42.793'}
  let author = window.jsonData['author'];
  let uid = 'a'
  //console.log('poooooop', window.jsonData);
  
  let tags = Array(10).fill(0).map((e, i) => 'tag'+String(i));

  //let tags = window.jsonData['tags'].split(',');

  let [dspAdditionalMenue, setAdditionalMenue] = useState(false);
  function additionalMenueHandler(){
    setAdditionalMenue(!dspAdditionalMenue);
  }

  let isLike = window.jsonData['rating'].search(RegExp(',?'+uid+',')) !== -1;
  let [dspLike, setDspLike] = useState(isLike);
  function dspLikeHandle() { 
    setDspLike(!dspLike);
  }

  let [isHints, setIsHints] = useState(window.jsonData['hints'] !== "");
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
            <><button type="submit" onClick={dspLikeHandle} className='btn2on'>Like</button></>:
            <><button type="submit" onClick={dspLikeHandle} className='btn2'>Like</button></>
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
              Created by <a href=''>{window.jsonData['author']}</a> <br/> {window.jsonData['creationdate']}  <br/>
              { props.narrowWindow &&
                tags.map(i => <Tag key={i}>{i}</Tag>)
              }
              <hr/>
              <p onClick={reportHandle} className='report'>report</p>
			  { dspReport && <p style={{fontSize: '0.7rem'}}>Send an email to testEmail@gmail.com with a link to this page and the reason you whant to report this page.</p>}
            </div>
            </>
            }

          <div className='vscroll'>
          { !props.narrowWindow && 
            tags.map(i => <Tag key={i*2}>{i}</Tag>)
          }
          </div>          

        </div>
      } 
    </>
  )
}
export default Chalange;