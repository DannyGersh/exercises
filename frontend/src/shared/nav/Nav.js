import React, {useEffect, useState, useRef} from "react";
import {useNavigate, Link} from "react-router-dom";
import {sendData} from '../Functions'
import {BtnTab} from '../buttons/Buttons'
import "./Nav.css";

function SearchBox(props) {
	
	const navigate = useNavigate();
	const node_searchBox = useRef(document.getElementById("id_searchBox"));
	const node_searchContainer = useRef(document.getElementById("id_searchContainer"));

	const evt_search = new CustomEvent('evt_search', {
		bubbles: true,
		cancelable: true,
		composed: false
	})
	function dispatchEventSearch() {
		setTimeout(() => 
			window.dispatchEvent(evt_search)
		);
	}
	
	useEffect(()=>{
		node_searchBox.current = document.getElementById("id_searchBox");
		node_searchContainer.current = document.getElementById("id_searchContainer");
		if(node_searchContainer.current) { 
			
			window.nrw && node_searchBox.current.focus();
			
			node_searchBox.current.addEventListener("keyup", function(event) {
				if (event.key === "Enter") {
					dispatchEventSearch();
					props.s_isDspSearchBox[1](false);
					let text = event.target.value;
					if(!text) return;
					node_searchBox.current.value = '';
					navigate(`/search/${text}`);
				}
			});
			node_searchContainer.current.addEventListener('focusout', ()=>{
				setTimeout(()=>{
					props.s_isDspSearchBox[1](false);
				}, 100)
			});
		}
		
	})

	function h_searchBtnClick() {
		dispatchEventSearch();
		const text = node_searchBox.current.value;
		node_searchBox.current.value = '';
		if(!text) return;
		navigate(`/search/${text}`);
		props.s_isDspSearchBox[1](false);
	}
	
	return(<div className='searchContainer' id='id_searchContainer'>
		<button 
			onClick={h_searchBtnClick} 
			className='searchBtn' 
			type="button"
		/>
		<input 
			id='id_searchBox' 
			className={`${window.nrw ? 'searchTextWide' : 'searchTextNarrow'}`} 
			type="text"
		/>
	</div>)		
}

function Nav() {

	const userid = window.userId[0];

	// s_isDspSearchBox - true if nav searchBar is expended
	const s_isDspSearchBox = useState(false);
	
	// nav dropDown event
	const navDropDown = new CustomEvent('navDropDown', {
		detail: {'isDropedDown': !s_isDspSearchBox[0]},
		bubbles: true,
		cancelable: true,
		composed: false
	})
  
	// dispatch event on searchBar button click
	function h_dropDown() {
		s_isDspSearchBox[1](!s_isDspSearchBox[0]);
		// set timeout prevents asincroneus dispatching of the event
		setTimeout(() => 
			window.dispatchEvent(navDropDown)
		);
	}
	function h_btnClick() {
		s_isDspSearchBox[1](false);
	}

	function h_logOut(){
		sendData('/fetch/logout')
		.then(()=>{
			window.userId[1](null);
		})
	}
	//function h_profile(){
	//	let temp = '/profile/' + String(userid);
	//	userid ? window.location = temp : window.location = '/login/';
	//}

	
	return (<>
	
	<div className="nav">

		{/* menue buttons */}
		<Link to='/' onClick={h_btnClick}>
		<BtnTab>Home</BtnTab>
		</Link>

		{Boolean(userid) && 
			<Link to='/new' onClick={h_btnClick}>
				<BtnTab>New</BtnTab>
			</Link>
		}

		{Boolean(userid) && 
			<Link to={`/profile/${userid}`} onClick={h_btnClick}>
				<BtnTab>Profile</BtnTab>			
			</Link>
		}
		
		<Link to={userid ? '/' : '/login'} onClick={h_btnClick}>
			<BtnTab 
				onClick={h_logOut}
			>{userid ? 'Log out' : 'Log in'}</BtnTab>	
		</Link>

		<Link to='/about' onClick={h_btnClick}>
		<BtnTab>About</BtnTab>		
		</Link>

		{/* search buttons on narrowWindow */}
		{ window.nrw &&
			<div className='searchContainer'>
				<BtnTab 
					onClick={h_dropDown}
				>Search</BtnTab>
			</div>
		}

		{/* search bar on wide window */}
		{ !window.nrw &&
			<div className='wideWinowSearchBox'>
				<SearchBox s_isDspSearchBox={s_isDspSearchBox}/>
			</div>
		}

	</div>

	{/* search bar on narrowWindow */}
	{ (s_isDspSearchBox[0] && window.nrw) && (
		<div className='dropDownNav'>
			<SearchBox s_isDspSearchBox={s_isDspSearchBox}/>
		</div>
	)}
	
	</>);
}
export default Nav;
