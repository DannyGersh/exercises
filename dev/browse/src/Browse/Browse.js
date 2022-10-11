import Exercise from '../shared/exercise/Exercise'

function Browse(){
	
	// defined in apps.js:
	// window.jsonData['chalanges']
	// window.jsonData['signInFailure']
	// window.jsonData['isSignUp']
	// window.jsonData['isAuth']
	// window.jsonData['userid']
	// window.jsonData['search term']
	
	let items = (window.jsonData['chalanges'])	

	return(
	<>
		
	<p style={{'padding': '0rem 0rem 0rem 1rem'}}>search result for: <strong>{window.jsonData["search term"]}</strong></p>
		
	<center className='gridContainer'>	

		{ items.length !== 0 ?
		items.map( (item,index) =>
	      <Exercise
			narrowWindow={window.nrw}
			key={index}
			identifier={index}
			isUser={true}
			title={item['title']} 
			paragraph={item['question']} 
			url={'/' + item['id']} 
			likes={item['rating'].length} 
			tags={item['tags']}
			chalange={item}
			forceRenderDummyState={[null,null]}
		/>
	    )
		:
		<p>no results found</p>
		}	

		</center>
		
	</>
	)	
	  
}
export default Browse;