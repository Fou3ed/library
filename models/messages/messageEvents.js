import messageActions from './messageMethods.js'
import {
  io
} from '../../index.js'
const foued = new messageActions
const ioEvents = function () {

  io.on('connection', function (socket) {


    socket.on('add-pUser', function (data) {
      socket.join(data.roomId);
    console.log(data,socket.rooms)
    });

    socket.on('send-pMsg', function (data) {
      io.to(data.roomId).emit('send-pMsg', data);
      //nverifi est ce que l msg wsol wala error wala ay hkaya 

      foued.addMsg(data)
    });

    socket.on('deleted-pMsg', function (data) {
      io.to(data.roomId).emit('delete-pMsg', data);
      //foued.deleteMsg(data.id)
    });
  })

}
export default ioEvents