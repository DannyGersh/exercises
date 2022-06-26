import "./styles.css";
import CSRFToken from "./csrftoken";
import DropDownNav from "./DropDownNav";
import { useState } from "react";

function Nav(props) {
  let [dropDownActive, setDropDownActive] = useState(false);
  function dropDownHandler() {
    setDropDownActive(!dropDownActive);
  }

  if (!props.narrowWindow) {
    return (
      <div>
        <div className="nav1">
          <button className='btn'>Home</button>
          <button className='btn'>New</button>
          <button className='btn'>Browse</button>

          <div className='searchContainer'>
            <form action="/endpoint/" method="post">
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
          <button>Home</button>
          <button>New</button>
          <button>Browse</button>

          <div>
            <button onClick={dropDownHandler}>
              poop
            </button>

          </div>
        </div>

		{dropDownActive && (
          <div>
            <form action="/endpoint/" method="post">
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
