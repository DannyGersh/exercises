import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {msg} from '../../shared/Messages'
import * as CON from '../../shared/Functions'
import Register from './Register';

describe('Register', ()=> {
	
	test('default', () => {});
	window.userId = [0, ()=>{}]; // fake userId state
	
	test('login', ()=>{
		
		render(<Register target='login'/>, {wrapper: BrowserRouter});

		let text = null;
		let btn = null;
		
		text = screen.getByLabelText(/Display name:/i);
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText(/Password/i);
		expect(text).toBeInTheDocument();
	})
	
	test('signup basic', ()=>{
		render(<Register target='signup'/>, {wrapper: BrowserRouter});
		let text = null;
		text = screen.getByLabelText(/Display name:/i);
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText(/Email/i);
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText('Password:', {exact: true});
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText(/Verify password/i);
		expect(text).toBeInTheDocument();
		
	});
	
	test('signup inputs', ()=>{
		
		render(<Register target='signup'/>, {wrapper: BrowserRouter});

		const btn = screen.getByRole('button', {name: 'Sign up'});
		const radio_confirm = screen.getByLabelText(/I have read and agreed/i);
		const input_uname = screen.getByTestId('id_input_uname');
		const input_email = screen.getByTestId('id_input_email');
		const input_password = screen.getByTestId('id_input_password');
		const input_ver_password = screen.getByTestId('id_input_ver_password');
		const input_radio_conditions = screen.getByTestId('id_input_radio_conditions');

		const msg1 = msg.input_not_valid;
		window.alert = (in_msg)=>{
			expect(in_msg).toBe(msg.input_not_valid);
		};
		// all inputs are blanck
		userEvent.click(btn);
		
		function validateInputs(uname, email, password, v_password, func) {
			window.alert = func;
			window.confirm = func;

			fireEvent.change(input_uname, {target: {value: uname}});		
			fireEvent.change(input_email, {target: {value: email}});
			fireEvent.change(input_password, {target: {value: password}});		
			fireEvent.change(input_ver_password, {target: {value: v_password}});
			userEvent.click(btn);
		}
		
		// uname too short
		validateInputs(
			'X'.repeat(CON.MIN_UNAME_LEN-1), 
			'default@gmail.com', 'aA123123', 
			'aA123123', 
			(in_msg)=>expect(in_msg).toBe(msg.uname_short)
		);
		// uname to long
		validateInputs(
			'X'.repeat(CON.MAX_UNAME_LEN+1), 
			'default@gmail.com', 
			'aA123123', 
			'aA123123', 
			(in_msg)=>expect(in_msg).toBe(msg.uname_long)
		);
		// invalid email
		validateInputs(
			'uname', 
			'X', 
			'aA123123', 
			'aA123123', 
			(in_msg)=>expect(in_msg).toBe(msg.valid_email)
		);
		//pass to short
		validateInputs(
			'uname', 
			'default@gmail.com', 
			'X'.repeat(CON.MIN_PASS_LEN-1), 
			'X'.repeat(CON.MIN_PASS_LEN-1), 
			(in_msg)=>expect(in_msg).toBe(msg.pass_short)
		);
		//pass too long
		validateInputs(
			'uname', 
			'default@gmail.com', 
			'X'.repeat(CON.MAX_PASS_LEN+1), 
			'X'.repeat(CON.MAX_PASS_LEN+1), 
			(in_msg)=>expect(in_msg).toBe(msg.pass_long)
		);
		// pass dont match
		validateInputs(
			'uname', 
			'default@gmail.com', 
			'X'.repeat(CON.MAX_PASS_LEN+1), 
			'Y'.repeat(CON.MAX_PASS_LEN+1), 
			(in_msg)=>expect(in_msg).toBe(msg.pass_mismatch)
		);
		// pass not valid
		validateInputs(
			'uname', 
			'default@gmail.com', 
			'X'.repeat(CON.MIN_PASS_LEN+1), 
			'X'.repeat(CON.MIN_PASS_LEN+1), 
			(in_msg)=>expect(in_msg).toBe(msg.valid_password)
		);
		validateInputs(
			'uname', 
			'default@gmail.com', 
			'xX'.repeat(CON.MIN_PASS_LEN+1), 
			'xX'.repeat(CON.MIN_PASS_LEN+1), 
			(in_msg)=>expect(in_msg).toBe(msg.valid_password)
		);
		// didn't read terms
		validateInputs(
			'uname', 
			'default@gmail.com', 
			'xX1xX1xX1', 
			'xX1xX1xX1', 
			(in_msg)=>expect(in_msg).toBe(msg.read_terms)
		);
		
		// confirm terms
		window.confirm = (in_msg)=>expect(in_msg).toBe(msg.no_pass_redoo);
		userEvent.click(radio_confirm);
		userEvent.click(btn);
	})
});
