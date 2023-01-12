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
      console.log(socket.client.id)
      console.log('====================================');
      console.log("Message delivered");
      console.log('====================================');
      foued.addMsg(data)
        .then((res) =>
          socket.to(data.roomId).to(socket.client.id).emit("onMessageDelivered", {
            ...res.message,
            id: res._id,
            uuid: res.uuid
          }, )
        )
        
    });

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