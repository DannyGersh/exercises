import "./Card.css"

// define props.url to be a url for redirection.
function Card(props){

	function redirect(){
		if(props.isRedirect) {
			window.location.replace(props.url);
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