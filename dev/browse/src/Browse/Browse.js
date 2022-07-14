import Exercise from '../shared/exercise/Exercise'

function Browse(){
	
  //console.log("window.jsonData: ", window.jsonData);
  
  //window.jsonData = {
  //0: [3, 'question 2', 'answer 2', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c', 'd'], ['math', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1', 'tag1']],
  //1: [2, 'question 1', 'answer 1', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c'], ['math', 'tag1']],
  //2: [4, 'question 3', 'answer 3', '', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c'], ['math', 'tag1']],
  //"search term": "test"
  //}

  let items = Object.assign({}, window.jsonData);
  delete items["search term"];
  items = Object.values(items)
    
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