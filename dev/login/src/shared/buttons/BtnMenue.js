import './BtnMenue.css'

function BtnMenue(props){
		
	return(
		<button 
			className={`btnMenue ${props.className && props.className}`} 
			type={props.type} 
			style={props.style} 
			onClick={props.onClick}
		>
			{props.children}
		</button>
	)
}
export default BtnMenue;