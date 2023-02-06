import React, {useNavigate} from 'react-router-dom';
import "./Card.css"

function Card(props){
	
	/* props
		* url - string
		* isRedirect - bool
		* className - string
		* style - string
	*/
	
	const navigate = useNavigate();
	
	function redirect(){
		if(props.isRedirect) {
			navigate(props.url);
		}
	}
	
	return(
	<>
		<div 
			className = {
				`card 
				${props.isRedirect && 'redirect'} 
				${props.className && props.className} 
				${window.nrw ? 'narrowWindow': 'wideWindow'}
				${props.isRedirect && 'redirect'}`
			}
			style={props.style}
			onClick={redirect}>
		{ props.children }
		</div>
	</>
	)
}
export default Card;
