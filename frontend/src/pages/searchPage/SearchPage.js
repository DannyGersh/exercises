import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import {sendData} from '../../shared/Functions'
import ExerciseCard from '../../shared/exerciseCard/ExerciseCard'


function MainBody(props) {
	
	const ctx = props.ctx;
	
	let exercises = [];
	if(ctx.s_exercises[0]) {
		exercises = ctx.s_exercises[0].searchResult;
	}
		
	const style_text = {
		marginLeft: '1rem',
	}
	const cond_dspNoMatches = ctx.s_finLoad[0] && !exercises.length;
	
	return(<>
		
		<h3 style={style_text}>Search results for: {ctx.searchTerm}</h3>
		{cond_dspNoMatches &&
			<p style={style_text}>no matches found ...</p>
		}
		
		<div className='gridContainer'>
		{exercises.map((item, index)=>
			<ExerciseCard
				userId={window.userId[0]}
				narrowWindow={false}
				key={index}
				url={`/exercise/${item['id']}`} 
				exercise={item}
				isOptions={false}
				renderOnChange={ctx.s_exercises}
			/>
		)}
		</div>
		
	</>)
}


function SearchPage() {
	
	const params = useParams();

	const ctx = {
		searchTerm: params.searchTerm,
		s_exercises: useState(null),
		s_finLoad: useState(false),
	}
	
	useEffect(()=>{
		sendData('fetch/search', 'POST', {
			searchTerm: ctx.searchTerm,
		})
		.then(data=>{
			ctx.s_exercises[1](data);
			ctx.s_finLoad[1](true);
		})
	},[params])
	
	return <MainBody ctx={ctx}/>
}
export default SearchPage;
