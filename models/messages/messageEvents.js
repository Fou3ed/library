import messageActions from './messageMethods.js'
import {
  io
} from '../../index.js'
const foued = new messageActions()
import logger from '../../config/newLogger.js'
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
const ioMessageEvents = function () {

  io.on('connection', function (socket) {


    socket.on('onMessageCreated', (data, to, error) => {
      try {
        console.log(socket.client.id)
        console.log('====================================');
        console.log("Message created");
        console.log('====================================');
        foued.addMsg(data)
          .then((res) => {
            const message = {
              content: res.message,
              id: res._id,
              from: socket.id,
              date: currentDate,
              uuid: res.uuid
            };
            socket.emit("onMessageReceived", {
              ...message,
              isSender: true
            });
            socket.broadcast.emit("onMessageReceived", {
              ...message,
              isSender: false
            });
          })
        logger.info(`Event: onMessageCreated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate} " \n `)
      } catch (err) {
        logger.error(`Event: onMessageCreated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
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

      try{
        io.to(data.metaData.message).emit('onMessageUpdated', data);
        console.log('====================================');
        console.log("Message updated");
        console.log('====================================');
         foued.putMsg(data.metaData.message)
         .then((res) => 
            socket.emit("onMessageUpdated", {
              res:res,
            },)
          )
        logger.info(`Event: onMessageUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
      }catch(err){
        logger.error(`Event: onMessageUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
      }
    
    });


    // onMessageDeleted : Fired when the message deleted

    socket.on('onMessageDeleted', (data) => {
      try{
        io.to(data.metaData.message).emit('onMessageDeleted', data);
        console.log('====================================');
        console.log("Message deleted");
        console.log('====================================');
        foued.deleteMsg(data).then((res) => 
        socket.emit("onMessageDeleted", {
          res:res
        },)
      )
        logger.info(`Event: onMessageDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

      }catch(err){
        logger.error(`Event: onMessageDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

      }

    });

  })

}
export default ioMessageEvents