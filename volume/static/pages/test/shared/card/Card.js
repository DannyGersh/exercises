import "./Card.css"

// define props.url to be a url for redirection.

function Card(props){
	
	function redirect(){
		window.location.replace(props.url);
	}
	return(
	<>
		<div 
			className={`card ${props.className && props.className}`}
			style={props.style}
			onClick={redirect}>
		{ props.children }
		</div>
	</>
	)
}
export default Card;