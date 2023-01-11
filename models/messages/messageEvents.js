import messageActions from './messageMethods.js'
import {
  io
} from '../../index.js'
const foued = new messageActions
const ioMessageEvents = function () {

  io.on('connection', function (socket) {


    // onMessageDelivered : Fired when the message is sent.





    socket.on('onMessageDelivered', (data) => {
      io.to(data.roomId).emit('onMessageDelivered', data);
      
      console.log('====================================');
      console.log("Message delivered");
      console.log('====================================');
      foued.addMsg(data)
       socket.emit('onMessageDelivered',data)
    });

    // onMessageReceived : Fired when the message is received.
    socket.on('onMessageReceived', (data) => {
      console.log('====================================');
      console.log("Message received");
      console.log('====================================');
      socket.emit("onMessageReceived",data )
    });

    // onMessageUpdated : Fired when the message data updated.

    socket.on('onMessageUpdated', (data) => {
      console.log('====================================');
      console.log("Message updated");
      console.log('====================================');
      socket.emit("onMessageUpdated",data )
    });

    // onMessageDeleted : Fired when the message deleted

    socket.on('onMessageDeleted', (data) => {
      console.log('====================================');
      console.log("Message deleted");
      console.log('====================================');
      socket.emit("onMessageDeleted",data )
    });



    // socket.on('add-pUser', function (data) {
    //   socket.join(data.roomId);
    // console.log(data,socket.rooms)
    // });

    // socket.on('send-pMsg', function (data) {
    //   io.to(data.roomId).emit('send-pMsg', data);
    //   nverifi est ce que l msg wsol wala error wala ay hkaya 

    //   foued.addMsg(data)
    // });

    // socket.on('deleted-pMsg', function (data) {
    //   io.to(data.roomId).emit('delete-pMsg', data);
    //   //foued.deleteMsg(data.id)
    // });
  })

}
export default ioMessageEvents