import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BrowserRouter} from "react-router-dom";
import Home from './Home';

describe('HomePage', ()=> {
	
	test('default', () => {});
	window.userId = [0, ()=>{}]; // fake userId state
	
	test('things that must be present in home page', () => {
		
		render(<Home/>, {wrapper: BrowserRouter});
		
		const hottest = screen.getByText(/hottest/i);
		const latest = screen.getByText(/latest/i);
		const title = screen.getByText(/www.ididthisforu.com/i);

		expect(hottest).toBeInTheDocument();
		expect(latest).toBeInTheDocument();
		expect(title).toBeInTheDocument();
	});

});
