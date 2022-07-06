import Card from './Card'
import Tag from '../shared/tag'
import './Browse.css'

function Browse(){
	
  //console.log("window.jsonData: ", window.jsonData);
  
  //window.jsonData = {
  //0: [3, 'question 2', 'answer 2', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c', 'd'], ['math', 'tag1']],
  //1: [2, 'question 1', 'answer 1', 'this is a hint', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c'], ['math', 'tag1']],
  //2: [4, 'question 3', 'answer 3', '', 'test-Author', '2022-07-03T20:40:36.210', 'test title', ['a','b','c'], ['math', 'tag1']],
  //}

  let items = Object.assign({}, window.jsonData);
  delete items["search term"];
  items = Object.values(items)
  console.log(items);
    
		  
  return(
  <>
    <p>Search results for: <em><b>{window.jsonData["search term"]}</b></em></p>
	{
        items.map(i => 
        <Card dst={'../' + String(i[0]) + '/'}>
        <div className='bottomRight5'>
         <button className='btn2'>{i[7].length}<br/>Likes</button>
        </div>
        
        <h4>{i[6]}</h4>
        {i[1]} <br/><br/><br/>
        <div className='relative'>
          { i[8].map(ii => <Tag>{ii}</Tag>) }
        </div>
        </Card>
	  )
	}
  </>
  )
}
export default Browse;