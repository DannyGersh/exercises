import './ToolTip.css'
import {useState, useEffect, useRef} from 'react'


function ToolTip(props) {
	
	const ref = useRef(); // to tooltip
	const dsp = useState(false); // display toltip - true/false

	const id1 = props.id1; // visible element
	const id2 = props.id2; // tooltip

	// future elements (getElementById)
	let elm1 = null; // visible element
	let elm2 = null; // tooltip
	
	// init hover event
	// dst == true - on mouseenter
	// dst == false - on mouseleave
	useEffect(()=>{
		elm1 = document.getElementById(id1);

		elm1.addEventListener('mouseenter', (event) => {
			dsp[1](true);
		});
		elm1.addEventListener('mouseleave', (event) => {
			dsp[1](false);
		});		
	},[])
	
	// display toottip conditionally
	useEffect(()=>{
		
		if(dsp[0]) {
			
			// elm2 can only excist when dsp[0] is true
			const elm2 = document.getElementById(id2);
			let rect = elm2.getBoundingClientRect();
			const width = window.innerWidth;
			const height = window.innerHeight;
			
			// when tooltip goes outside window
			if(rect.right > width) {
				const fin_width = (width - rect.left).toString() + 'px';
				ref.current.style.width = fin_width;
				ref.current.style.whiteSpace = 'unset';
				rect = elm2.getBoundingClientRect();
			}
			if(rect.bottom > height) {
				const fin_top = (rect.top - (rect.bottom - height)).toString()+'px';
				ref.current.style.position = 'fixed'
				ref.current.style.top = fin_top;
			}
		}

	},[dsp[0]])
	
	return(
		<>
		<div id={id1}>
			{props.children}
			{dsp[0] && 
				<div id={id2} ref={ref} className='toolTip'>
				{props.text}
				</div>
			}
		</div>
		</>
	)
}
export default ToolTip;