//import conversation from './conversationModel.js'
import conversationActions from './conversationMethods.js';
import { randomUUID } from 'crypto';
import {
    io
} from '../../index.js';
const foued = new conversationActions
import logger from '../../config/newLogger.js'
import * as info from '../../data.js'

const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
const ioConversationEvents = function () {

    //room namespace
    io.on('connection', function (socket) {
        // Create a new room
        // onConversationStart : Fired when the conversation created.
        socket.on('onConversationStart', (data) => {
            try{
                if (data.metaData.name ==""){
                    console.log("conversation must obtain a name ")
                }else {
                    socket.join(randomUUID())
                    console.log('====================================');
                    console.log("conversation created")
                    console.log("socket id:", socket.id)
                    console.log("client id : ", socket.client.id)
                    console.log("room id : ", socket.rooms)
                    console.log('====================================');
                    foued.addCnv(data).then((res)=>{
                    socket.emit('onConversationStarted',info.onConversationCreated,res)

                    })                                                                                                            
                    logger.info(`Event: onConversationStart ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

                }
    
            }catch(err){
                logger.error(`Event: onConnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
            }
           
            /**
             * find if the room already exist in data base 
             * else create new one 
             */
          
        });
        // onConversationEnd : Fired when the conversation ended.
        socket.on('onConversationEnd', (data) => {
            console.log(data)
            console.log('====================================');
            console.log("socket rooms : ", socket.rooms);
            console.log('====================================');
            socket.emit("onConversationEnd",data)
        });
        

        // onConversationUpdated : Fired when the conversation data updated.
        socket.on('onConversationUpdated', (data) => {
            try{
                console.log('====================================');
                console.log("socket rooms : ", socket.rooms);
                console.log('====================================');
                logger.info(`Event: onConversationUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

                foued.putCnv(data.metaData.conversation,data).then((res)=>{
                    socket.emit("onConversationUpdated",data,res )

                })
            }catch(err){

                logger.error(`Event: onConversationUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
            }
   
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