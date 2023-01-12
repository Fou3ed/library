//import conversation from './conversationModel.js'
import conversationActions from './conversationMethods.js';
import {
    io
} from '../../index.js';
const foued = new conversationActions
const ioConversationEvents = function () {

    //room namespace
    io.on('connection', function (socket) {
        // Create a new room
        // onConversationStart : Fired when the conversation created.

        socket.on('onConversationStart', (client) => {
            socket.join(client)
            console.log('====================================');
            console.log(client);
            console.log("socket id:", socket.id)
            console.log("client id : ", socket.client.id)
            console.log('====================================');
            /**
             * find if the room already exist in data base 
             * else create new one 
             */
            //  foued.addCnv(client)                                                                                                            
            socket.emit('onConversationStart',client)
        });


        // onConversationEnd : Fired when the conversation ended.
        socket.on('onConversationEnd', (data) => {
            console.log('====================================');
            console.log("socket rooms : ", socket.rooms);
            console.log('====================================');
            socket.emit("onConversationEnd",data)
        });
        

        // onConversationUpdated : Fired when the conversation data updated.
        socket.on('onConversationUpdated', (id,data) => {
            console.log('====================================');
            console.log("socket rooms : ", socket.rooms);
            console.log('====================================');
            foued.putCnv(id,data)
            socket.emit("onConversationUpdated",data )
        });

        // onConversationDeleted : Fired when the conversation deleted.

        socket.on('onConversationDeleted', (data) => {
            console.log('====================================');
            console.log("socket rooms : ", socket.rooms);
            console.log('====================================');
            foued.deleteCnv(data)
            socket.emit("onConversationDeleted",data)
        });

        // onConversationEndRequest : Fired when the user ends the chat.
        socket.on('onConversationEndRequest', (data) => {
            console.log('====================================');
            console.log("socket rooms : ", socket.rooms);
            console.log('====================================');
            socket.emit("onConversationRequest",data )
        });
    
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




    });
}


export default ioConversationEvents