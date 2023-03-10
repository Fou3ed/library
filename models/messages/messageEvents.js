import messageActions from './messageMethods.js'
import convMembersAction from '../convMembers/convMembersMethods.js'
import logsActions from '../logs/logsMethods.js'
import {
  io
} from '../../index.js'
const foued = new messageActions()
const convMember= new convMembersAction()
import logger from '../../config/newLogger.js'
// import { sockety } from '../connection/connectionEvents.js'
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
const ioMessageEvents = function () {

  io.on('connection', function (socket) {

    // socket.on('onMessageCreated', (data, error) => {
    //   try {
    //     console.log("client : ",socket.client.id)
    //     console.log('====================================');
    //     console.log("Message created");
    //     console.log('====================================');
    //     foued.addMsg(data)
    //       .then((res) => {
    //         const message = {
    //           content: res.message,
    //           id: res._id,
    //           from: socket.id,
    //           date: currentDate,
    //           uuid: res.uuid
    //         };         
    //         socket.emit("onMessageDelivered", {
    //           ...message,
    //           isSender: true,
    //           direction:"in"
    //         });
    //         socket.broadcast.emit("onMessageReceived", {
    //           ...message,
    //           isSender: false,
    //           direction:"out"
    //         });
    //       })
    //     logger.info(`Event: onMessageCreated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate} " \n `)
    //   } catch (err) {
    //     logger.error(`Event: onMessageCreated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
    //   }
    // });


    // socket.on('onMessageCreated', (data, error) => {
    //   try {
    //     console.log("client : ", socket.client.id)
    //     console.log('====================================');
    //     console.log("Message created");
    //     console.log('====================================');
    //     foued.addMsg(data)
    //       .then((res) => {
    //         const message = {
    //           content: res.message,
    //           id: res._id,
    //           from: socket.id,
    //           conversation: data.metaData.conversation_id,
    //           date: currentDate,
    //           uuid: res.uuid
    //         };
    //         socket.emit("onMessageDelivered", {
    //           ...message,
    //           isSender: true,
    //           direction: "in"
    //         });
    //         io.to(data.metaData.conversation_id).emit("onMessageReceived", {
    //           ...message,
    //           conversation: data.metaData.conversation_id,
    //           isSender: false,
    //           direction: "out"
    //         });
    //       })
    //     logger.info(`Event: onMessageCreated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate} " \n `)
    //   } catch (err) {
    //     logger.error(`Event: onMessageCreated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
    //   }
    // });


 // When a client sends a message
 socket.on('onMessageCreated', async (data, error) => {
  try {
    console.log('Data:', data);

    // Save the message to your database
    const message = await foued.addMsg(data);

    // Construct a message object to send to clients
    const messageData = {
      content: message.message,
      id: message._id,
      from: socket.id,
      conversation: data.metaData.conversation_id,
      date: currentDate,
      uuid: message.uuid
    };

    // Emit an event to the client who sent the message to indicate that the message was delivered
    socket.emit('onMessageDelivered', {
      ...messageData,
      isSender: true,
      direction: 'in'
    });
    // Get the conversation ID and room object
    const conversationId = data.metaData.conversation_id;
    let room = io.sockets.adapter.rooms[conversationId];
    // console.log("sockety",sockety)
    // If room does not exist, create a new room and join all members
    if (!room) {
    console.log(socket.data.user_id)
      const userId = data.metaData.user;
      const members = await convMember.getConversationMembers(conversationId);
      const socketIds = members
      console.log("socket ids",socketIds,io.sockets.data.socket_id)
      .map(memberId => io.sockets.connected[memberId])
      .filter(memberSocket => memberSocket)
      .map(memberSocket => memberSocket.id);
      console.log("aaaaaaaa",socketIds)
      socketIds.forEach(socketId => {
        io.sockets.sockets[socketId].join(conversationId);
      });
    }

    // Emit an event to all clients in the conversation room to indicate that a new message was received
    io.in(conversationId).emit('onMessageReceived', {
      ...messageData,
      conversation: conversationId,
      isSender: false,
      direction: 'out'
    });
  } catch (err) {
    console.error(`Error while processing message: ${err}`);
    logger.error(`Event: onMessageCreated, data: ${JSON.stringify(data)}, socket_id: ${socket.id}, token: "taw nzidouha", error: ${err}, date: ${fullDate}`);
  }
});




    // socket.on('onMessageDelivered', (data) => {
    //   try {
    //     io.to(data.roomId).emit('onMessageDelivered', data);
    //     console.log(socket.client.id)
    //     console.log('====================================');
    //     console.log("Message delivered");
    //     console.log('====================================');
    //     foued.addMsg(data)
    //       .then((res) =>
    //         socket.to(data.roomId).to(socket.client.id).emit("onMessageDelivered", {
    //           ...res.message,
    //           id: res._id,
    //           uuid: res.uuid
    //         }, )
    //       )
    //   } catch (err) {
    //   }
    // });

    // onMessageReceived : Fired when the message is received.
    // socket.on('onMessageReceived', (data) => {
    //   console.log("receive msg : ",data)
    //   try{
    //     io.to(data.metaData.message).emit('onMessageReceived', data);
    //     console.log('====================================');
    //     console.log("Message received");
    //     console.log('====================================');
    //     logger.info(`Event: onMessageReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
    //   }catch(err){
    //     logger.error(`Event: onMessageReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
    //   }
    // });

    // onMessageUpdated : Fired when the message data updated.

    socket.on('onMessageUpdated', (data) => {
      try {
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