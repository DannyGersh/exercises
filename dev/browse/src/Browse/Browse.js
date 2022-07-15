import Exercise from '../shared/exercise/Exercise'

function Browse(){
	
	// defined in apps.js:
  // const chalanges = window.jsonData['chalanges']
	// const signInFailure = window.jsonData['signInFailure']
	// const isSignUp = window.jsonData['isSignUp']
	// const isAuth = window.jsonData['isAuth']
  // const userid = window.jsonData['userid']
	// const searchTerm = window.jsonData['search term']
	
  let items = Object.values(window.jsonData['chalanges'])
    
  return(
  <>
	<p style={{'padding': '0rem 0rem 0rem 1rem'}}>search result for: <strong>{window.jsonData["search term"]}</strong></p>
	
	{ items.length !== 0 ?
	  items.map( i =>
        <Exercise
	      title={i[6]} 
	  	paragraph={i[1]} 
	  	url={'../../' + i[0]} 
	  	likes={i[7].length} 
	  	tags={i[8]}
	    />
      )
	  :
	  <p>no results found</p>
	}
  </>
  )	
  
}
export default Browse;