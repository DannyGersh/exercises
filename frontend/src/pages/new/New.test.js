import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BrowserRouter} from "react-router-dom";
import New from './New';

describe('NewPage', ()=> {
	
	test('default', () => {});
	window.userId = [0, ()=>{}]; // fake userId state
	
	test('when "exercise" tab is selected', async () => {
		
		let text = null;
		let btn = null;
		render(<New/>, {wrapper: BrowserRouter});
		
		btn = screen.getByRole('button', {name: 'Exercise'});
		userEvent.click(btn);
		
		text = await screen.findByLabelText(/tags/i);
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText(/latex package/i);
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText(/title/i);
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText(/exercise_bodie/i);
		expect(text).toBeInTheDocument();
		text = screen.getByLabelText(/answer/i);
		expect(text).toBeInTheDocument();
	});
	
	test('when "hints" tab is selected', () => {
		
		let text = null;
		let btn = null;
		render(<New/>, {wrapper: BrowserRouter});
		
		btn = screen.getByRole('button', {name: 'Hints'});
		userEvent.click(btn);
		
		text = screen.getByLabelText(/hints bodie/i);
		expect(text).toBeInTheDocument();
	});
	
	test('when "explain" tab is selected', () => {
		
		let text = null;
		let btn = null;
		render(<New/>, {wrapper: BrowserRouter});
		
		btn = screen.getByRole('button', {name: 'Explanation'});
		userEvent.click(btn);
		
		text = screen.getByLabelText(/explanation bodie/i);
		expect(text).toBeInTheDocument();
	});

});
