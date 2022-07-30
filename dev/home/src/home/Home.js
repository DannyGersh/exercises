import {useState} from 'react'
import Exercise from '../shared/exercise/Exercise'
import BtnMenue from '../shared/buttons/BtnMenue'
import './Home.css'

function Home(props) {
	
	const latest = window.jsonData['latest'];
	const hotest = window.jsonData['hotest'];
	const ms = useState(true) // Menue Selection - true: latest, false: hotest
	function msh() { ms[1](!ms[0]); } // Menue Selection Handle
	
	return(
	<>
		<center>
		<h1>~ Exercises ~</h1>
		<p>The website for uploading and solving exercises in any field</p>
		<BtnMenue className={`btnHomeMenue ${ ms[0] && 'green'}`} onClick={msh}>latest</BtnMenue>
		<BtnMenue className={`btnHomeMenue ${!ms[0] && 'green'}`} onClick={msh}>hotest</BtnMenue>
		</center>
		
		<div className='gridContainer'>
		{ (ms[0] ? latest: hotest).map( i =>
				<Exercise
					style={window.nrw ? {width:'100%'}: {width:'calc(50% - 5rem)'}}
					key={i['id']}
					title={i['title']} 
					paragraph={i['question']} 
					url={'../../../../../' + String(i['id'])} 
					likes={i['rating'] ? i['rating'].length: 0} 
					tags={i['tags']}
				/>
			)
		}
		</div>
		
	</>	
	)
}
export default Home;