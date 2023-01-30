import messageActions from '../messages/messageMethods.js'
import {
    io
} from '../../index.js'
import logger from '../../config/newLogger.js'
const foued = new messageActions
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
const ioChatEvents = function () {

    io.on('connection', function (socket) {
        // onMessageRead : Fired when the user read a message.
        socket.on('onMessageRead', (data) => {
            try{
                io.to(data.metaData.message).emit('read-msg', data);
                console.log('====================================');
                console.log("message read");
                console.log('====================================');
                logger.info(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                foued.readMsg(data)
            }catch(err){
                logger.error(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
            }
        }
        );
    
        // onMessagePinned : Fired when the user pin a message.
                 
        socket.on('onMessagePinned',  (data)=> {
            try{
                io.to(data.metaData.message).emit('onMessagePinned', data);
                console.log('====================================');
                console.log("message pinned");
                console.log('====================================');
                //foued.pinMsg(data)
                logger.info(`Event: onMessagePinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }catch(err){

                logger.error(`Event: onMessagePinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

            }
          
        });
        // onMessageUnpinned : Fired when the user unpin a message.
        socket.on('onMessageUnpinned',  (data)=> {
            try{
                io.to(data.metaData.message).emit('onMessageUnpinned', data);
                console.log('====================================');
                console.log("message unpinned");
                console.log('====================================');
                logger.info(`Event: onMessagePinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :" taw nzidouha , date: ${fullDate}"   \n `)
                //foued.unPinMsg()
            }catch(err){
                logger.error(`Event: onMessageUnpinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
                
            }
       
        });
        // onMessageReacted : Fired when the user add a reaction to message.
        socket.on('onMessageReacted', function (data) {
            try{
                io.to(data.metaData.message).emit('onMessageReacted', data);
                console.log('====================================');
                console.log("message reacted");
                console.log('====================================');
                logger.info(`Event: onMessageReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                //foued.reactMsg(data)
            }catch(err){
                logger.info(`Event: onMessageReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
            
        });
        // onMessageUnReacted : Fired when the user remove a reaction from message.
        socket.on('onMessageUnReacted', function (data) {
            try{
                io.to(data.metaData.message).emit('onMessageUnReacted', data);
                console.log('====================================');
                console.log("message unReacted");
                console.log('====================================');
                //foued.unReactMsg(data)
                logger.info(`Event: onMessageUnReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }catch(err){
                logger.info(`Event: onMessageUnReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
        });
        // onMentionRequest : Fired when the user add mention.
        socket.on('onMentionRequest', function (data) {
            try{
                io.to(data.metaData.conversation).emit('onMentionRequest', data);
                console.log('====================================');
                console.log("Mention Request");
                console.log('====================================');
                logger.info(`Event: onMentionRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }catch(err){
                logger.error(`Event: onMentionRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }
   
        });
        // onMentionReceived : Fired when the user remove mention.
        socket.on('onMentionReceived', function (data) {
            try{
                io.to(data.metaData.conversation).emit('onMentionReceived', data);
                console.log('====================================');
                console.log("Mention Received");
                console.log('====================================');
                logger.info(`Event: onMentionReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }catch(err){
                logger.error(`Event: onMentionReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
           
        });
        // onTypingStarted : Fired when the user start typing.
        socket.on('onTypingStarted', function (data) {
            try{
                io.to(data.metaData.conversation).emit('onTypingStarted', data);
                console.log('====================================');
                console.log(" on typing started ");
                console.log('====================================');
                logger.info(`Event: onTypingStarted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }catch(err){
                logger.error(`Event: onTypingStarted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
      
        });
        // onTypingStopped : Fired when the user stop typing.
        socket.on('onTypingStopped', function (data) {
            try{
                io.to(data.metaData.conversation).emit('onTypingStopped', data);
                console.log('====================================');
                console.log(" on typing stopped ");
                console.log('====================================');
                logger.info(`Event: onTypingStopped ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }catch(err){
                logger.error(`Event: onTypingStopped ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }
        
        });

    })

}

export default ioChatEvents