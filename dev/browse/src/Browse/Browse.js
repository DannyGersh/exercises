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
	
	{ items.length !== 0 ?
	  items.map( i =>
      <Exercise
	      title={i[5]} 
				paragraph={i[1]} 
				url={'../../' + String(i[0])} 
				likes={i[6] ? i[6].length: 0} 
				tags={i[7]}
	    />
      )
	  :
	  <p>no results found</p>
	}
  </>
  )	
  
}
export default Browse;