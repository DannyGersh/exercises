import './ExerciseCard.css'
import {mainText2html, sendData} from '../../shared/Functions'
import {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";

import BtnMenue from '../../shared/buttons/BtnMenue'
import BtnOnOf from '../../shared/buttons/BtnOnOf'
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
	let n_title = null;
	let n_exercise = null;
	
	const style_text = {
		whiteSpace: 'break-spaces', 
		overflow:'hidden',
	}
	const style_btnEditDelete = {
		marginRight:'0.5rem',
		width:'4rem', 
	}
	const style_btnLike = {
		backgroundColor: isLike ? 'var(--green)' : 'var(--blue)'
	}
	
	useEffect(()=>{
		n_title = document.getElementById(id_title);
		n_title.innerHTML = htmlTitle;
		n_exercise = document.getElementById(id_exercise);
		n_exercise.innerHTML = htmlExercise;
	},[props.renderOnChange])
	
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
		narrowWindow={props.narrowWindow}
		isRedirect={true}
	>

    {/*Card children*/} 
	
	{/* aditional menue button - only on profile */}
	{ props.isOptions && 
		<div className='topRightExerciseCard'>
			<BtnMenue onClick={(evt)=>onOptions(evt)}>...</BtnMenue>
		</div>
	}

	{/* aditional menue - only on profile */}
	{ dspOptions[0] && 
		
		<div style={{display:'flex'}}>
					
		<BtnMenue 
			onClick={(evt)=>h_edit(evt)} 
			style={style_btnEditDelete}
		>Edit</BtnMenue>

		<BtnMenue 
			onClick={(evt)=>onDelete(evt)} 
			style={style_btnEditDelete}
		>Delete</BtnMenue>
		
		</div>

	}
	
	{/* likes */}		
	<BtnOnOf 
		style={style_btnLike}
		text={`${props.exercise['rating'].length}\nLikes`}
		className='btnRound bottomRightExerciseCard'
	/>

	{/* title, exercise */}
	<div style={{maxHeight: '12rem', overflow:'hidden'}}>
		<div id={id_title} style={style_text}/>
		<div id={id_exercise} style={style_text}/>
	</div>
	
	<div className='bottomLeftExerciseCard'>
		{props.exercise['tags'].map(i=>
			<Tag key={i} url={`/search/${i}`}>{i}</Tag>
		)}
	</div>
	
  </Card>
  </>
  )
}
export default Exercise_card;

