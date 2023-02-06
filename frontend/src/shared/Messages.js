
function cut_newlines(in_str) {
	return in_str.replace('\n', '');
}
export default cut_newlines;

const msg = {
	
	no_pass_redoo: 
		'for this beta release, ' +
		'there is no password restore, ' +
		'if you lose your password, ' +
		' you lose it for good. '+
		'continue ?'
	,
	
	input_not_valid: 'make sure all fields are valid',
	uname_not_valid: 'make sure display name is valid',
	uname_short: 'user name to short',
	uname_long: 'user name too long',
	valid_password: 'make sure password is valid.',
	valid_email: 'make sure email is valid.',
	pass_mismatch: 'password does not match verify password',
	pass_short: 'password too short',
	pass_long: 'password too long',
	read_terms: 'please read the terms and conditions.',
	ver_human: 'make sure that you are human.',
}
export {msg}
