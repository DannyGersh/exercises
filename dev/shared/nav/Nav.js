import "./Nav.css";
import CSRFToken from "../csrftoken";
import { useState } from "react";
import BtnMenue from '../buttons/BtnMenue'
import Login from '../login/Login'


function Nav(props) {
  
  let [dropDownActive, setDropDownActive] = useState(false);

  // this nav comes with a dropdown event
  // which is triggered when search button is clicked.
  // to capture the event:
  // window.addEventListener("myevent", func)
  // to get bool var indicating dropdown state:
  // window.addEventListener("myevent", (e)=>e.detail.isDropedDown);
  
  let myevent = new CustomEvent('navDropDown', {
    detail: {'isDropedDown': !dropDownActive},
    bubbles: true,
    cancelable: true,
    composed: false
  })
  
  function dropDownHandler() {
    setDropDownActive(!dropDownActive);
    // set timeout prevents asincroneus dispatching of the event
    setTimeout(() => 
      window.dispatchEvent(myevent)
    );
  }

  //window.addEventListener("myevent", ()=>{console.log("NAAAV")})
  
  console.log(window.jsonData['signInFailure']);
  
  const [dspLogin, setDspLogin] = useState(window.jsonData['signInFailure']);
  
  if (!props.narrowWindow) {
    return ( <>
        <div className="nav">
          
          {/* menue buttons */}
          <BtnMenue>Home</BtnMenue>
          <BtnMenue>New</BtnMenue>
          <BtnMenue onClick={() => setDspLogin(!dspLogin)}>Log In</BtnMenue>

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
      { dspLogin && <Login currentPage={props.currentPage}/> }
    
    </> );
    
  } else {
    return (
      <div>
      
        <div className="nav">
        
          {/* menue buttons */}
          <BtnMenue>Home</BtnMenue>
          <BtnMenue>New</BtnMenue>
          <BtnMenue onClick={() => setDspLogin(!dspLogin)}>Log In</BtnMenue>
          
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
      { dspLogin && <Login currentPage={props.currentPage}/> }
	  
      </div>
    );
  }
}
export default Nav;
