import './Loading.css'

function Loading(props) {
	
	// props:
	// vcenter (boolean) - true if centered vertically
	
	return <>
		<center className={`${props.vcenter && 'vertical-center'}`}>
			<div className="lds-ring">
				<div></div><div></div><div></div><div></div>
			</div>
		</center>
	</>
}
export default Loading;
