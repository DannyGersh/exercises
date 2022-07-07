import "./styles.css";
import CSRFToken from "./csrftoken";
import { useState } from "react";
import BtnMenue from './buttons/BtnMenue'

function Nav(props) {
  let [dropDownActive, setDropDownActive] = useState(false);
  function dropDownHandler() {
    setDropDownActive(!dropDownActive);
  }

  if (!props.narrowWindow) {
    return (
      <div>
        <div className="nav1">
          <BtnMenue>Home</BtnMenue>
          <BtnMenue>New</BtnMenue>
          <BtnMenue>Browse</BtnMenue>

          <div className='searchContainer'>
            <form className='nav1' action="/browse/" method="post">
              <CSRFToken />
              <button className='searchBtn' type="submit"></button>
			        <input className='searchText1' type="text" name="browse" />
            </form>
          </div>
        </div>

      </div>
    );
  } else {
    return (
      <div>
        <div className="nav1">
          <button className='btn'>Home</button>
          <button className='btn'>New</button>
          <button className='btn'>Browse</button>

          <div className='searchContainer'>
            <button className='btn' onClick={dropDownHandler}>
              Search
            </button>

          </div>
        </div>

		{dropDownActive && (
          <div>
            <form className='nav1' action="/browse/" method="post">
              <CSRFToken />
              <button className='searchBtn' type="submit"></button>
			        <input className='searchText1' type="text" name="browse" />
            </form>
          </div>
        )}
      </div>
    );
  }
}
export default Nav;
