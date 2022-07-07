import "./Tag.css";

/* 	
	define props.url to be a url for redirection.
*/

function Tag(props){
    
	function redirect(event){
		window.location.replace(props.url);
		event.stopPropagation(); // prevents clickable Card from executing
	}
	
	return(
        <button onClick={redirect} className="tag">{props.children}</button>
	)
}
export default Tag;