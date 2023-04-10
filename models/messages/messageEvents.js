/* The above code is defining and exporting a function called `ioMessageEvents` which sets up event
listeners for socket.io connections. It listens for events such as `onMessageCreated`,
`onConversationMemberJoined`, `receiveMessage`, `onMessageDelivered`, `updateMessage`,
`onMessageDeleted`, and `forwardMessage`. These events are triggered when a user sends a message,
joins a conversation, receives a message, confirms message delivery, updates a message, deletes a
message, or forwards a message. The function uses various methods from other modules to handle these
events, such as adding messages to */
import messageActions from './messageMethods.js'
import convMembersAction from '../convMembers/convMembersMethods.js'
import userMethod from '../user/userMethods.js'
import conversationActions from '../conversations/conversationMethods.js'
import {
  io
} from '../../index.js'
const foued = new messageActions()
const convMember = new convMembersAction()
const userM = new userMethod()
const conversationAct = new conversationActions()
import logger from '../../config/newLogger.js'
// import { sockety } from '../connection/connectionEvents.js'
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
const ioMessageEvents = function () {

  let newMessage;

  io.on('connection', function (socket) {
    socket.on('onMessageCreated', async (data, error) => {
      try {
        // Save the message to your database
        const savedMessage = await foued.addMsg(data);
        const conversationId = data.metaData.conversation_id;
        const from = data.user;
        const conversation = conversationId;
        const date = currentDate;
        const type = data.metaData.type;

        const members = await convMember.getConversationMembers(conversationId);
        const receiver = await Promise.all(
          members
          .filter(member => member !== data.user)
          .map(async (member) => {
            return member;
          })
        );

        // Construct a message object to send to clients
        const messageData = {
          content: data.metaData.message,
          id: savedMessage._id,
          from,
          conversation,
          date,
          uuid: data.uuid,
          type
        };
        if (!data || !data.metaData || !conversationId) {
          console.error('Invalid input data');
          return;
        }
        //get receiver information
        userM.getUser(receiver).then((res) => {
          // Check if the receiver is online (connected to the socket)
          if (res.is_active === true) {
            console.log("receiver is active")
            // Check if the room exists, if not create the room
            const room = io.of('/').adapter.rooms.get(conversationId);
            if (room === undefined) {
              console.log("room been created")
              socket.join(conversationId)
              socket.emit('onMessageSent', {
                ...messageData,
                isSender: true,
                direction: 'in'
              });
              console.log(room, res.socket_id)
              io.to(res.socket_id).emit('joinConversationMember', conversationId);
            }
            // Check if the receiver is joined, if not send an emit to join them
            else if (!(room && room.has(res.socket_id))) {
              console.log(`Socket ${res.socket_id} is in room ${conversationId}`)
              socket.emit('onMessageSent', {
                ...messageData,
                isSender: true,
                direction: 'in'
              });
              io.to(res.socket_id).emit('joinConversationMember', conversationId);

            } else {
              let online = 1
              console.log('Users are already joined');
              socket.emit('onMessageSent', {
                ...messageData,
                isSender: true,
                direction: 'in'
              }, online);

            }
          } else {
            console.log('Receiver is offline');

            let online = 0
            // Emit an event to the client who sent the message to indicate that the message was sent
            socket.emit('onMessageSent', {
              ...messageData,
              isSender: true,
              direction: 'in'
            }, online);
          }
        })
        newMessage = {
          messageData,
          ...savedMessage
        }
        return messageData
      } catch (err) {
        console.error(`Error while processing message: ${err}`);
        logger.error(`Event: onMessageCreated , data: ${JSON.stringify(data)}, socket_id: ${socket.id}, token: "taw nzidouha", error: ${err}, date: ${fullDate}`);
      }
    });

    socket.on('onConversationMemberJoined', async (conversationId) => {
      console.log("here to add the other member in ", conversationId)
      // join room
      socket.join(conversationId)
      socket.emit('onMessageReceived', {
        ...newMessage,
        isSender: false,
        direction: 'out'
      });
    })

    socket.on('receiveMessage', conversationId => {
      // Emit an event to all members of the conversation except the sender to indicate that a new message was received
      socket.to(conversationId).emit('onMessageReceived', {
        ...newMessage,
        isSender: false,
        direction: 'out'
      });
    })

    socket.on('onMessageDelivered', (data) => {
      console.log("Message delivered: ", data);
      // Emit an event to the sender of the message to indicate that the message was delivered
      socket.emit('onMessageDelivered', data);
    });


    io.on('connect_error', (err) => {
      console.error(`An error occurred: ${err.message}`);
    });


    // onMessageUpdated : Fired when the message data updated.

    socket.on('updateMessage', async (data) => {
      try {

        console.log('====================================');
        console.log("Message updated");
        console.log('====================================');

        await foued.putMsg(data).then((res) => {
          socket.to(data.metaData.conversation).emit('onMessageUpdated', res);
          socket.emit("onMessageUpdated", res)
        })
        logger.info(`Event: onMessageUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
      } catch (err) {
        logger.error(`Event: onMessageUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
      }
    });

    // onMessageDeleted : Fired when the message deleted

    socket.on('onMessageDeleted', (data) => {
      try {
        console.log('====================================');
        console.log("Message deleted");
        console.log('====================================');
        //change this to update status = 0 means the message is deleted .

        foued.deleteMsg(data).then((res) => {

          io.to(data.metaData.conversation).emit("onMessageDeleted", res)
          socket.emit("onMessageDeleted", res)
        })

        logger.info(`Event: onMessageDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

      } catch (err) {
        logger.error(`Event: onMessageDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

      }

    });



    socket.on('forwardMessage', async (data) => {
      console.log("for", data)
      const user1 = data.user1
      const user2 = data.user2
      try {
        //check conversation if exist : just send a message if offline , if online join members and send message
        console.log('====================================');
        console.log("Message forward");
        console.log('====================================');
        //get conversation using conversation members
        const conversation_Id = await conversationAct.getConv(user1, user2)
        //if they already have a conversation 
        if (conversation_Id) {
          const from = data.user;
          const conversation = conversation_Id
          const date = currentDate;
          const type = data.metaData.type;
          const status = 3

          //save message in data base 
          await foued.addMsg(data)
          //, get all conversation members, 
          const members = await convMember.getConversationMembers(conversation_Id);
          const receiver = await Promise.all(
            members
            .filter(member => member !== data.user)
            .map(async (member) => {
              return member;
            })
          );
          //send the message to all the conversations members   .
          // Construct a message object to send to clients
          const messageData = {
            content: data.metaData.message,
            id: savedMessage._id,
            from,
            conversation,
            date,
            uuid: data.uuid,
            type,
            status
          };
          if (!data || !data.metaData || !conversationId) {
            console.error('Invalid input data');
            return;
          }
          //get receiver information
          userM.getUser(receiver).then((res) => {
            // Check if the receiver is online (connected to the socket)
            if (res.is_active === true) {
              console.log("receiver is active")
              // Check if the room exists, if not create the room
              const room = io.of('/').adapter.rooms.get(conversationId);
              if (room === undefined) {
                console.log("room been created")
                socket.join(conversationId)
                socket.emit('onMessageSent', {
                  ...messageData,
                  isSender: true,
                  direction: 'in'
                });
                console.log(room, res.socket_id)
                io.to(res.socket_id).emit('joinConversationMember', conversationId);
              }
              // Check if the receiver is joined, if not send an emit to join them
              else if (!(room && room.has(res.socket_id))) {
                console.log(`Socket ${res.socket_id} is in room ${conversationId}`)
                socket.emit('onMessageSent', {
                  ...messageData,
                  isSender: true,
                  direction: 'in'
                });
                io.to(res.socket_id).emit('joinConversationMember', conversationId);

              } else {
                let online = 1
                console.log('Users are already joined');
                socket.emit('onMessageSent', {
                  ...messageData,
                  isSender: true,
                  direction: 'in'
                }, online);

              }
            } else {
              console.log('Receiver is offline');

              let online = 0
              // Emit an event to the client who sent the message to indicate that the message was sent
              socket.emit('onMessageSent', {
                ...messageData,
                isSender: true,
                direction: 'in'
              }, online);
            }
          })
          newMessage = {
            messageData,
            ...savedMessage
          }
          return messageData

        } else {
          console.log("llééénnna")
          convMember.addMember()
        }




      } catch (err) {

      }
    })

  })

}
export default ioMessageEvents