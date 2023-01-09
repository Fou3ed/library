//import conversation from './conversationModel.js'
import conversationActions from './conversationMethods.js';
import { io } from '../../index.js';
const foued = new conversationActions
const ioEvents = function() {

    //room namespace
    io.on('connection', function(socket) {
        // Create a new room

        socket.on('newRoom', function(client) {
            socket.join('newRoom')
            console.log('====================================');
            console.log(client);
            console.log("socket id:",socket.id)
            console.log("client id : ",socket.client.id)
            console.log(socket)
            console.log('====================================');
            // console.log("a",client)
            //     foued.getCnv(client.id)
            // conversation.findOne({ 'title': new RegExp('^' + title + '$', 'i') }, function(err, room) {
            //     if (err) throw err;
            //     if (room) {
            //         socket.emit('updateConversationList', { error: 'conversation title already exists.' });
            //     } else {
            //         conversation.create({
            //             title: title
            //         }, function(err, newRoom) {
            //             if (err) throw err;
            //             socket.emit('updateConversationList', newRoom);
            //             socket.broadcast.emit('updateConversationList', newRoom);
            //         });
            //     }
            // });
        });
        // socket.emit('join', { username, room }, error => {
        //     if (error) {
        //         setError(error);
        //     }
        //     console.log('====================================');
        //     console.log("emit join");
        //     console.log('====================================');
        // });

        // socket.on("private message", ({
        //     content,
        //     to
        //   }) => {
        //     const message = {
        //       content,
        //       from: socket.userID,
        //       to,
        //     };
        //     let data = {
        //       "type": "MESG",
        //       "conversation_id": "63907b74266e3b8358516cd1",
        //       "user": "6390b306dfb49a27e7e3c0bb",
        //       "mentioned_users": "6390b4d54a1ba0044836d613",
        //       "readBy": "6390b4d54a1ba0044836d613",
        //       "is_removed": false,
        //       "message": message.content,
        //       "data": "additional message information ",
        //       "attachments": {
        //         "key": "value"
        //       },
        //       "parent_message_id": "6390bbb76b96e925c5eb1858",
        //       "parent_message_info": "6390bbb76b96e925c5eb1858",
        //       "location": "",
        //       "origin": "web",
        //       "read": null
        //     }
        //    //foued.addMsg(data)
        //     .then ((res)=>socket.to(to).to(socket.userID).emit("private message", {...message,id:res.date._id})
        //     )
        //   });

        socket.on("private message", function (data) {
           // console.log(data)
            io.to(data.roomId).emit('send-pMsg', data);
        
        });
    
        
    });
}


export default ioEvents