import {useState} from 'react'


window.is_debug = (process.env.NODE_ENV === 'development')
window.isdebug = false

// window.is_debug == true - for npm start development
// window.isdebug == false - for final production stage
				
export function compArr(arr1, arr2) {
		return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function useWindowResize(){
	let WidthHeightRatio = 1.1;
  const [narrowWindow, setNarrowWindow] = useState(
      (window.innerWidth / window.innerHeight < WidthHeightRatio)
      ? true : false
  );
  
  function windowResizeHandler(){
    const w = window.innerWidth;
  	const h = window.innerHeight;

    if( w / h < WidthHeightRatio ){
  		setNarrowWindow(true);
  	} else {
  		setNarrowWindow(false);
  	}
  }

  window.addEventListener('resize', windowResizeHandler);
  return narrowWindow;
}
export default useWindowResize;

function remToPx(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
export {remToPx};
	


// getCookie
function replacer(match, p1, p2, p3, offset, string) {
  return p2;
}
function trim(str) {
  return str.replace(/(\s*)(.+?)(\s*)$/g, replacer);
}
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      //var cookie = jQuery.trim(cookies[i]);
      var cookie = trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
export {getCookie}


function sendData(url, data) {
	return fetch(url, { 
		method: "POST", 
		credentials: 'same-origin',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json', 
			"X-CSRFToken": getCookie("csrftoken"),
			},
	})
}
export {sendData}


function mainText2html(identifier_exercise, chalange, formFile_latex, target) {
	
	/* explanation:
		
		replaces latex expressions in text to image tags (svg)
		
		1)	identifier_exercise - a long number (string)
				of the directorie name that contains the exercise svg's.
		
		2)	chalange - the chalange data structure as given by django
	
		3)	formFile_latex - the content of the .json file inside identifier_exercise dir
		
		4)	target - one of ['title','exercise','answer','hints','explain']
	
	*/
	
	// TODO - add database of errors and add this to it if cant load latex
	const reg_latex = /(\$\$___latex\$\$|___ERROR___)/
	let textList = chalange[target].split(reg_latex)
	textList = textList.filter(i=>i!=='')
	
	let index = 0;
	for(let i=0 ; i<textList.length ; i++) {
		if(textList[i] === '$$___latex$$') {
			
			try {
				const tempLatex = formFile_latex[target][index][1]; // TODO - workeround here, needs fixin 
				const tempId = chalange['author'];
				const tempPath = ['/static/users', tempId, identifier_exercise, tempLatex+'.svg'].join('/')
				textList[i] = '<img style="overflow-x: scroll;" src="'+tempPath+'" />'
			}
			catch{
				console.log('WARNING: probably index out of range ... ( list_latex[target][index][?] ) ');
			}
			index++;
		}
	}
	return textList.join('');
}
export {mainText2html}








