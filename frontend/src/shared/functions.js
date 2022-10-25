import {useState} from 'react'

// window.is_debug == true - for "npm start" react development
// window.isdebug == false - for final production stage - site upload

window.is_debug = (process.env.NODE_ENV === 'development')
window.isdebug = false

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

const narrowWindow = useState(
	( px2rem(window.innerWidth) < windowBp )
	? true : false
);

function windowResizeHandler(){
	const w = px2rem(window.innerWidth);

	if( w  < windowBp ){
		narrowWindow[1](true);
	} else {
	narrowWindow[1](false);
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
async function raw_sendData(url, methode='GET', data={} ) {

	if(url[0] === '/') {
		url = url.slice(1,url.length)
	}
	if(url[url.length-1] !== '/') {
		url += '/'
	}

	if(window.isdebug) {
		url = 'http://localhost/' + url
	} else {
		//url = 'https://www.ididthisforu.com/' + url
		url = 'http://localhost/' + url
	}

	if(methode==='POST') {
		//throw(getCookie("csrftoken"))
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
export {raw_sendData};

async function sendData(url, methode='GET', data={}){

	// send data to server

	// args:
	// url - string
	// data - object to send

	// return: promise, resolves to object

	return raw_sendData(url, methode, data)

		// client side
		.then((res)=>{
			if(res['status']===200) {
				return new Promise(function(resolve, reject) {
					resolve(res.json())
				})
			} else {
				window.alert('an error has accurred ...');
				throw(res)
			}
		})
		// server side
		.then((data)=>{
			// here, error is not nesseseraly software failure
			// it could be username not unique for example
			if(data['error']) {
				window.alert(data['error'])
			} else {
				return new Promise(function(resolve, reject) {
					resolve(data)
				})
			}
		});
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



