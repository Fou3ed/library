import { postMessage } from "../services/messageRequests.js";
import {
    io
} from '../index.js'
const sendTextCapture = async (user,agent,conversation,message_capture,form_type) => {
try{
  let messageData={}
   if(message_capture){

   
    const savedMessage= await postMessage({
        app: user.accountId,
        user:agent._id.toString(),
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
        //   socket.to(conversation._id.toString()).emit('onMessageSent', {
    //     ...messageData,
    //     isSender: true,
    //     direction: 'in',
    //     conversationName: conversation.name,
    //   });

      io.in(conversation._id.toString()).emit('onMessageReceived', {
          messageData,
          conversation: conversation._id.toString(),
          isSender: false,
          direction: 'out',
          userId: agent._id.toString(),
        },
      );
   }
        if(form_type=="1"){
          const blocMessage=await postMessage({
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
          messageData.content=blocMessage?.message
          messageData.id=blocMessage?._id
          messageData.type=blocMessage?.type
          io.in(conversation._id.toString()).emit('onMessageReceived', {
            messageData,
            conversation: conversation._id.toString(),
            isSender: false,
            direction: 'out',
            userId: agent._id.toString(),
          });
        }
      
}catch(err){
    console.log("error saving form in iheb's data base",err)
}
 
}

export default sendTextCapture;

