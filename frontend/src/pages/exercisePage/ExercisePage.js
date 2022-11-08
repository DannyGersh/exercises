import MainJsx from './ExercisePage.jsx'
import {useState, useEffect} from 'react'
import {sendData, mainText2html} from '../../shared/Functions'
import { useParams } from "react-router-dom";

// TODO - fix like

function ExercisePage(props){
  
  let { exerciseId } = useParams();

  sendData('fetch/exercisePage', 'POST', {'exerciseId':exerciseId})
  .then(d=>console.log(d))

	return(<h1>{exerciseId}</h1>)

}


export default ExercisePage;
