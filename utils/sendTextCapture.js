import { postMessage } from "../services/messageRequests.js";
import {
  io
} from '../index.js'
import { informOperator } from "./informOperator.js";
import { socketIds } from "../models/connection/connectionEvents.js";
const sendTextCapture = async (user, agent, conversation, message_capture, form_type,socket) => {

  try {
    let messageData = {}
    if (message_capture) {
      const savedMessage = await postMessage({
        app: user.accountId,
        user: agent._id.toString(),
        action: "message.create",
        metaData: {
          type: "MSG",
          conversation_id: conversation._id.toString(),
          user: agent._id.toString(),
          message: message_capture,
          origin: "web",
        },
      })
      messageData = {
        content: message_capture,
        id: savedMessage._id,
        from: agent._id.toString(),
        conversation: conversation._id.toString(),
        senderName: agent.nickname,
        date: new Date(),
        type: "MSG",
      };
     

      io.in(conversation._id.toString()).emit('onMessageReceived', {
        messageData,
        conversation: conversation._id.toString(),
        isSender: false,
        direction: 'out',
        userId: agent._id.toString(),
      },
      );
      if (conversation.status !== 1) {
    
        try{
          Object.entries(socketIds).forEach(([socketId, user]) => {
            if (
              socket.id !== socketId &&
              user.role=="ADMIN" && user.accountId==conversation.owner_id
            ) {
              if (!(io.sockets.adapter.rooms.get(conversation._id.toString())?.has(socketId))) {
                io.to(socketId).emit("onMessageReceived",  {
                  messageData,
                  conversation: conversation._id.toString(),
                  isSender: false,
                  direction: 'out',
                  userId: agent._id.toString(),
                });   
      
              } 

          
            }
  
             })
            }
          catch(err){
          console.log("informOperator err",err)
          throw err;
        }
      } 
    }
    if (form_type == "1") {
      const blocMessage = await postMessage({
        app: user.accountId,
        user: agent._id.toString(),
        action: "message.create",
        metaData: {
          type: "bloc",
          conversation_id: conversation._id.toString(),
          user: agent._id.toString(),
          message: "bloc msg",
          data: "non other data",
          origin: "web",
        },
      })
      messageData.content = blocMessage?.message
      messageData.id = blocMessage?._id
      messageData.type = blocMessage?.type
      messageData.date = new Date()
      messageData.senderName = agent.nickname
      io.in(conversation._id.toString()).emit('onMessageReceived', {
        messageData,
        conversation: conversation._id.toString(),
        isSender: false,
        direction: 'out',
        userId: agent._id.toString(),
      });
    }
    if (conversation.status !== 1) {
    
      try{
        Object.entries(socketIds).forEach(([socketId, user]) => {
          if (
            socket.id !== socketId &&
            user.role=="ADMIN" && user.accountId==conversation.owner_id
          ) {
            if (!(io.sockets.adapter.rooms.get(conversation._id.toString())?.has(socketId))) {
              io.to(socketId).emit("onMessageReceived",  {
                messageData,
                conversation: conversation._id.toString(),
                isSender: false,
                direction: 'out',
                userId: agent._id.toString(),
              });   
    
            } 

        
          }

           })
          }
        catch(err){
        console.log("informOperator err",err)
        throw err;
      }
    } 

  } catch (err) {
    console.log("error saving form in iheb's data base", err)
  }

}

export default sendTextCapture;

