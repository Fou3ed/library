import messageActions from './messageMethods.js'
import convMembersAction from '../convMembers/convMembersMethods.js'
import logsActions from '../logs/logsMethods.js'
import userMethod from '../user/userMethods.js'
import {
  io
} from '../../index.js'
const foued = new messageActions()
const convMember = new convMembersAction()
const userM = new userMethod()
import logger from '../../config/newLogger.js'
// import { sockety } from '../connection/connectionEvents.js'
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
const ioMessageEvents = function () {

  io.on('connection', function (socket) {



    socket.on('onMessageCreated', async (data, error) => {
      console.log(data)
      try {
        // Validate the input
        const conversationId = data.metaData.conversation_id;
        const receiver = data.to;
        const message = data.metaData.message;
        if (!data || !data.metaData || !conversationId) {
          console.error('Invalid input data');
          return;
        }

        //check if receiver is connected , if not  just send the message , if connected 
        //check if there is a room created ,if not create it 
        //then check 

//get the receiver socket_id 
userM.getUser(receiver).then((res)=>{
  console.log("aa",res)
  // Check if the receiver is online (connected to the socket)
  if (io.sockets.connected[res]) {
    console.log("okk")
    // Check if the room exists, if not create the room
    if (!socket.adapter.rooms[conversationId]) {
      socket.join(conversationId);
    }
    // Check if the receiver is joined, if not send an emit to join them
    else if (!socket.adapter.rooms.get(conversationId)?.has(res)) {
      io.to(res).emit('onConversationMemberJoin', conversationId);
    } else {
      console.log('User is already joined');
    }
  } else {
    console.log('Receiver is offline');
  }
})








  // Emit an event to the client who sent the message to indicate that the message was sent
  // socket.emit('onMessageSent', {
  //   ...messageData,
  //   isSender: true,
  //   direction: 'out'
  // });


        // Save the message to your database
        const savedMessage = await foued.addMsg(data);
    
        // Construct a message object to send to clients
        const { message: content, _id: id, uuid } = savedMessage;
        const from = socket.id;
        const conversation = conversationId;
        const date = currentDate;
        const type = data.metaData.type;
        const messageData = {
          content,
          id,
          from,
          conversation,
          date,
          uuid,
          type
        };
    
      
        // Emit an event to all members of the conversation except the sender to indicate that a new message was received
        socket.to(conversation).emit('onMessageReceived', {
          ...messageData,
          isSender: false,
          direction: 'in'
        });
      } catch (err) {
        console.error(`Error while processing message: ${err}`);
        logger.error(`Event: onMessageCreated , data: ${JSON.stringify(data)}, socket_id: ${socket.id}, token: "taw nzidouha", error: ${err}, date: ${fullDate}`);
      }
    });
    
    
    socket.on('onMessageDelivered', (data) => {
      console.log("Message delivered: ", data);
      // Emit an event to the sender of the message to indicate that the message was delivered
      socket.emit('onMessageDelivered', data);
    });
    



 
 
    io.on('connect_error', (err) => {
      console.error(`An error occurred: ${err.message}`);
    });

  
    // onMessageUpdated : Fired when the message data updated.

    socket.on('onMessageUpdated', (data) => {
      try {
        console.log("update")
        io.to(data.metaData.message).emit('onMessageUpdated', data);
        console.log('====================================');
        console.log("Message updated");
        console.log('====================================');
        foued.putMsg(data.metaData.message)
          .then((res) =>
            socket.emit("onMessageUpdated", {
              res: res,
            }, )
          )
        logger.info(`Event: onMessageUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
      } catch (err) {
        logger.error(`Event: onMessageUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
      }
    });
    // onMessageDeleted : Fired when the message deleted

    socket.on('onMessageDeleted', (data) => {
      try {
        io.to(data.metaData.message).emit('onMessageDeleted', data);
        console.log('====================================');
        console.log("Message deleted");
        console.log('====================================');
        foued.deleteMsg(data).then((res) =>
          socket.emit("onMessageDeleted", {
            res: res
          }, )
        )
        logger.info(`Event: onMessageDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

      } catch (err) {
        logger.error(`Event: onMessageDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

      }

    });

  })
}
export default ioMessageEvents