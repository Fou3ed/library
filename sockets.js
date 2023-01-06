import { Socket } from 'socket.io';
import  messageEvents from './models/messages/messageEvents.js';

const foued = new messageEvents
export const listen = server => {
  const io = Socket.listen(server);


    io.sockets.on('connection', socket => {
        // On place nos events ici

        socket.on('action', () => {
            console.log("ok ok ")
        });
        foued.sendMsg()

    });
}

export default listen