import "./Tag.css";
import {useNavigate} from 'react-router-dom';

/* 	
	define props.url to be a url for redirection.
*/

function Tag(props){
    
    /*props:
		url(str) - wher to redirect ob click
		isDisabled (bool) - true if non clickable
		
		onClick, className
    */
    
	const navigate = useNavigate();

	function h_redirect(event){
		
		if(props.onClick){
			// assign non default function
			!props.isDisabled && props.onClick(event); 
		} else {
			!props.isDisabled && navigate(props.url);
		}
		// prevents clickable Card from executing
		event.stopPropagation(); 
	}

	return(
        <button 
			type='button' 
			onClick={(e)=>h_redirect(e)} 
			className={`
				tag 
				${props.isDisabled ? 
					'color_static_default' : 
					'color_btn_default'
				} 
				${props.className}`}
		>
			{props.children}
		</button>
	)
}
export default Tag;
