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
	console.log(window.jsonData['chalanges'])
  return(
  <>
	
	<p style={{'padding': '0rem 0rem 0rem 1rem'}}>search result for: <strong>{window.jsonData["search term"]}</strong></p>
	
	<center>
	<div className='gridContainer'>
	{ items.length !== 0 ?
	  items.map( (item,index) =>
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
				/>
      )
	  :
	  <p>no results found</p>
	}
	</div>
	</center>
	
  </>
  )	
  
}
export default Browse;