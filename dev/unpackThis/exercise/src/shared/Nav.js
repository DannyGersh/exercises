import './styles.css'

function Nav(props){
if(!props.poop) {
	return(
		<div className='nav'>
			<button>
				Home
			</button>
			<button>
				New
			</button>
			<button>
				Browse
			</button>
			<div>
				<button>
					S
				</button>
				<input type="text"/>
			</div>
		</div>
	); 
	
} else {
	
	return (
		<div className='nav'>
			<button>
				Home
			</button>
			<button>
				New
			</button>
			<button>
				Browse
			</button>
			<div>
				<button>
					menue
				</button>
			</div>
		</div>
	);
	}
}
export default Nav;
