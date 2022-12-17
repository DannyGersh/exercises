import './AboutPage.css'

const str_about = `
This website I built for those who 
seek to share their passion and knowledge. 
exercises are a fundamental block of learning,
given interesting exercises, 
one can accelerate and gain not only new skills, 
but also new passion for the subject of study.
for those who upload an exercise I say, 
as many have told before me: 
"teaching is the best way of learning".
`
const str_contact = `
send your message to 
ididthisforu.contact@gmail.com 
as described blow:
`

function AboutPage() {

	const style_main = {
		margin: '1rem',
	}

	return(<div style={style_main}>
		<h3>About</h3>
		<p>{str_about}</p>
		<h3>Contact</h3>
		<p>{str_contact}</p>
		

	<table>
	<thead>
	<tr>
		<th>purpose</th>
		<th>title</th>
		<th>message</th>
	</tr>
	</thead>
	<tbody>
		<tr>
			<td>report an exercise</td>
			<td>report</td>
			<td>
				a link to the exercise to report 
				and the reasone of reporting
			</td>
		</tr>
		<tr>
			<td>report a bug or issue</td>
			<td>bug</td>
			<td>
				the browser you are using, 
				what is the problem\issue, 
				how to replicate the issue.
			</td>
		</tr>
		<tr>
			<td>other</td>
			<td>other</td>
			<td>go wild</td>
		</tr>
	</tbody>  
	</table>

	</div>)
}
export default AboutPage;
