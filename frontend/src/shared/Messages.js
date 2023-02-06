
function cut_newlines(in_str) {
	return in_str.replace('\n', '');
}
export default cut_newlines;

const message_confirm_password = cut_newlines(`
for this beta release, 
there is no password restore, 
if you lose your password, 
you lose it for good. 
continue ?
`)
export {message_confirm_password};

const msg = {
	input_not_valid: 'make sure all fields are valid',
	uname_not_valid: 'make sure display name is valid',
}
export {msg}
