import './Chalange.css'
import CSRFToken from "../shared/csrftoken";
import {useState, useEffect} from 'react'
import Tag from '../shared/tag/Tag'
import BtnRound from '../shared/buttons/BtnRound'

function Chalange(props){
  
	const chalange = window.jsonData['chalange']
	const signInFailure = window.jsonData['signInFailure']
	const isSignUp = window.jsonData['isSignUp']
	const isAuth = window.jsonData['isAuth']
  const userid = window.jsonData['userid']
	
	// PERROR
	let errorStr = 'cant find the following: \n';
	let isError = false;
	if(!chalange['title'] || !chalange['question'] || !chalange['answer'] || !chalange['rating']) {
		
		isError = true;
		
		function castumErr(str) {
			if(!chalange[str]) {
				chalange[str] = '';
				errorStr += '* ' + str + '\n';
			}
		}
		castumErr('title');
		castumErr('question');
		castumErr('answer');
		castumErr('rating');
		castumErr('author');
		castumErr('creationdate');
	}
			
	useEffect( () => {
		isError && window.alert(errorStr);
	}, [])
	
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
	let dir_latex		= chalange['latex'];
	let list_latex	= chalange['list_latex'];

	function mainText2html(target) {
		
		/*TODO - fix workaround
			this is a huge workeround.
			the problem being worked around is realy wide spred
			and hard to fix.
			the problem:
			the target exercise is defind as 'exercise'
			in targets, but is defined as 'question'
			in the database at table chalanges.
			e.g. chalanges allso needs renaming.
		*/
		let workeround = target;
		if(target==='exercise') {
			workeround = 'question';
		}
		
		// TODO - add database of errors and add this to it if cant load latex
		const reg_latex = /(\$\$___latex\$\$|___ERROR___)/
		let textList = chalange[workeround].split(reg_latex)
		textList = textList.filter(i=>i!=='')
		
		let index = 0;
		for(let i=0 ; i<textList.length ; i++) {
			if(textList[i] === '$$___latex$$') {
				
				try {
					const tempLatex = list_latex[target][index][1]; // TODO - workeround here, needs fixin 
					const tempId = chalange['authid'];
					const tempPath = ['/static/users', tempId, dir_latex, tempLatex+'.svg'].join('/')
					textList[i] = '<img src="'+tempPath+'" />'
				}
				catch{
					throw new Error('probably index out of range ...( list_latex[target][index][?] ) ');
				}
				index++;
			}
		}
		return textList.join('');
	}

	const htmlTitle = '<h4>'+mainText2html('title')+'</h4>';
	const htmlExercise = '<p>'+mainText2html('exercise')+'</p>';
	const htmlAnswer = '<p>'+mainText2html('answer')+'</p>';
	const htmlExplain = '<p>'+mainText2html('explain')+'</p>';
	const htmlHints = '<p>'+mainText2html('hints')+'</p>';

	useEffect(()=>{
		document.getElementById('title').innerHTML = htmlTitle;
		document.getElementById('exercise').innerHTML = htmlExercise;
	},[])
	
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
	},[dspAnswer])
	
	useEffect(()=>{
		if(dspHints) {
			document.getElementById('hints').innerHTML = htmlHints;
		}
	},[dspHints])
	
	useEffect(()=>{
		if(dspExplain) {
			document.getElementById('explain').innerHTML = htmlExplain;
		} else {
			document.getElementById('title').innerHTML = htmlTitle;
			document.getElementById('exercise').innerHTML = htmlExercise;
		}
	},[dspExplain])
	
  return ( 
	<div style={{paddingLeft: '1rem'}}>
	
		{ ! dspExplain ?
		<>
			<div id='title'></div>
			<p id='exercise'></p>
			{ dspAnswer && ( <>
				<hr />
				<p id='answer'></p>
				</> ) }
			{ dspHints && ( <>
				<hr/>
				<p id='hints'></p>
				</> ) }
		</>:
			<p id='explain'></p>
		}  
	
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

  </div> 
	)
}
export default Chalange;
