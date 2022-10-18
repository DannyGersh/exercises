import {sendData} from '../../shared/functions'

function Home(){

	sendData('fetch/test123', 'GET')
	.then(data=>console.log(data))

	return (<h1>TEST2</h1>);
}
export default Home;