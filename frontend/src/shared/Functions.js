import {useState, useRef} from 'react'
import StackTrace from 'stacktrace-js'
// window.is_debug == true - for "npm start" react development
// window.isdebug == false - for final production stage - site upload

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

async function getStackTrace() {

	let frames = await StackTrace.get()
    
    frames = frames.filter(e=>{
		return(
			!/react/g.test(e.fileName) && 
			!/index.js/g.test(e.fileName) &&
			!/webpack/g.test(e.fileName) &&
			!/bundle.js/g.test(e.fileName) &&
			!/node_modules/g.test(e.fileName)
		)
	})

	let res = [];
	for( const i of frames ) {
		res.push(`${i.fileName} ${i.lineNumber}`)
	}

	return res;
}

export {getStackTrace}

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
				
				getStackTrace()
				.then(result=>{
					const error = {
						url:res.url, 
						redirect:res.redirect, 
						status:res.status, 
						ok:res.ok, 
						statusText:res.statusText, 
						headers:res.headers, 
						body:res.json(), 
						bodyUsed:res.bodyUsed,	
						description: 'failed to fetch'							
					}
					const fin = {
						type:res.type,
						error: JSON.stringify(error),
						stackTrace: JSON.stringify(result)
					}
					sendData('fetch/submitErrorSql', 'POST', fin)
				})		
    			throw(res)
			}
		})
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

function uploadError(type, error) {

	getStackTrace()
	.then(st=>{
		sendData('fetch/submitErrorSql', 'POST', {
			'type': type,
			'error': error,
			'stackTrace': JSON.stringify(st)
		})
	})
}
export {uploadError}

function mainText2html(exercise, target) {

	const reg_latex = /(\$\$\d+\$\$)/gms
	let textList = exercise[target].split(reg_latex)
	textList = textList.filter(i=>i!=='')

	for(let i=0 ; i<textList.length ; i++) {
		if(reg_latex.test(textList[i])) {

			const index = textList[i].match(/\d+/gms)[0]
			const path = [
				'http://localhost/static/users', 
				exercise['author'],
				exercise['latex_dir'],
				target,
				index
			].join('/')
			textList[i] = `<img src="${path}.svg">`
		}
	}
	return textList.join('');
}
export {mainText2html};


function useController(val) {
	
	const ref = useRef(val);
	const callbacks = {};
	
	function getRef() {
		return ref.current;
	}
	
	function setRef(val) {
		ref.current = val;
		for (let key in callbacks) {
			callbacks[key] && callbacks[key]();
		}
	}
	
	function addCallback(identifier, func) {
		callbacks[identifier] = func;
	}
	
	return [getRef, setRef, addCallback, callbacks];
}
export {useController};

