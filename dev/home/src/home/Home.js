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
					style={window.nrw ? {width:'calc(100% - 5rem)'}: {width:'calc(50% - 5rem)'}}
					key={index}
					identifier={index}
					isUser={true}
					title={item['title']} 
					paragraph={item['question']} 
					url={'../../' + item['id']} 
					likes={item['rating'].length} 
					tags={item['tags']}
					chalange={item}
					userid={window.jsonData['userid']}
				/>
			)
		}
		</div>
		
	</>	
	)
}
export default Home;