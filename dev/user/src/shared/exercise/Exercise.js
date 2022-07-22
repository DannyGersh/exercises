import Card from '../card/Card'
import BtnRound from '../../shared/buttons/BtnRound'
import Tag from '../../shared/tag/Tag'
import './Exercise.css'

function Exercise(props){
  	
  return(
  <>
    <Card url={props.url} >
            
	  <div className='bottomRight'>
	    <BtnRound>
		  {props.likes}<br/>Likes
	    </BtnRound>
	  </div>
      
      <h4>{props.title}</h4>
	    {props.paragraph} <br/><br/><br/>
      <div style={{'width': 'calc(100% - 3.3rem)'}} className="vscrol">
        { 
		  props.tags.map((i) => 
		    <Tag key={i} url={'../../../../../../../../../../browse/'+i}>{i}</Tag>
		  ) 
		}
      </div>
		    
    </Card>
  </>
  )
}
export default Exercise;