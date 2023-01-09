//client.js
import * as io from 'socket.io-client'
var socket = io.connect('http://localhost:3000', {
    reconnect: true
});

// Add a connect listener
socket.on('connect', function () {
    console.log('Connected!', socket.id);

});
const joinRoom = (client) => {
    socket.emit('add-pUser', client);

}

joinRoom({
    user: "foued",
    roomId: "1"
})


const sendMsg = (message) => {
    socket.emit('send-pMsg', message);
}

let message={
    type: "test",
    conversation_id: "639ae9e25597b9d338e0e44e",
    user: "6390b2efdfb49a27e7e3c0b9",
    mentioned_users: "6390b306dfb49a27e7e3c0bb",
    message: "alooo",
    origin: "web"
}
sendMsg(message)


const deleteMsg=(message)=>{
    socket.emit('deleted-pMsg',message)
}
  
let data= {
    id:"63bc0cf5c8c7a8efca2ba4d6",
    roomId:"1"
}
deleteMsg(data)

// const privateMessage=(message)=>{
//     socket.emit("private message",message)

// }
// const getMsg=()=>{
//     socket.on('send-pMsg',message =>{
//         return message 
//     })
// } 
// let data = {
//     "type": "MESG",
//     "conversation_id": "63907b74266e3b8358516cd1",
//     "user": "6390b306dfb49a27e7e3c0bb",
//     "mentioned_users": "6390b4d54a1ba0044836d613",
//     "readBy": "6390b4d54a1ba0044836d613",
//     "is_removed": false,
//     "message": "lol",
//     "data": "additional message information ",
//     "attachments": {
//       "key": "value"
//     },
//     "parent_message_id": "6390bbb76b96e925c5eb1858",
//     "parent_message_info": "6390bbb76b96e925c5eb1858",
//     "location": "",
//     "origin": "web",
//     "read": null
//   }
// privateMessage(data)
// console.log(getMsg())