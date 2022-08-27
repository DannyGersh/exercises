import Tag from '../../shared/tag/Tag'
import BtnMenue from '../../shared/buttons/BtnMenue'
import './Shared.css'
import {createRef, useEffect, useState} from 'react'
import {sendData} from '../../shared/Functions'

class Tags { // convenience class for localStorage manipulation
		
	get() {
		return JSON.parse(localStorage.getItem('tags'));
	}
	
	has(str) { 
		return this.get().includes(str);
	}
	
	add(str) {
		if(!this.has(str)) {
			localStorage.setItem('tags', JSON.stringify([...this.get(), str]) )
		}
	}
	
	set(newTagList) { // newTagList - [str1, str2, ...]
		localStorage.setItem('tags', JSON.stringify(newTagList));
	}
	
	rem(str) { 
		let temp = this.get();
		temp.splice(temp.indexOf(str), 1);
		this.set(temp);
	}
	
}
const tags = new Tags();


function TagsList(props){
		
	if(!tags.get()) { tags.set([]); }
	const availableTags = useState([...new Set(window.jsonData['tags'])]);
	
	const [dspTags, setDspTags] = useState(tags.get()); 
	const [dspAvailableTags, setDspAvailableTags] = useState(availableTags[0]); 
	const [dspAddBtn, setDspAddBtn] = useState(false);
	const isNewTag = useState(false)
	
	useEffect(()=>{
		let temp = availableTags[0];
		temp = temp.filter(i => !dspTags.includes(i));
		setDspAvailableTags(temp);
	},[])
	
	// NOTE - size and position id="available" acording to id='chosen'
	const refA = createRef(); // id='chosen' - get chosen location and size
  const refB = createRef(); // id='available' - set available location and size
  {
	function resizeAvailable(){
		try{ // raises errors when on different bottomMenue tab
			const r = refA.current.getBoundingClientRect();
			refB.current.style.top = String(r.y+r.height)+"px";
		} catch {};
	}
	useEffect(() => {
		window.addEventListener("resize", resizeAvailable);
		window.addEventListener("navDropDown", resizeAvailable);
  },[])
	useEffect(resizeAvailable , [dspTags, dspAvailableTags])
	}
	// NOTE

	const ref_input = createRef();
	
	const addmsg = 'You are about to submit a new tag to the website, make sure your tag is spelled corectly, does not contain foul language and is an academic discipline or field of study. proceed ?'
	function addmsgHandle(tag) {
		if(!window.is_debug) {
			if(!availableTags[0].includes(tag)) {
				if(window.confirm(addmsg)) {
					sendData(
						'http://localhost/addtag/', tag
					).then(
						()=>{window.alert('tag submited successfully'); window.location.reload();},
						()=>{window.alert('tag submited failed')}
					)
				}
			}
		}	else {
			console.log(tag)
		}
	} 

	// NOTE - filter by search term
	const [searchTerm, setSearchTerm] = useState('');
	
	function filterAvailable(str){
		let temp = [...availableTags[0]]; // deep copy required
		temp = temp.filter(i=> RegExp('^'+str).test(i));
		setDspAvailableTags(temp);

		temp.length ? isNewTag[1](false): isNewTag[1](true);
	}
	function onSearch(str){
		filterAvailable(str);
		setSearchTerm(str);
	}
	function addTag(str) {
		tags.add(str);
		!dspTags.includes(str) && setDspTags([...dspTags, str]);
		let temp = [...dspAvailableTags];
		temp.splice(temp.indexOf(str), 1);
		setDspAvailableTags(temp);
		props.state[1](tags.get());
	}
	function remTag(str) {
		tags.rem(str);
		setDspTags(tags.get());
		!dspAvailableTags.includes(str) && setDspAvailableTags([...dspAvailableTags, str]);
		props.setState(tags.get());
	}
	// NOTE
	
	return(
		<div className='Exercise'>

			<div style={{display:'flex', width: '100%'}}>
				<label>Search: </label>
				<input ref={ref_input} onChange={(e)=>onSearch(e.target.value)} id='search' style={{flexGrow:'1', marginLeft:'1rem', minWidth:'3rem'}} type="text"/>
					{isNewTag[0] && <BtnMenue type='button' onClick={(e)=>addmsgHandle(ref_input.current.value)}>submit new tag</BtnMenue>}
			</div>

			<div id='chosen' ref={refA}>
				<p>Your chosen tags:</p>
				{
					dspTags.map(i => <Tag className='hoverRed' onClick={(e)=>remTag(e.target.innerHTML)} key={i}>{i}</Tag>)
				}
				<hr/>
			</div>
			
			<div id="available" ref={refB} style={{width: 'calc(100% - 2rem)', position:'fixed', bottom:'4rem'}} >
				<p>Available:</p>
				<div style={{width: '100%', height:'calc(100% - 3rem)'}} className='hscroll'>
				{
					dspAvailableTags.map(i => <Tag className='hoverGreen' onClick={(e)=>addTag(e.target.innerHTML)} key={i}>{i}</Tag>)
				}
				</div>
			</div>
				
			</div>
	)
}
export default TagsList;
