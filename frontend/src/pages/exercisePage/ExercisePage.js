import MainJsx from './ExercisePage.jsx'
import {useState, useEffect} from 'react'
import {sendData, mainText2html} from '../../shared/Functions'
import { useParams } from "react-router-dom";

// TODO - fix like

function ExercisePage(props){
  
  let { exerciseId } = useParams();
  const exercisePage = useState(null);

  const main = {

    // server data
    exercise  : null,
    userId    : null,

    // states
    dspLike             : useState(null),
    likes               : useState(null),
    dspHints            : useState(null),
    dspAnswer           : useState(null),
    dspAdditionalMenue  : useState(null),
    dspReport           : useState(null),
    dspExplain          : useState(null),
    dspSendMessage      : useState(null),
    dspHae              : useState('Exercise'), // Hinst, Anser, Explain. default - Exercise

    // functions and handles:

    sendMessage: ()=> {

      if(main.userId) {
        let message = document.getElementById('sendMessage').value;
        
        if(message.length > 800) {
          window.alert('over 800 characters not allowed.');
          return;
        }
        if(message.length < 5) {
          window.alert('less then 5 characters not allowed.');
          return;
        }

        sendData('message2user', 'POST', {
          exerciseId: main.exercise['id'],
          sender: main.userId,
          receiver: main.exercise['author'],
          message: message
        })
        .then((data) => {
          if(!data['error']) {
            window.alert('message sent successfully.');
            main.dspSendMessage[1](false);
            main.dspReport[1](false);
            main.dspAdditionalMenue[1](false);
          }
        });
      }
    },
    likeHandle: ()=> { 
      
      // determine like number
      main.dspLike[0] ? main.likes[1](main.likes[0]-1) : main.likes[1](main.likes[0]+1);
      
      // send like
      if(main.isAuth && !window.is_debug) {
        sendData('like', 'POST', {
          exerciseId: main.exercise['id'],
          userId: main.userId
        })
      }
    },
    additionalMenueHandler: ()=> {
      main.dspAdditionalMenue[1](!main.dspAdditionalMenue[0]);
    },
    sendMessageHandle: ()=> {
      main.dspSendMessage[1](!main.dspSendMessage[0]);
      main.dspReport[1](false)
    },
    reportHandle: ()=> {
      main.dspSendMessage[1](false);
      main.dspReport[1](!main.dspReport[0])
    },
    haeHandle: (target)=> {
      if(main.dspHae[0] === target) {
        main.dspHae[1]('Exercise')
      } else {
        main.dspHae[1](target)
      }
    }

  }

  useEffect(()=>{
    sendData('fetch/exercisePage', 'POST', {'exerciseId':exerciseId})
    .then(d=>{

          d['title'] = mainText2html(d, 'title');
          d['exercise'] = mainText2html(d, 'exercise');
          d['answer'] = mainText2html(d, 'answer');
          d['hints'] = mainText2html(d, 'hints');
          d['explain'] = mainText2html(d, 'explain');
      }
    )
  },[])

  useEffect(()=>{
    console.log(exercisePage)
  },[exercisePage])


  return(<h1>{exerciseId}</h1>)

}


export default ExercisePage;
