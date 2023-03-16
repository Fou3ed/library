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
        if (!data || !data.metaData || !data.metaData.conversation_id) {
          console.error('Invalid input data');
          return;
        }
        // Save the message to your database
        const message = await foued.addMsg(data);

        // Construct a message object to send to clients
        const {
          message: content,
          _id: id,
          uuid
        } = message;
        const from = socket.id;
        const conversation = data.metaData.conversation_id;
        const date = currentDate;
        const type=data.metaData.type
        const messageData = {
          content,
          id,
          from,
          conversation,
          date,
          uuid,
          type
        };

        // Emit an event to the client who sent the message to indicate that the message was delivered
        socket.emit('onMessageSent', {
          ...messageData,
          isSender: true,
          direction: 'in'
        });

        // Emit an event to all members of the conversation to indicate that a new message has been received
        io.to(conversation).emit('onMessageReceived', {
          ...messageData,
          isSender: false,
          direction: 'out'
        });
      } catch (err) {
        console.error(`Error while processing message: ${err}`);
        logger.error(`Event: onMessageCreated , data: ${JSON.stringify(data)}, socket_id: ${socket.id}, token: "taw nzidouha", error: ${err}, date: ${fullDate}`);
      }
    });


    socket.on('onMessageDelivered',(data)=>{
      console.log("message delivered")
      socket.emit('messageDelivered',data)
    })
 
 
    io.on('connect_error', (err) => {
      console.error(`An error occurred: ${err.message}`);
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