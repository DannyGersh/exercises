import "./Tag.css";
import {useNavigate} from 'react-router-dom';

/* 	
	define props.url to be a url for redirection.
*/

function Tag(props){
    
	const navigate = useNavigate();

	function h_redirect(event){
		
		if(props.onClick){
			// assign non default function
			props.onClick(event); 
		} else {
			navigate(props.url);
		}
		// prevents clickable Card from executing
		event.stopPropagation(); 
	}
	
	return(
        <button 
			type='button' 
			onClick={(e)=>h_redirect(e)} 
			className={`tag color_btn_default ${props.className}`}
		>
			{props.children}
		</button>
	)
}
export default Tag;
