import messageActions from '../messages/messageMethods.js'
import {
    io
} from '../../index.js'
const foued = new messageActions
const ioUserEvents = function () {

    io.on('connection', function (socket) {



        // onMessageRead : Fired when the user read a message.

        socket.on('onMessageRead', (data) => {
            io.to(data.roomId).emit('read-msg', data);
            console.log('====================================');
            console.log("message read");
            console.log('====================================');
            foued.readMsg(data)

        });

        // onMessagePinned : Fired when the user pin a message.

        socket.on('onMessagePinned', function (data) {
            io.to(data.roomId).emit('onMessagePinned', data);
            console.log('====================================');
            console.log("message pinned");
            console.log('====================================');
        });
        // onMessageUnpinned : Fired when the user unpin a message.
        socket.on('onMessageUnpinned', function (data) {
            io.to(data.roomId).emit('onMessageUnpinned', data);
            console.log('====================================');
            console.log("message unpinned");
            console.log('====================================');
        });

        // onMessageReacted : Fired when the user add a reaction to message.
        socket.on('onMessageReacted', function (data) {
            io.to(data.roomId).emit('onMessageReacted', data);
            console.log('====================================');
            console.log("message reacted");
            console.log('====================================');
        });
        // onMessageUnReacted : Fired when the user remove a reaction from message.
        socket.on('onMessageUnReacted', function (data) {
            io.to(data.roomId).emit('onMessageUnReacted', data);
            console.log('====================================');
            console.log("message unReacted");
            console.log('====================================');
        });
        // onMentionRequest : Fired when the user add mention.
        socket.on('onMentionRequest', function (data) {
            io.to(data.roomId).emit('onMentionRequest', data);
            console.log('====================================');
            console.log("Mention Request");
            console.log('====================================');
        });
        // onMentionReceived : Fired when the user remove mention.
        socket.on('onMentionReceived', function (data) {
            io.to(data.roomId).emit('onMentionReceived', data);
            console.log('====================================');
            console.log("Mention Received");
            console.log('====================================');
        });

        // onTypingStarted : Fired when the user start typing.
        socket.on('onTypingStarted', function (data) {
            io.to(data.roomId).emit('onTypingStarted', data);
            console.log('====================================');
            console.log(" on typing started ");
            console.log('====================================');
        });
        // onTypingStopped : Fired when the user stop typing.
        socket.on('onTypingStopped', function (data) {
            io.to(data.roomId).emit('onTypingStopped', data);
            console.log('====================================');
            console.log(" on typing stopped ");
            console.log('====================================');
        });

    })

}

export default ioUserEvents