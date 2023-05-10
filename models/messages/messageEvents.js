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
import checkJoined from '../../utils/joinRoom.js'
import reviewBalance from '../../utils/balance.js'
import { clientBalance } from '../connection/connectionEvents.js'
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

        const senderName = await userM.getUserName(data.user)
          const conversationData=await conversationAct.getCnv(conversationId)
           const conversationName=conversationData.name
        // Construct a message object to send to clients
        const messageData = {
          content: data.metaData.message,
          id: savedMessage._id,
          from,
          senderName,
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
              const userId = messageData.from;
              const userBalance = clientBalance.find((b) => b.user === userId);
              reviewBalance(io, socket, conversationId, userBalance).then((newRes) =>{
                console.log("room been created")
                socket.join(conversationId)
                socket.emit('onMessageSent', {
                  ...messageData,
                  isSender: true,
                  direction: 'in',
                  conversationName:conversationName
                });
                conversationAct.putCnvLM(conversationId,messageData)

                io.to(res.socket_id).emit('joinConversationMember', conversationId);
              })
            
            }
            // Check if the receiver is joined, if not send an emit to join them
            else if (!(room && room.has(res.socket_id))) {
            

              const userId = messageData.from;

                            // Find the user's balance in the clientBalance array
                            const userBalance = clientBalance.find((b) => b.user === userId);
              reviewBalance(io, socket, conversationId, userBalance).then((newRes) => {

                io.to(res.socket_id).emit('joinConversationMember', conversationId);
                socket.emit('onMessageSent', {
                  ...messageData,
                  isSender: true,
                  direction: 'in',
                  balance: userBalance.balance,// Add the balance to the event data
                  conversationName:conversationName
                });
              conversationAct.putCnvLM(conversationId,messageData)
              })
            } else {
              const userId = messageData.from;
              const userBalance = clientBalance.find((b) => b.user === userId);

              reviewBalance(io, socket, conversationId, userBalance).then((newRes) => {
                let online = 1
                console.log('Users are already joined');
                // Find the user's balance in the clientBalance array
                socket.emit('onMessageSent', {
                  ...messageData,
                  isSender: true,
                  direction: 'in',
                  conversationName:conversationName,
                  balance: userBalance.balance // Add the balance to the event data
                },online);
              conversationAct.putCnvLM(conversationId,messageData)
            })}
          } else {
            const userId = messageData.from;
            const userBalance = clientBalance.find((b) => b.user === userId);
            reviewBalance(io,socket,conversationId,userBalance).then((newRes)=>{

            console.log('Receiver is offline');
            conversationAct.putCnvLM(conversationId,messageData)
            let online = 0
            // Emit an event to the client who sent the message to indicate that the message was sent
            socket.emit('onMessageSent', {
              ...messageData,
              isSender: true,
              direction: 'in',
              balance:userBalance.balance,
              conversationName:conversationName
            }, online);
            })
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
      // socket.emit('onMessageReceived', {
      //   ...newMessage,
      //   isSender: false,
      //   direction: 'out'
      // });
    })

    socket.on('receiveMessage', async conversationId => {
      const conversationData=await conversationAct.getCnv(conversationId)
           const conversationName=conversationData.name
  // Emit an event to all members of the conversation except the sender to indicate that a new message was received
  socket.to(conversationId).emit('onMessageReceived', {
    ...newMessage,
    isSender: false,
    direction: 'out',
    conversationName:conversationName
  });
   conversationAct.putCnvLM(conversationId,newMessage)
    })

    socket.on('onMessageDelivered', (data) => {
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
        console.log("Message updated",data);
        console.log('====================================');
        let status = await checkJoined(io, socket, data.metaData.conversation, data.user);

        await foued.putMsg(data).then(async (res) => {
      
        let emitEvent = "onMessageUpdated";
        console.log(status)
        switch (status) {
          case 0:
              socket.emit(emitEvent,res);
              break;
          case 1:
          case 2:
          case 3:
              io.to(data.metaData.conversation).emit(emitEvent,res);
              break;
          default:
              console.log("error on Message updated");
              break;
      }
        })
        logger.info(`Event: onMessageUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
      } catch (err) {
        logger.error(`Event: onMessageUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
      }
    });

    // onMessageDeleted : Fired when the message deleted

    socket.on('onMessageDeleted', async (data) => {
      try {
        let status = await checkJoined(io, socket, data.metaData.conversation, data.user);
        console.log('====================================');
        console.log("Message deleted");
        console.log('====================================');
        //change this to update status = 0 means the message is deleted .
        foued.deleteMsg(data).then(async (res) => {
          let emitEvent = "onMessageDeleted"
          switch (status) {
            case 0:
              socket.emit(emitEvent, res);
              break;
            case 1:
            case 2:
            case 3:
              io.to(data.metaData.conversation).emit(emitEvent, res);
              break;
            default:
              console.log("error deleting a message");
              break;
          }
        });
        logger.info(`Event: onMessageDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `);
      } catch (err) {
        logger.error(`Event: onMessageDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `);
      }
    });
    socket.on('forwardMessage', async (data) => {
      //check if they have a conversation together else create one (user 1 and user 2)
      //data will have an array of the users who are gonna receive the message
      //the user can forward the message to multiple 
      try {

        const receivers = data.to
        //check conversation if exist : just send a message if offline , if online join members and send message
        console.log('====================================');
        console.log("Message forward");
        console.log('====================================');
        //get conversation using conversation members
        receivers.forEach(async (user) => {
          const conversationData = await conversationAct.getPrivateConvBetweenUsers(user, data.user);
          const from = data.user;
          const date = currentDate;
          const type = data.metaData.type;
          // const status = "3"
          // if conversation id  exists 

          if (conversationData.length > 0) {
            const conversation = conversationData[0]._id
            let status = await checkJoined(io, socket, conversation, data.user);

            //save message in data base 
            //message data obj to be sent 
            const savingMessage = {
              app: data.app,
              user: data.user,
              action: "message.forward",
              metaData: {
                type: data.metaData.type,
                conversation_id: conversation,
                user: data.metaData.user,
                message: data.metaData.message,
                data: data.metaData.data,
                origin: data.metaData.origin,
                status: "3"
              },
              to: data.to
            }
            await foued.addMsg(savingMessage).then((savedMessage)=>{
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

              socket.emit('onMessageSent', {
                ...messageData,
                isSender: true,
                direction: 'in',
              }, status);
               conversationAct.putCnvLM(conversation,messageData)
            });
        
          } else {
            console.log('====================================');
            console.log("Message forward first time talking ");
            console.log('====================================');
            //never spoke ,create conversation then conversation members
            const conversationInfo = {
              app: "638dc76312488c6bf67e8fc0",
              user: data.user,
              action: "conversation.create",
              metaData: {
                name: "test",
                channel_url: "foued/test",
                conversation_type: "private",
                description: "private chat",
                operators: [1],
                owner_id: data.user,
                members: [data.to],
                permissions: {
                  "key": "value"
                },
                members_count: 2,
                max_length_message: "256",
              },
            }
            conversationAct.addCnv(conversationInfo).then(async (res) => {

              receivers.map(async (user) => {
                const from = data.user;
                const date = currentDate;
                const type = data.metaData.type;
                const status = "3"
                const conversation_id = res._id
                const data1 = {
                  conversation_id: conversation_id,
                  user_id: from,
                }
                const data2 = {
                  conversation_id: conversation_id,
                  user_id: user,
                }
                await convMember.addMember(data1)
                await convMember.addMember(data2)
                let statusJoin = await checkJoined(io, socket, conversation_id, data.user);

                if (conversation_id) {
                  const conversation=conversation_id
                  //save message in data base 
                  //message data obj to be sent 
                  const savingMessage = {
                    app: data.app,
                    user: data.user,
                    action: "message.forward",
                    metaData: {
                      type: data.metaData.type,
                      conversation_id: conversation,
                      user: data.metaData.user,
                      message: data.metaData.message,
                      data: data.metaData.data,
                      origin: data.metaData.origin,
                      status: "3"
                    },
                    to: data.to
                  }
                  
                  await foued.addMsg(savingMessage).then((savedMessage)=>{
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
      
                    socket.emit('onMessageSent', {
                      ...messageData,
                      isSender: true,
                      direction: 'in',
                    }, statusJoin);
                     conversationAct.putCnvLM(conversation,messageData)
                  });
            

                }
              })
            })
          }
        });
      } catch (err) {
        console.log(err)
      }
    })
  })
}
export default ioMessageEvents