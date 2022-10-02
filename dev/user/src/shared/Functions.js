import {useState} from 'react'

// window.is_debug == true - for "npm start" react development
// window.isdebug == false - for final production stage - site upload

window.is_debug = (process.env.NODE_ENV === 'development')
window.isdebug = true

/*
windowBp - window break point
defines the window width in rem,
at which the app changes from
narrow display mode to wide.
*/
const windowBp = 50;
		
export function compArr(arr1, arr2) {
		return JSON.stringify(arr1) === JSON.stringify(arr2);
}


function px2rem(px) {
	return 0.0625 * px;
}
export {px2rem};

function remToPx(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
export {remToPx};

	
function useWindowResize(){

	const [narrowWindow, setNarrowWindow] = useState(
      ( px2rem(window.innerWidth) < windowBp )
      ? true : false
  );
	
	function windowResizeHandler(){
    const w = px2rem(window.innerWidth);

    if( w  < windowBp ){
  		setNarrowWindow(true);
  	} else {
  		setNarrowWindow(false);
  	}
  }
	
	window.addEventListener('resize', windowResizeHandler);
  return narrowWindow;
}
export default useWindowResize;


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
export {getCookie};

//'http://www.ididthisforu.com/test/': 'http://localhost/test/'
async function sendData(url, data, methode='POST') {
	
	if(url[0] === '/') {
		url = url.slice(1,url.length)
	}
	if(url[url.length-1] !== '/') {
		url += '/'
	}
	
	if(window.isdebug) {
		url = 'http://localhost/' + url
	} else {
		url = 'https://www.ididthisforu.com/' + url
	}
	
	if(methode==='POST') {	
		return await fetch(url, { 
			method: methode, 
			credentials: 'same-origin',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json', 
				"X-CSRFToken": getCookie("csrftoken"),
				},
		})
	} else if(methode==='GET') {
		return await fetch(url, {
    	headers:{
     	   'Accept': 'application/json',
    	    'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
    	},
		})
	}

}
export {sendData};



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
				textList[i] = '<img style="max-width: calc(100% - .3rem)" src="'+tempPath+'" />'
			}
			catch{
				console.log('WARNING: probably index out of range ... ( list_latex[target][index][?] ) ');
			}
			index++;
		}
	}
	return textList.join('');
}
export {mainText2html};











async function TsendData(
	url, data,
	onSuccess=null, onError=null, 
	on404err=null) {
	
	// send data to server and receive response

	// onSuccess, onError are function callbacks
	// onError args - str representing error.
	// onSuccess args - object defined by the server.
	// see urls.py for the object definition.

	// url must be a valide url path on the server.
	// otherwise 404 (Not Found)

	// server responsibillity:
	// must return as response on of the following:
	// {error: str} on error
	// {data: structure} on success

	try {
		sendData(url, data)
		.then((response) => { 
			if(response['status']==404) {
				if(on404err) {
					on404err()
				} else {
					var stack = new Error().stack;
					window.alert('an error has occurred (404), consider reporting at the contact page.\n'+stack)
				}
			}
			return response.json()
		})
		.then((data) => {
			console.log(data)
			if(data['error']) { // server error		

				if(onError){ // user defined callback
					onError(data['error']);
				} else { // default
					window.alert('an error has occurred on the server, consider reporting at the contact page.\n'+data['error']);
				}

			} else { // server success

				if(onSuccess) { // user defined callback
					onSuccess(data['data']);
				}

			}
		});
	} catch (error) {
		console.error(error);
	}
}
export {TsendData};














