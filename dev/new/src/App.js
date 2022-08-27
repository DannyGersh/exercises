import New from './new/New'
import Nav from './shared/nav/Nav'
import useWindowResize from './shared/Functions'
import './shared/Global.css'
import {useState, useEffect} from 'react'

function App() {

  let narrowWindow = useWindowResize();
  window.is_debug = (process.env.NODE_ENV === 'development');
	
	if( window.is_debug ){
		window.jsonData = {
			'chalange':
			{
				"id": 111,
				"question": "wow $$___latex$$",
				"answer": "wow $$___latex$$",
				"hints": "poop",
				"author": 3,
				"creationdate": "08/24/2022 - 09:20",
				"title": "wow $$___latex$$",
				"rating": [],
				"tags": [
						"math",
						"tag1",
				],
				"explain": "",
				"latex": "16613328765176556",
				"list_latex": {
						"title": [
								[
										" \\( \\begin{bmatrix}  \ta & b & c \\\\ \tc & d & d\\\\ \te & f & g \\\\ \t\\end{bmatrix}\\) ",
										"16613328138306038"
								]
						],
						"exercise": [
								[
										" \\( \\begin{bmatrix}  \ta & b & c \\\\ \tc & d & d\\\\ \te & f & g \\\\ \t\\end{bmatrix}\\) ",
										"1661332817331904"
								]
						],
						"answer": [
								[
										" \\( \\begin{bmatrix}  \ta & b & c \\\\ \tc & d & d\\\\ \te & f & g \\\\ \t\\end{bmatrix}\\) ",
										"1661332818761737"
								]
						],
						"hints": [],
						"explain": []
				},
				"authid": 3
			},
			'tags': ['math', 'tag1', 'tag2'],
			'isAuth': true,
			'userid': 1,
			'isEdit': true
			}
	}
	const tags = window.jsonData['tags'];
	const isAuth = window.jsonData['isAuth'];
  const userid = window.jsonData['userid'];
	const chalange = window.jsonData['chalange'];
	const isEdit = window.jsonData['isEdit'];

	return (
    <>
    
    <Nav 
      narrowWindow = { narrowWindow } 
      currentPage = { '/new' }
			isAuth = { isAuth }
			userid = { userid }
    />
    <New/>
    
    </>
  )
	
} 

export default App;
