 import './styles.css'
 
 function DropDownNav(){
     let dropDownActive = false;
     function setDropDownActive(){
        dropDownActive = !dropDownActive;
        console.log(dropDownActive);
     }
     if(dropDownActive) { return(
        <button>dropDown</button>
     )} else { return(
        <button>dropDown</button>
     )}

 }
 export default DropDownNav;