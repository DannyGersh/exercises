import "./Card.css"
import CSRFToken from '../shared/csrftoken'

function Card(props){
	
	return(
	<>
		<form action={props.dst} method="post">
		<CSRFToken/>
		<button className="card">
		{ props.children }
		</button>
		</form>
	</>
	)
}
export default Card;