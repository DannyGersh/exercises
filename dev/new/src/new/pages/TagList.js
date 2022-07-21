import Tag from '../../shared/tag/Tag'
import './Shared.css'
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
	let availableTags = window.jsonData['tags'];

	const [dspTags, setDspTags] = useState(tags.get()); 
	const [dspAvailableTags, setDspAvailableTags] = useState(availableTags); 
	const [dspAddBtn, setDspAddBtn] = useState(false);
	
	// insures no duplicates between chosen and available
	availableTags.forEach((str)=>{
		dspTags.includes(str) && 
		availableTags.splice(availableTags.indexOf(str), 1)
	});

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
	useEffect(resizeAvailable , [dspTags])
	}
	// NOTE

	// NOTE - filter by search term
	const [searchTerm, setSearchTerm] = useState('');
	
	function filterAvailable(str){
		let temp = [...availableTags]; // deep copy required
		temp = temp.filter(i=> RegExp('^'+str).test(i));
		setDspAvailableTags(temp);
	}
	function onSearch(str){
		filterAvailable(str);
		setSearchTerm(str);
	}
	function addTag(str) {
		tags.add(str); // localStorage
		setDspTags(tags.get()) // display
		props.setState(tags.get()); // updates in New.js
		availableTags.splice(availableTags.indexOf(str), 1); // remove from available display
		filterAvailable(searchTerm);
	}
	function remTag(str) {
		tags.rem(str); // localStorage
		setDspTags(tags.get()) // display
		props.setState(tags.get()); // updates in New.js
		availableTags.push(str); // add to available display
		filterAvailable(searchTerm);
	}
	// NOTE
	
	return(
		<div className='Exercise'>
			
			<div style={{display:'flex', width: '100%'}}>
				<label>Search: </label>
				<input onChange={(e)=>onSearch(e.target.value)}id='search' style={{flexGrow:'1', marginLeft:'1rem', minWidth:'3rem'}} type="text"/>
					{ dspAddBtn && <button type='button'>+</button> }
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
