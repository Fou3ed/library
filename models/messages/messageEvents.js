import messageActions from './messageMethods.js'
import {
  io
} from '../../index.js'
import logs from '../logs/logsMethods.js'
const log= new logs()
const foued = new messageActions()
const ioMessageEvents = function () {

  io.on('connection', function (socket) {


    // onMessageDelivered : Fired when the message is sent.
    socket.on('onMessageCreated', (data,error) => {
      if (!error) {
        io.to(data.roomId).emit('onMessageCreated', data);
        console.log(socket.client.id)
        console.log('====================================');
        console.log("Message created");
        console.log('====================================');
        foued.addMsg(data)
          .then((res) =>
            socket.to(data.roomId).to(socket.client.id).emit("onMessageDelivered", {
              ...res.message,
              id: res._id,
              uuid: res.uuid
            }, )
          )
      }else {

        let data = {
          "app_id": "63ce8575037d76527a59a655",
          "user_id": "6390b2efdfb49a27e7e3c0b9",
          "socket_id":socket.id,
          "action": " error while sending message connection",
          "element": "1",
          "element_id": "1",
          "ip_address": "192.168.1.1"
      }
        log.addLog(data)
        setError(error)

      }
  
    });


    // socket.on('onMessageDelivered', (data) => {
    //   io.to(data.roomId).emit('onMessageDelivered', data);
    //   console.log(socket.client.id)
    //   console.log('====================================');
    //   console.log("Message delivered");
    //   console.log('====================================');
    //   foued.addMsg(data)
    //     .then((res) =>
    //       socket.to(data.roomId).to(socket.client.id).emit("onMessageDelivered", {
    //         ...res.message,
    //         id: res._id,
    //         uuid: res.uuid
    //       }, )
    //     )
        
    // });

    // onMessageReceived : Fired when the message is received.
    socket.on('onMessageReceived', (data) => {
      io.to(data.roomId).emit('onMessageReceived', data);
      console.log('====================================');
      console.log("Message received");
      console.log('====================================');
    });

    // onMessageUpdated : Fired when the message data updated.

    socket.on('onMessageUpdated', (data) => {
      io.to(data.roomId).emit('onMessageUpdated', data);
      console.log('====================================');
      console.log("Message updated");
      console.log('====================================');
      foued.putMsg(data)
    });


    // onMessageDeleted : Fired when the message deleted

    socket.on('onMessageDeleted', (data) => {
      io.to(data.roomId).emit('onMessageDeleted', data);
      console.log('====================================');
      console.log("Message deleted");
      console.log('====================================');
      foued.deleteMsg()
    });

  })

}
export default ioMessageEvents