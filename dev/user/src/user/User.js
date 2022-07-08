import BtnRound from '../shared/buttons/BtnRound'
import {useState} from 'react'

function User(){
  
  let user = 'danny'
  let [poop, setPoop] = useState(false);
  function poopHandle(){
	setPoop(!poop);
	console.log(poop)
  }
  
  return(
    <>
    <div>
	  <p style={{'padding': '1rem'}}>welcome {user}</p>
	  <BtnRound on={false} active={true}>poop</BtnRound>
	</div>
	</>
  )
}
export default User;