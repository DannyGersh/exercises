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
	
	<center>
	<div className='gridContainer'>
	{ items.length !== 0 ?
	  items.map( i =>
      <Exercise
				style={window.nrw ? {width:'100%'}: {width:'calc(50% - 5rem)'}}
	      title={i['title']} 
				paragraph={i['exercise']} 
				url={'../../' + String(i['id'])} 
				likes={i['rating'] ? i['rating'].length: 0} 
				tags={i['tags']}
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