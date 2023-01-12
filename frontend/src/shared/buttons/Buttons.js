import {useState, useEffect} from 'react'
import {uploadError, isInt} from '../Functions'


function Btn(props) {

	// props:
	// className, onClick, style
	
	return(
		<button
			type='button' 
			style={props.style} 
			className={props.className}
			onClick={props.onClick} 
		>
		{props.children}
		</button>
    )
    
}
export default Btn;

function BtnTab(props){
	
	// props:
	// className, style, onClick, type
	
	return(
		<button 
			className={`
				btnTab 
				${props.className}
				color_btn_default 
			`} 
			type={props.type ? props.type : 'button'} 
			style={props.style} 
			onClick={props.onClick}
		>
			{props.children}
		</button>
	)
}
export {BtnTab};

function BtnOnOf(props) {

	// props:
	// c_isOn (useController) - boolean
	// r_text (useReff) - dynamic text to be displayed
	// text (str) - static text to be displayed
	// className, style, onClick
	
	const c_isOn = props.c_isOn;
	const s_render = useState(true);

	let classNameStr = props.className;
	
	if(c_isOn) {
		// intentionall space in begining
		classNameStr += ` ${c_isOn[0]() ? 
			'color_btn_green': 
			'color_btn_blue'
		}`	 
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
		{props.r_text && props.r_text.current}
		{props.text && props.text}
		</button>
    )
    
    
}
export {BtnOnOf};

function BtnRadio(props) {

	// props:
	// c_selected(useController) - [
	//		previous selection, 
	//		current selection
	// ]
	// s_render(useState) - force rerender, default - boolean
	// name (str) - the displayed text, must be unique
	// onClick, className, style
	
	const c_selected = props.c_selected;
	const s_render = useState(true);
	
	const classNameStr = `
		${props.className} 
		${c_selected[0]()[1] === props.name ? 
			'color_btn_green': 
			'color_btn_blue'
		}
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

function BtnShowMore(props) {
	
	// props:
	// step (int) - how much elements to add onClick
	// max (int) - how much total elements are there
	// s_count (state, int) - changing num of elements to dsp.
	
	// P_ERROR
	
	useEffect(()=>{
		if(!isInt(props.step)) {
			uploadError('type error', 'props.step must be integer');
		}
		if(!isInt(props.max)) {
			uploadError('type error', 'props.max must be integer');
		}
		if(props.s_count === null) {
			uploadError('undefined', 'props.s_count is undefined');
		} else {
			if(!isInt(props.s_count[0])) {
				uploadError(
					'type error', 
					'props.s_count must be integer'
				);
			}
		}
	})
	// END_PERROR
	
	let max = 0;
	let step = 1;
	if(props.max) { max = props.max }
	if(props.step) { step = props.step }
	const s_count = props.s_count;
		
	return(<>
	{s_count[0] < props.max &&
		<Btn
			className='btnTab color_btn_default'
			onClick={()=>s_count[1](s_count[0]+step)}
			children='show more'
		/>
	}		
	</>)
}
export {BtnShowMore}
