import "./Card.css"
//import CSRFToken from '../shared/csrftoken'

/* 	
	define props.url to be a url for redirection.
*/

function Card(props){
	
	function redirect(){
		window.location.replace(props.url);
	}
	return(
	<>
		<div className="card" onClick={redirect}>
		{ props.children }
		</div>
	</>
	)
}
export default Card;