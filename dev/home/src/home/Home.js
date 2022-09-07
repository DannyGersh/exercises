import {useState, useEffect} from 'react'
import Exercise from '../shared/exercise/Exercise'
import BtnMenue from '../shared/buttons/BtnMenue'
import './Home.css'

import {getCookie} from '../shared/Functions'

function Home(props) {
	
	const latest = window.jsonData['latest'];
	const hotest = window.jsonData['hotest'];
	const ms = useState(false) // Menue Selection - true: latest, false: hotest

	return(
	<>		
		<center>
		<h1>~ Exercises ~</h1>
		<p>The website for uploading and solving exercises in any field</p>
		<BtnMenue className={`btnHomeMenue ${!ms[0] && 'green'}`} onClick={()=>ms[1](false)}>hotest</BtnMenue>
		<BtnMenue className={`btnHomeMenue ${ ms[0] && 'green'}`} onClick={()=>ms[1](true)}>latest</BtnMenue>
		</center>
		
		<div className='gridContainer'>
		{ (ms[0] ? latest: hotest).map( (item,index) =>
				<Exercise
					narrowWindow={!window.nrw}
					key={index}
					identifier={index}
					isUser={true}
					url={'/' + item['id']} 
					chalange={item}
					userid={window.jsonData['userid']}
					isOptions={false}
					forceRenderDummyState={ms}
				/>
			)
		}
		</div>
		
	</>	
	)
}
export default Home;

// title={item['title']} 
// paragraph={item['question']} 
// likes={item['rating'].length} 
// tags={item['tags']}