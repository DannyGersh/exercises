import './BtnMenue.css'

function BtnMenue(props){
	
	return(
		<button className='btnMenue' onClick={props.onClick}>{props.children}</button>
	)
}
export default BtnMenue;