import {useState, useEffect} from 'react'
import ExerciseCard from '../../shared/exerciseCard/ExerciseCard'
import BtnMenue from '../../shared/buttons/BtnMenue'
import './Home.css'

import {sendData, getCookie} from '../../shared/Functions'

function Home(props) {
	
	let latest = useState([]);
	let hotest = useState([]);
	const ms = useState(false) // Menue Selection - true: latest, false: hotest
	
	useEffect(()=>{
		sendData('fetch/home')
		.then(data=>{
			latest[1](data.latest);
			hotest[1](data.hotest);
		})	
	},[])
		
	return(
	<>		
		<center>
		<h1>www.ididthisforu.com <font color='green'>Alpha</font></h1>
		<p style={{margin:'1rem'}}>The website for uploading and solving exercises in any field</p>
		<BtnMenue className={`btnHomeMenue ${!ms[0] && 'green'}`} onClick={()=>ms[1](false)}>hottest</BtnMenue>
		<BtnMenue className={`btnHomeMenue ${ ms[0] && 'green'}`} onClick={()=>ms[1](true)}>latest</BtnMenue>
		</center>
		
		<div className='gridContainer'>
		{ (ms[0] ? latest[0]: hotest[0]).map( (item,index) =>
				<ExerciseCard
					userId={props.userid}
					narrowWindow={window.nrw}
					key={index}
					identifier={index}
					isUser={true}
					url={'/' + item['id']} 
					exercise={item}
					isOptions={false}
					renderWhenChange={ms}
				/>
			)
		}	
		</div>
		
	</>	
	)
}
export default Home;
