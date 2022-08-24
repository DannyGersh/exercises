import Card from '../card/Card'
import BtnRound from '../../shared/buttons/BtnRound'
import Tag from '../../shared/tag/Tag'
import './Exercise.css'
import {mainText2html} from '../../shared/Functions'
import {useEffect} from 'react'

function Exercise(props){
  
	let identifier_latex = props.chalange['latex'];
	let fromFile_latex = props.chalange['list_latex'];
	
	const htmlTitle = '<h4>'+mainText2html(identifier_latex, props.chalange, fromFile_latex, 'title')+'</h4>';
	const htmlExercise = '<p>'+mainText2html(identifier_latex, props.chalange, fromFile_latex, 'exercise')+'</p>';
	
	useEffect(()=>{
		document.getElementById('title_'+props.identifier.toString()).innerHTML = htmlTitle;
		document.getElementById('exercise_'+props.identifier.toString()).innerHTML = htmlExercise;
	},[])
	
  return(
  <>
    <Card url={props.url} style={props.style} className={props.className}>
            
			<div className='bottomRight'>
				<BtnRound>
				{props.likes}<br/>Likes
				</BtnRound>
			</div>
      
      <div id={'title_'+props.identifier.toString()}></div>
	    <div id={'exercise_'+props.identifier.toString()}></div>
			<br/><br/><br/>
      <div className="vscroll bottomLeft">
      { 
				props.tags.map((i) => 
					<Tag key={i} url={'../../../../../../../../../../browse/'+i}>{i}</Tag>
				) 
			}

      </div>
		    
    </Card>
  </>
  )
}
export default Exercise;