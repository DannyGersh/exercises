import {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {mainText2html, sendData} from '../../shared/Functions'
import {BtnTab, BtnOnOf} from '../../shared/buttons/Buttons'
import Card from '../card/Card'
import Tag from '../../shared/tag/Tag'
import './ExerciseCard.css'


function Exercise_card(props){

	const isLike = props.exercise['rating'].includes(window.userId[0]);
  
	const rawTitle = mainText2html(props.exercise, 'title');
	const rawExercise = mainText2html(props.exercise, 'exercise');
	const htmlTitle = `<h4>${rawTitle}</h4>`;
	const htmlExercise = `<p>${rawExercise}</p>`;

	const exerciseId = props.exercise['id'].toString();	
	const id_title = `title_${exerciseId}`;
	const id_exercise = `exercise_${exerciseId}`;
	
	const style_text = {
		whiteSpace: 'break-spaces', 
		overflow:'hidden',
	}
	const style_btnEditDelete = {
		marginRight:'0.5rem',
		width:'4rem', 
	}
	
	useEffect(()=>{
		const n_title = document.getElementById(id_title);
		const n_exercise = document.getElementById(id_exercise);
		n_title.innerHTML = htmlTitle;
		n_exercise.innerHTML = htmlExercise;
	},[props.renderOnChange, htmlExercise, htmlTitle, id_exercise, id_title])
	
	const dspOptions = useState(false);
	function onOptions(evt) {
		evt.stopPropagation();
		dspOptions[1](!dspOptions[0]);
	}
	
	const navigate = useNavigate();
	function h_edit(evt) {
		evt.stopPropagation();
			
		localStorage.setItem('editInitial', 'true');

		sendData('fetch/exercisePage/', 'POST', {
			'exerciseId': parseInt(exerciseId),
		})
		.then(e=>{
			return navigate('/new', {state: e});
		})
	}
	
	async function onDelete(evt) {
		
		evt.stopPropagation();
		
		if(window.confirm("Delete this exercise ?")) {
			sendData('fetch/deleteExercise', 'POST', {
				'exerciseId': props.exercise['id'],
			})
		}
		
		if(props.onDelete) {
			props.onDelete(props.exercise);
		}
		
		dspOptions[1](false);
		
	}
	
	
	return(
	<>	
	<Card 
		url={props.url} 
		style={props.style} 
		className={props.className} 
		isRedirect={true}
	>

    {/*Card children*/} 
	
	{ dspOptions[0] && 
		
		<div style={{display:'flex'}}>

		<BtnTab 
			onClick={(evt)=>h_edit(evt)} 
			style={style_btnEditDelete}
			children='Edit'
		/>
			
		<BtnTab 
			onClick={(evt)=>onDelete(evt)} 
			style={style_btnEditDelete}
			children='Delete'
		/>
				
		</div>
	}
	
	{/* title, exercise */}
	<div id={id_title} style={style_text}/>
	<div id={id_exercise} style={style_text}/>
	
	{/* aditional menue button - only on profile */}
	{ props.isOptions && 
		<div className='topRightExerciseCard'>
			<BtnTab 
				onClick={(evt)=>onOptions(evt)}
				children='...'
			/>
		</div>
	}

	{/* likes */}		
	<div className='exerciseCard_btm'>
		{/* tags */}
		<div className='hscroll exerciseCard_btm_tags'>
			{props.exercise['tags'].map(i=>
				<Tag key={i} url={`/search/${i}`}>{i}</Tag>
			)}
		</div>
		<div className='exerciseCard_btm_like'>
		<BtnOnOf
			text={`${props.exercise['rating'].length}\nLikes`}
			className={`btnRound ${isLike && 'color_btn_green'}`}
		/>
		</div>
	</div>
	
  </Card>
  </>
  )
}
export default Exercise_card;

