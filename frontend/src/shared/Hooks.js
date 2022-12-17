import {useRef} from 'react'


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
export default useController;
