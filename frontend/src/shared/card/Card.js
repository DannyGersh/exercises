import "./Card.css"
import {useNavigate} from 'react-router-dom';


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
				${props.narrowWindow ? 'narrowWindow': 'wideWindow'}
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
