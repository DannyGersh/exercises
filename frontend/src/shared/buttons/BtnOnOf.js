import {useState} from 'react'


function BtnOnOf(props){

	const c_isOn = props.c_isOn;
	const s_render = useState(true);
	// s_render - force rerender, s_render[0] value is irrelevant

	let classNameStr = props.className;
	
	if(c_isOn) {
		classNameStr += ` ${c_isOn[0]() ? 'green': 'blue'}`	 
		c_isOn[2]('renderFunc', ()=>{
			s_render[1](!s_render[0]);
		});	
	}

	return(
		<button
			type='button' 
			style={props.style} 
			className={classNameStr}
			onClick={props.onClick} 
		>
		{props.r_text.current}
		</button>
    )
    
    
}
export default BtnOnOf;





function BtnRadio(props){

	// c_selected[0]() == [previous selection, current selection]
	// s_render - force rerender, s_render[0] value is irrelevant
	
	const c_selected = props.c_selected;
	const s_render = useState(true);
	
	const classNameStr = `
		${props.className} 
		${c_selected[0]()[1] === props.name ? 'green': 'blue'}
	`	 
	
	function h_onClick(target) {
		const temp = [ c_selected[0]()[1], target ];	
		c_selected[1](temp);
		props.onClick && props.onClick();
	}

	c_selected[2](props.name, ()=>{

		if(c_selected){
		
			const condition = (
				props.name === c_selected[0]()[0] || 
				props.name === c_selected[0]()[1]
			)
		
			if(condition) {
				s_render[1](!s_render[0]);
			}
		}
	});	

	return(
		<button
			type='button' 
			style={props.style} 
			className={classNameStr}
			onClick={()=>h_onClick(props.name)} 
		>
		{props.name}
		</button>
    )
    
    
}
export {BtnRadio};

