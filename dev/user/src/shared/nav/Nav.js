import "./Nav.css";
import CSRFToken from "../csrftoken";
import { useState, useRef } from "react";
import BtnMenue from '../buttons/BtnMenue'

function Nav(props) {
  
  let myevent = new Event('myevent', {
    bubbles: true,
    cancelable: true,
    composed: false
  })
  
  let [dropDownActive, setDropDownActive] = useState(false);
  function dropDownHandler() {
    setDropDownActive(!dropDownActive);
	window.dispatchEvent(myevent);
  }
  
  //window.addEventListener("myevent", ()=>{console.log("NAAAV")})
  
  if (!props.narrowWindow) {
    return (
      <div>
        <div className="nav">
          <BtnMenue>Home</BtnMenue>
          <BtnMenue>New</BtnMenue>
          <BtnMenue>Browse</BtnMenue>

          <div className='searchContainer'>
            <form className='nav' action="/browse/" method="post">
              <CSRFToken />
              <button className='searchBtn' type="submit"></button>
			        <input className='searchText' type="text" name="browse" />
            </form>
          </div>
        </div>

      </div>
    );
  } else {
    return (
      <div>
        <div className="nav">
          <BtnMenue>Home</BtnMenue>
          <BtnMenue>New</BtnMenue>
          <BtnMenue>Browse</BtnMenue>

          <div className='searchContainer'>
            <BtnMenue onClick={dropDownHandler}>
              Search
            </BtnMenue>

          </div>
        </div>

		{dropDownActive && (
          <div>
            <form className='nav' action="/browse/" method="post">
              <CSRFToken />
              <button className='searchBtn' type="submit"></button>
			        <input className='searchText' type="text" name="browse" />
            </form>
          </div>
        )}
      </div>
    );
  }
}
export default Nav;
