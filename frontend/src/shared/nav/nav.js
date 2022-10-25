import "./nav.css";
import CSRFToken from "../csrftoken";
import { useState } from "react";
import BtnMenue from '../buttons/BtnMenue'
import {sendData} from '../functions'
import '../buttons/BtnMenue.css'

import { useParams, BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Nav(props) {

	// props:
	// narrowWindow - true if window is narrow
	// userid = user id

	const userid = window.userid[0];

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

	function logOutHandle(){
		sendData('/fetch/logout')
		.then(data=>{
			window.userid[1](null);
		})
	}
	function profileHandle(){
		let temp = '/profile/' + String(userid);
		userid ? window.location = temp : window.location = '/login/';
	}

	const dspProfileBtn = userid && !/profile\/\d/.test(window.location);
	const dspNewBtn = /.*[\\/]new/.test(window.location)

	return ( 
	<>
	<div className="nav">

		{/* menue buttons */}
		<Link to='/'>
		<BtnMenue>Home</BtnMenue>
		</Link>

		<Link to='/new'>
		{window.userid[0] && <BtnMenue>New</BtnMenue>}
		</Link>

		<Link to={'/profile/'+userid}>
		{window.userid[0] && <BtnMenue>Profile</BtnMenue>}			
		</Link>

		<Link to={window.userid[0] ? '/' : '/login'}>
		<BtnMenue onClick={logOutHandle}>{window.userid[0] ? 'Log out' : 'Log in'}</BtnMenue>	
		</Link>

		<Link to='/contact'>
		<BtnMenue>Contact</BtnMenue>		
		</Link>

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
