import Tag from '../../shared/tag/Tag'
import {createRef, useEffect, useState} from 'react'

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
	
	localStorage.setItem('bmt', 'Tags');
	
	if(!tags.get()) { tags.set([]); }
	let initAvailableTags = window.jsonData['tags']; // structure: [ [id1,name1], [id2,name2], ... ] 

	const [dspTags, setDspTags] = useState(tags.get()); 
	const [dspInitTags, setDspInitTags] = useState(initAvailableTags); 
	const [dspAddBtn, setDspAddBtn] = useState(false);
	
	// NOTE - size and position id="available" acording to id='chosen'
	const refA = createRef(); // id='chosen'
  const refB = createRef(); // id='available'
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
	useEffect(resizeAvailable , [dspTags])
	}
	// NOTE

	function addTag(str) {
		tags.add(str);
		setDspTags(tags.get())
		props.setState(tags.get()); // updates in New.js
	}
	function remTag(str) {
		tags.rem(str);
		setDspTags(tags.get())
		props.setState(tags.get()); // updates in New.js
	}
	
	return(
		<div className='Exercise'>
			
			<div style={{display:'flex', width: '100%'}}>
				<label>Search: </label>
				<input id='search' style={{flexGrow:'1', marginLeft:'1rem', minWidth:'3rem'}} type="text"/>
					{ dspAddBtn && <button type='button'>+</button> }
			</div>

			<div id='chosen' ref={refA}>
				<p>Your chosen tags:</p>
				{
					dspTags.map(i => <Tag onClick={(e)=>remTag(e.target.innerHTML)} key={i}>{i}</Tag>)
				}
				<hr/>
			</div>
			
			<div id="available" ref={refB} style={{width: 'calc(100% - 2rem)', position:'fixed', bottom:'4rem'}} >
				<p>Available:</p>
				<div style={{width: '100%', height:'calc(100% - 3rem)'}} className='hscroll'>
				{
					dspInitTags.map(i => <Tag onClick={(e)=>addTag(e.target.innerHTML)} key={i}>{i}</Tag>)
				}
				</div>
			</div>
				
			</div>
	)
}
export default TagsList;
