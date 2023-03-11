import React, {useState, useEffect} from 'react'
import {sendData, MIN_PAGINATION} from '../../shared/Functions'
import {BtnTab, BtnShowMore} from '../../shared/buttons/Buttons'
import Loading from '../../shared/loading/Loading'
import ExerciseCard from '../../shared/exerciseCard/ExerciseCard'


function Home() {
	
	let latest = useState([]);
	let hotest = useState([]);
	// s_ms - menue Selection - true: hottest, false: latest
	const s_ms = useState(true); 
	const s_dspExNum = useState(MIN_PAGINATION); 
	const s_finLoad = useState(false);
	
	useEffect(()=>{
		sendData('fetch/home')
		.then(data=>{
			latest[1](data['latest']);
			hotest[1](data['hotest']);
			s_finLoad[1](true);
		})	
	},[])
	
	function h_ms(isHottest) { // handle menue selection
		s_ms[1](isHottest);
		s_dspExNum[1](MIN_PAGINATION);
	}
	
	const exercises = 
		(s_ms[0] ? hotest[0]: latest[0]).slice(0,s_dspExNum[0]);
	
	const style_btn_tab = {
		height: '2rem',
		width: '6rem',
	}
	
	
	return(
	<>		
		<center>

		<h1 style={{face: "Georgia", fontSize: `${window.nrw && '7vw'}`}}>
			www.ididthisforu.com&nbsp;
			<img
				alt=''
				className="betaSymbol"
				src={window.url_base+'/static/images/beta.svg'}
			/>
		</h1>
		
		<h4 style = {{margin:'1rem'}}>
			The website for creating and solving 
			exercises in any field of study
		</h4>
		
		<BtnTab 
			className = {`${s_ms[0] && 'color_btn_green'}`} 
			style={style_btn_tab}
			onClick={()=>h_ms(true)}
		>hottest</BtnTab>
		
		<BtnTab 
			className={`${ !s_ms[0] && 'color_btn_green'}`} 
			style={style_btn_tab}
			onClick={()=>h_ms(false)}
		>latest</BtnTab>
		
		</center>
		
		<div className='gridContainer'>
		{ !s_finLoad[0] &&
			<Loading/>
		}

		{ exercises.map( (item,index) =>
			<ExerciseCard
				userId={window.userId[0]}
				narrowWindow={window.nrw}
				key={index}
				url={`/exercise/${item['id']}`} 
				exercise={item}
				isOptions={false}
				renderOnChange={s_ms}
			/>
		)}	
		</div>
		
		<center>
		<BtnShowMore 
			step={MIN_PAGINATION}
			max={hotest[0].length}
			s_count={s_dspExNum} 
		/>
		</center>
		
	</>	
	)
}
export default Home;
