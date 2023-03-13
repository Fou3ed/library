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
    
        // Get the conversation ID
        const conversationId = data.metaData.conversation_id;
    
        // Check if the room exists
        const roomExists = io.sockets.adapter.rooms.has(conversationId);
        // If the room doesn't exist, join specific members' sockets to the room
        if (!roomExists) {
          // Retrieve the conversation members from the database
          const members = await convMember.getConversationMembers(conversationId);
          // Retrieve the socket IDs for specific members of the conversation
          const specificMembers = members; 
          const specificSocketsToJoin = await Promise.all(specificMembers.map(async (member) => {
            const socket_id = await userM.getUser(member);
            return socket_id;
          }));  

               specificSocketsToJoin.forEach(socket_id => {
            console.log("Joining socket", socket_id, "to room", conversationId);
            socket.join(conversationId)
          });
    
          // Register event handler for join-room event
          io.of("/").adapter.on("join-room", (room, socketId) => {
            console.log(`Socket ${socketId} has joined room ${room}`);
          });
        }
    
        // Emit an event to the client who sent the message to indicate that the message was delivered
        socket.emit('onMessageDelivered', {
          ...messageData,
          isSender: true,
          direction: 'in'
        });
    
        // Emit an event to all members of the conversation to indicate that a new message has been received
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