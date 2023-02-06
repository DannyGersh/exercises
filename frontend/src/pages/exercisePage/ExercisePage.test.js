import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BrowserRouter} from "react-router-dom";
import ExercisePage from './ExercisePage';

describe('ExercisePage', ()=> {
	
	test('default', () => {});
	window.userId = [0, ()=>{}]; // fake userId state
	
	test('exercise btn must be present', () => {
		render(<ExercisePage/>, {wrapper: BrowserRouter});
		const elm = screen.getByText(/Exercise/i);
		expect(elm).toBeInTheDocument();
	});
	test('answer btn must be present', () => {
		render(<ExercisePage/>, {wrapper: BrowserRouter});
		const elm = screen.getByText(/Answer/i);
		expect(elm).toBeInTheDocument();
	});
	test('... (more) btn must be present', () => {
		render(<ExercisePage/>, {wrapper: BrowserRouter});
		const elm = screen.getByText(/\.\.\./i);
		expect(elm).toBeInTheDocument();
	});

	test('... (more) btn must open menue with default options', () => {
		// Arrange
		render(<ExercisePage/>, {wrapper: BrowserRouter});
		
		// Act
		const btn = screen.getByText(/\.\.\./i);
		userEvent.click(btn);
		
		// Assert
		const text1 = screen.getByText(/Created by/i);
		const text2 = screen.getByText(/report/i);
		expect(text1).toBeInTheDocument();
		expect(text2).toBeInTheDocument();
	});
	
	test('... (more) menue must not contain "send message" if user not loged in', () => {
		// Arrange
		render(<ExercisePage/>, {wrapper: BrowserRouter});
		
		// Act
		const btn = screen.getByText(/\.\.\./i);
		userEvent.click(btn);
		
		// Assert
		const text1 = screen.queryByText(/send message/i, {exact: false});
		expect(text1).toBeNull;
	});
	
	test('... (more) menue must contain "send message" if user is loged in', () => {
		// Arrange
		render(<ExercisePage/>, {wrapper: BrowserRouter});
		window.userId = [1, ()=>{}]; // fake userId state

		// Act
		const btn = screen.getByText(/\.\.\./i);
		userEvent.click(btn);
		
		// Assert
		const text1 = screen.getByText(/send message/i, {exact: false});
		expect(text1).toBeInTheDocument();
	});
});
