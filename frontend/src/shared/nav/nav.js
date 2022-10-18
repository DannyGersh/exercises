import "./nav.css";
import CSRFToken from "../csrftoken";
import { useState } from "react";
import BtnMenue from '../buttons/BtnMenue'


function Nav(props) {

	// props:
	// narrowWindow - true if window is narrow
  // userid = user id

	// dropDownActive - true if nav searchBar is expended
	const dropDownActive = useState(false);
	
  // nav dropDown event
  const navDropDown = new CustomEvent('navDropDown', {
  	detail: {'isDropedDown': !dropDownActive[0]},
  	bubbles: true,
  	cancelable: true,
  	composed: false
  })
  
	// dispatch event on searchBar button click
	function dropDownHandler() {
		dropDownActive[1](!dropDownActive[0]);
    // set timeout prevents asincroneus dispatching of the event
    setTimeout(() => 
    	window.dispatchEvent(navDropDown)
    	);
  }

  // nav buttons handlers
  function registerHandle(){
  	window.location = '/register/'
  }
  function homeHandle(){
  	window.location = '/';
  }
  function newHandle(){
  	window.location = '/new/';
  }
  function logOutHandle(){
  	window.location = '/logout/';
  }
  function profileHandle(){
  	let temp = '/profile/' + String(props.userid);
  	props.userid ? window.location = temp : window.location = '/login/';
  }
  function contactHandle(){
  	window.location='/contact/'
  }

  const dspProfileBtn = props.userid && !/profile\/\d/.test(window.location);
  const dspNewBtn = /.*[\\/]new/.test(window.location)

  return ( 
  <>
  <div className="nav">

	  {/* menue buttons */}
	  <BtnMenue onClick={homeHandle}>Home</BtnMenue>
	  { !dspNewBtn && <BtnMenue onClick={newHandle}>New</BtnMenue>}
	  { dspProfileBtn && <BtnMenue onClick={profileHandle} >Profile</BtnMenue>}			
	  <BtnMenue onClick={props.userid ? logOutHandle: registerHandle}>{props.userid ? 'Log out': 'Log in'}</BtnMenue>	
	  <BtnMenue onClick={contactHandle}>Contact</BtnMenue>		

		{/* search buttons on narrowWindow */}
	  { props.narrowWindow &&
	  	<div className='searchContainer'>
	  		<BtnMenue onClick={dropDownHandler}>
	  			Search
	  		</BtnMenue>
	  	</div>
	  }

		{/* search bar on wide window */}
	  { !props.narrowWindow &&
	  	<div className='searchContainer'>
	  	<form className='nav' action="/browse/" method="post">
	  	{ process.env.NODE_ENV !== 'development' && <CSRFToken /> }
	  	<button className='searchBtn' type="submit"></button>
	  	<input className='searchText' type="text" name="browse" />
	  	</form>
	  	</div>
	  }

  </div>

	{/* search bar on narrowWindow */}
	{dropDownActive[0] && (
		<div>
			<form className='nav' action="/browse/" method="post">
				{ process.env.NODE_ENV !== 'development' && <CSRFToken /> }
				<button className='searchBtn' type="submit"></button>
				<input className='searchText' type="text" name="browse" />
			</form>
		</div>
	)}
	</> 
	);
}
export default Nav;
