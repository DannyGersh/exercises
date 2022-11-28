import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {sendData} from '../../shared/Functions'

function Profile() {
	
	const { userId } = useParams();
	
	useEffect(()=>{
		
		sendData('fetch/profile', 'POST', {
			'userId': parseInt(userId),
		})
		
	},[])
	
	return <h1>userId {userId}</h1>
}
export default Profile;
