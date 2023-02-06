import {useEffect} from 'react'
import StackTrace from 'stacktrace-js'

window.isDebug = true;
window.url_base = window.isDebug ? 'http://localhost/' : 'https://www.ididthisforu.com/';

/*
WINBP: 
	window break point
	defines the window width in rem,
	at which the app changes from
	narrow display mode to wide.

MIN_PAGINATION:
	minimal number of elements 
	displayed at one tyme.

REG_NEW_LINE:
	regex for detekting new lines.

MIN_PASS_LEN:
	minimal possible number of 
	charakters for password

MAX_PASS_LEN:
	maximal possible number of 
	charakters for password
*/
const WINBP = 50;
const MIN_PAGINATION = 8; // minimal number of displayed exercises
const REG_NEW_LINE = /(\r\n|\n|\r|\t)/gm;
const MIN_PASS_LEN = 8;
const MAX_PASS_LEN = 25;
const MIN_UNAME_LEN = 3;
const MAX_UNAME_LEN = 20;
export {
	WINBP,
	MIN_PASS_LEN, 
	MAX_PASS_LEN,
	MIN_UNAME_LEN,
	MAX_UNAME_LEN,
	MIN_PAGINATION, 
	REG_NEW_LINE
}

const TARGETS = {
	title: 'title',
	exercise: 'exercise',
	answer: 'answer',
	hints: 'hints',
	explain: 'explain',
}
export {TARGETS}

function isInt(num) {
	if(typeof(num) !== 'number') {
		return false;
	} else if(num*10%10 !== 0) {
		return false;
	} else {
		return true;
	}
}
export {isInt}

export function compArr(arr1, arr2) {
	return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function px2rem(px) {
	return 0.0625 * px;
}
export {px2rem};

function remToPx(rem) {
	const fontSize = getComputedStyle(
		document.documentElement
	).fontSize;
	return rem * parseFloat(fontSize);
}
export {remToPx};

function isEmail(email) {
  return Boolean(String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ));
}
export {isEmail};

function useWindowResize(s_render){

	// on resize event, the entire app rerenders,
	// so isNarrow gets recalculated
	
	const isNarrow = px2rem(window.innerWidth) < WINBP;

	useEffect(()=>{
		window.addEventListener('resize', ()=>{
			s_render[1](!s_render[0])
		});
	}, [])
	
	return isNarrow;
}
export default useWindowResize;

// getCookie
function replacer(match, p1, p2) {
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
				cookieValue = decodeURIComponent(
					cookie.substring(name.length + 1)
				);
				break;
			}
		}
	}
	return cookieValue;
}
export {getCookie};


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

async function raw_sendData(url, methode='GET', data={} ) {

	if(url[0] === '/') {
		url = url.slice(1,url.length)
	}
	if(url[url.length-1] !== '/') {
		url += '/'
	}

	url = window.url_base + url;

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
				'X-Requested-With': 'XMLHttpRequest', 
				//Necessary to work with request.is_ajax()
			},
		})
	}

}
export {raw_sendData};

async function sendData(url, methode='GET', data={}){

	// send data to server

	// args:
	// url - string
	// methode - "GET or "POST"
	// data - object to send

	// return: promise, resolves to object

	return raw_sendData(url, methode, data)

		// client side
		.then(res=>{
			const test123 = res.json()
			return test123
			.then(fin=>{
				if(res['status']===200) {
					return new Promise(function(resolve) {
						resolve(test123)
					})
				} else if(res['status']===202){
					window.alert(Object.values(fin)[0])
					return new Promise(function(resolve) {
						resolve({})
					})
				} else {
					
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
							description: 
								'failed to fetch, status != 200',						
							stackTrace: JSON.stringify(result),
						}
						const fin = {
							type:res.type,
							error: JSON.stringify(error),
							stackTrace: JSON.stringify(result)
						}
						sendData('fetch/submitErrorSql', 'POST', fin)
						window.alert('an error has accurred ...');
					})		
					throw(res)
				}	
			})
		})
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
	throw(error);
}
export {uploadError}

function mainText2html(exercise, target, isEdit=false) {

	const reg_latex = /(\$\$\d+\$\$)/gms
	let textList = exercise[target].split(reg_latex)
	textList = textList.filter(i=>i!=='')
	
	// guarantee image uniqueness
	const timeStamp = new Date().getTime();
	
	for(let i=0 ; i<textList.length ; i++) {
		
		if(reg_latex.test(textList[i])) {

			const index = textList[i].match(/\d+/gms)[0]

			if(!isEdit) {
				const path = [
					window.url_base,
					'static/users', 
					exercise['author'],
					exercise['latex_dir'],
					target,
					index
				].join('/')
				textList[i] = `<img 
					style="max-width: 100%; vertical-align: middle;" 
					src="${path}.svg?t=${timeStamp}"
				>`
			} else {
				const inner = exercise[`latex_${target}`][index];
				textList[i] = `$$${inner}$$`;
			}
		}
	}
	return textList.join('');
}
export {mainText2html};







