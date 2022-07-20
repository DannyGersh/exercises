import "./Tag.css";

/* 	
	define props.url to be a url for redirection.
*/

function Tag(props){
    
	function redirect(event){
		
		if(props.onClick){
			props.onClick(event); // assign non default function
		} else {
			window.location.replace(props.url); // default
		}
		
		event.stopPropagation(); // prevents clickable Card from executing
	}
	
	return(
        <button type='button' onClick={(e)=>redirect(e)} className="tag">{props.children}</button>
	)
}
export default Tag;