import './Chalange.css'
import CSRFToken from "../shared/csrftoken";
import {useState, useEffect} from 'react'
import Tag from '../shared/tag/Tag'
import BtnRound from '../shared/buttons/BtnRound'
import {mainText2html} from '../shared/Functions'

function Chalange(props){
  
	const chalange = window.jsonData['chalange']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
	
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
	
  const isLike = chalange['rating'].includes(userid); // initial like state
  const isHints = chalange['hints'];
	const isExplain = chalange['explain'];
	
	// dsp = display

  const [dspLike, setDspLike] = useState(isLike);
  const [addToLikes, setAddToLikes] = useState(0); // add 1 likes (without database intervension)
  const [dspHints, setDspHints] = useState(false);
  const [dspAnswer, setDspAnswer] = useState(false);
  const [dspAdditionalMenue, setAdditionalMenue] = useState(false);
  const [dspReport, setDspReport] = useState(false);
	const [dspExplain, setDspExplain] = useState(false);
	
	// latex
	let identifier_latex = chalange['latex'];
	let formFile_latex = chalange['list_latex'];

	const htmlTitle = '<h4>'+mainText2html(identifier_latex, chalange, formFile_latex, 'title')+'</h4>';
	const htmlExercise = '<p>'+mainText2html(identifier_latex, chalange, formFile_latex, 'exercise')+'</p>';
	const htmlAnswer = '<p>'+mainText2html(identifier_latex, chalange, formFile_latex, 'answer')+'</p>';
	const htmlExplain = '<p>'+mainText2html(identifier_latex, chalange, formFile_latex, 'explain')+'</p>';
	const htmlHints = '<p>'+mainText2html(identifier_latex, chalange, formFile_latex, 'hints')+'</p>';

	useEffect(()=>{
		document.getElementById('title').innerHTML = htmlTitle;
		document.getElementById('exercise').innerHTML = htmlExercise;
	},[htmlTitle, htmlExercise])
	
	// end_latex

  function dspLikeHandle() { 
	  if(isLike) { !dspLike ? setAddToLikes(0): setAddToLikes(-1) }
	  else { !dspLike ? setAddToLikes(1): setAddToLikes(0) };
  }
  function hintsHandle() { 
    setDspAnswer(false);
		setDspExplain(false);
  }
  function answerHandle() { 
    setDspHints(false);
		setDspExplain(false);
	}
	function explainHandle() {
		setDspExplain(!dspExplain);
		setDspHints(false);
		setDspAnswer(false);
	}
  function additionalMenueHandler(){
    setAdditionalMenue(!dspAdditionalMenue);
  }
  function reportHandle(){
	  setDspReport(!dspReport)
  }
  
	useEffect(()=>{
		if(dspAnswer) {
			document.getElementById('answer').innerHTML = htmlAnswer;
		}
	},[htmlAnswer, dspAnswer])
	
	useEffect(()=>{
		if(dspHints) {
			document.getElementById('hints').innerHTML = htmlHints;
		}
	},[htmlHints, dspHints])
	
	useEffect(()=>{
		if(dspExplain) {
			document.getElementById('explain').innerHTML = htmlExplain;
		} else {
			document.getElementById('title').innerHTML = htmlTitle;
			document.getElementById('exercise').innerHTML = htmlExercise;
		}
	},[htmlExplain, htmlTitle, htmlExercise, dspExplain])
	
  return ( 
	<div style={{paddingLeft: '1rem'}}>
	
		<div className='hscroll' style={{height:'calc(100vh - 6rem)'}}>
		{ ! dspExplain ?
		<>
			<div id='title' style={{whiteSpace: 'break-spaces'}}></div>
			<div id='exercise' style={{whiteSpace: 'break-spaces'}}></div>
			{ dspAnswer && ( <>
				<hr />
				<div id='answer' style={{whiteSpace: 'break-spaces'}}></div>
				</> ) }
			{ dspHints && ( <>
				<hr/>
				<div id='hints' style={{whiteSpace: 'break-spaces'}}></div>
				</> ) }
		</>
		:
		<>
			<div id='explain' style={{whiteSpace: 'break-spaces'}}></div>
		</>
		}  
		</div>
		
    <div className='bottomRight'>
    
      <iframe title='dummyframe' name="dummyframe" id="dummyframe" style={{"display": "none"}}></iframe>
      <form action="/like/" target="dummyframe" method='POST'>
        <CSRFToken />
        <input type="hidden" name="chalangeId" value={chalange['id']}/>
        <input type="hidden" name="like" value={dspLike}/>
        <input type="hidden" name="user" value={userid}/>
		
				{ isAuth ?
        <BtnRound state={[dspLike,setDspLike]} onClick={dspLikeHandle} type="submit" active={true}>
          {chalange['rating'].length+addToLikes}<br/>Like
        </BtnRound>
				:
				<BtnRound>{chalange['rating'].length}<br/>Like</BtnRound>
				}
				
        { isHints &&
          <BtnRound state={[dspHints, setDspHints]} onClick={hintsHandle}>
            Hints
          </BtnRound>
        }

        <BtnRound state={[dspAnswer, setDspAnswer]} onClick={answerHandle}>
          Answer
        </BtnRound>
				
				{ isExplain &&
					<BtnRound state={[dspExplain, setDspExplain]} onClick={explainHandle}>
						Explain
					</BtnRound>
				}
		
      </form>
    </div>

    
    <div className="bottomLeft">
        
      <button onClick={additionalMenueHandler} className='additional'>...</button>
      
      { dspAdditionalMenue && <>
        <div className='additionalArrow'></div>
        <div className='additionalMenue'>
          
          Created by {chalange['authorName']} <br/> {chalange['creationdate']}  <br/>
          { props.narrowWindow &&
            chalange['tags'].map(i => <Tag url={'../browse/'+i} key={i}>{i}</Tag>)
          }
          <hr/>
          <p onClick={reportHandle} className='report'>report</p>
          
          { dspReport && 
            <p style={{fontSize: '1rem'}}>see <a href='/contact/'>contact page</a></p>
          }
          
        </div>
      </> }

      <div className='vscroll'>
      { !props.narrowWindow && 
        chalange['tags'].map((e, i) => <Tag url={'/browse/'+e} key={i}>{e}</Tag>)
      }
      </div>          

    </div>

  </div> 
	)
}
export default Chalange;
