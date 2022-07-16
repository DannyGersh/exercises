import "./Nav.css";
import CSRFToken from "../csrftoken";
import { useState } from "react";
import BtnMenue from '../buttons/BtnMenue'
import Login from '../login/Login'


function Nav(props) {

	// props:
	// narrowWindow - true if window is narrow
  // currentPage - string of current page
  // signInFailure - true if user failer at sign in\up
  // isSignUp - true signup menue should be displaid
	// isAuth - true if user is authenticated
  // userid = user id
	
  // this nav comes with a dropdown event
  // which is triggered when search button is clicked.
  // to capture the event:
  // window.addEventListener("navDropDown", func)
  // to get bool var indicating dropdown state:
  // window.addEventListener("navDropDown", (e)=>e.detail.isDropedDown);

	// dropDownActive - true if nav searchBar is expended
  const [dropDownActive, setDropDownActive] = useState(false);
	
  // nav dropDown event
  const navDropDown = new CustomEvent('navDropDown', {
    detail: {'isDropedDown': !dropDownActive},
    bubbles: true,
    cancelable: true,
    composed: false
  })
  
	// dispatch event on searchBar button click
  function dropDownHandler() {
    setDropDownActive(!dropDownActive);
    // set timeout prevents asincroneus dispatching of the event
    setTimeout(() => 
      window.dispatchEvent(navDropDown)
    );
  }

	// dspLogin - true if login menue should be displayed
  const [dspLogin, setDspLogin] = useState(window.jsonData['signInFailure']);
  function LogInHandle(){
		setDspLogin(!dspLogin);
		// when user clicks, he gets default login menue 
		// window.jsonData['signInFailure'] = false;
		// window.jsonData['isSignUp'] = false;
	}
	function LogOutHandle(){
		window.location = '../../../../../../../../logout/';
	}
	function profileHandle(){
		window.location = '../../../../../../../../user/' + String(props.userid);
	}
	
  if (!props.narrowWindow) {
    return ( 
			<>
			
        <div className="nav">
          
          {/* menue buttons */}
          <BtnMenue>Home</BtnMenue>
          <BtnMenue>New</BtnMenue>
					{ props.isAuth && <BtnMenue onClick={profileHandle} >Profile</BtnMenue> }
          <BtnMenue onClick={ props.isAuth ? LogOutHandle: LogInHandle }>{props.isAuth ? 'Log out': 'Log in'}</BtnMenue>

          {/* search bar */}
          <div className='searchContainer'>
            <form className='nav' action="/browse/" method="post">
              { process.env.NODE_ENV !== 'development' && <CSRFToken /> }
              <button className='searchBtn' type="submit"></button>
              <input className='searchText' type="text" name="browse" />
            </form>
          </div>
		  
        </div>
      
			
				{/* log in window */}
				{ dspLogin && 
					<Login 
						signInFailure={window.jsonData['signInFailure']} 
						isSignUp={window.jsonData['isSignUp']} 
						currentPage={props.currentPage}
					/> 
				}
    
    </> 
		);
    
  } else {
    return (
			// narriw window, search bar is replaced with search button that expands search bar
			<>

        <div className="nav">
        
          {/* menue buttons */}
          <BtnMenue>Home</BtnMenue>
          <BtnMenue>New</BtnMenue>
					{ props.isAuth && <BtnMenue>Profile</BtnMenue> }
          <BtnMenue onClick={props.isAuth ? LogOutHandle: LogInHandle}>{props.isAuth ? 'Log out': 'Log in'}</BtnMenue>
          
          {/* button for expending search bar */}
          <div className='searchContainer'>
            <BtnMenue onClick={dropDownHandler}>
              Search
            </BtnMenue>
          </div>
					
        </div>
      
			
				{/* conditionally display search bar */}
				{dropDownActive && (
					<div>
						<form className='nav' action="/browse/" method="post">
							{ process.env.NODE_ENV !== 'development' && <CSRFToken /> }
							<button className='searchBtn' type="submit"></button>
							<input className='searchText' type="text" name="browse" />
						</form>
					</div>
				)}
		
				{/* log in window */}
				{ dspLogin && 
					<Login 
						signInFailure={window.jsonData['signInFailure']} 
						isSignUp={window.jsonData['isSignUp']} 
						currentPage={props.currentPage}
					/> 
				}
				
      </>
    );
  }

}
export default Nav;
