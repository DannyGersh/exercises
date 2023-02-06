import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BrowserRouter} from "react-router-dom";
import {msg} from '../../shared/Messages'
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
	
	test('signup', ()=>{
		
		render(<Register target='signup'/>, {wrapper: BrowserRouter});

		let text = null;
		let btn = null;

		text = screen.getByLabelText(/Display name:/i);
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText(/Email/i);
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText('Password:', {exact: true});
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText(/Verify password/i);
		expect(text).toBeInTheDocument();
		
		btn = screen.getByRole('button', {name: 'Sign up'});
		const msg1 = msg.input_not_valid;
		window.alert = (msg)=>{
			expect(msg).toBe(msg1);
		};
		userEvent.click(btn);
	})
});
