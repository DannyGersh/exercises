import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import {sendData, MIN_PAGINATION} from '../../shared/Functions'
import {BtnShowMore} from '../../shared/buttons/Buttons'
import Loading from '../../shared/loading/Loading'
import ExerciseCard from '../../shared/exerciseCard/ExerciseCard'


function MainBody(props) {
	
	const ctx = props.ctx;
	const s_dspExNum = useState(MIN_PAGINATION); 

	let exercises = [];
	if(ctx.s_exercises[0]) {
		exercises = ctx.s_exercises[0].searchResult;
	}
		
	const style_text = {
		marginLeft: '1rem',
	}
	
	// is any exercises - are there any search results
	const isAnyEx = !(ctx.s_finLoad[0] && !exercises.length);
	
	window.addEventListener('evt_search', ()=>{
		s_dspExNum[1](MIN_PAGINATION);
	})

	const temp = [];
	exercises = exercises.filter(i=>{
		const cond = !temp.includes(i['id']) 
		temp.push(i['id'])
		return cond;
	})
	
	return(<>
		
		<h3 style={style_text}>Search results for: {ctx.searchTerm}</h3>
		{!isAnyEx &&
			<p style={style_text}>no matches found ...</p>
		}
		
		{!ctx.s_finLoad[0] &&
			<Loading vcenter={true}/>
		}
		
		<div className='gridContainer'>
		{exercises.slice(0, s_dspExNum[0]).map((item, index)=>
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
		
		<center>
		<BtnShowMore 
			step={MIN_PAGINATION}
			s_count={s_dspExNum} 
			max={exercises.length}
		/>
		</center>
		
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
	},[params, ctx.s_exercises, ctx.s_finLoad, ctx.searchTerm])
	
	return <MainBody ctx={ctx}/>
}
export default SearchPage;
