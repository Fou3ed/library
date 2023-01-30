import convMembers from './convMembersMethods.js';
import {
    io
} from '../../index.js';
import logger from '../../config/newLogger.js'
import * as info from '../../data.js'

const foued = new conversationActions

const ioConversationMembersEvents = function () {


    // onConversationMemberRequest : Fired when the join request created.
    socket.on('onConversationMemberRequest', (data) => {
        try{
            io.to(data.roomId).emit('onConversationMemberRequest', data);
            console.log('====================================');
            console.log("conversation member request");
            console.log('====================================');
            logger.info(`Event: onConversationMemberRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
        }catch(err){
            logger.error(`Event: onConversationMemberRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

        }
    
    });
    // onConversationMemberJoined : Fired when the member join a conversation.
    socket.on('onConversationMemberJoined', (data) => {
        try{
            io.to(data.metaData.conversation).emit('onConversationMemberJoined', data);
            console.log('====================================');
            console.log("conversation member joined");
            console.log('====================================');
            foued.addMember(data).then((res)=>{
                socket.emit('onConversationMemberJoined',info.onConversationMemberJoined,res)
            })
            logger.info(`Event: onConversationMemberJoined ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

        }catch(err){
            logger.error(`Event: onConversationMemberJoined ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

        }
     
    });
    // onConversationMemberLeft : Fired when the member left a conversation.
    socket.on('onConversationMemberLeft', (data) => {
        try{
            io.to(data.metaData.conversation).emit('onConversationMemberLeft', data);
            console.log('====================================');
            console.log("conversation member left ");
            console.log('====================================');
            logger.info(`Event: onConversationMemberLeft ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            //foued.updateConvMember()
        }catch(err){
            logger.error(`Event: onConversationMemberLeft ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
        }

        
    });
    // onConversationMemberBanned : Fired when the member is banned.
    socket.on('onConversationMemberBanned', (data) => {
        try{
            io.to(data.roomId).emit('onConversationMemberBanned', data);
            console.log('====================================');
            console.log("conversation member left");
            console.log('====================================');
            logger.info(`Event: onConversationMemberBanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            
        }catch(err){
            logger.error(`Event: onConversationMemberBanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
        }
       
    });
    // onConversationMemberUnbanned : Fired when the member is unbanned
    socket.on('onConversationMemberUnbanned', (data) => {
        try{
            io.to(data.roomId).emit('onConversationMemberUnbanned', data);
            console.log('====================================');
            console.log("conversation member unbanned");
            console.log('====================================');
            logger.info(`Event: onConversationMemberUnbanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

        }catch(err){
            logger.error(`Event: onConversationMemberUnbanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
        }
       
    });

    // onConversationTransferRequest : Fired when transfer created.
    socket.on('onConversationTransferRequest', (data) => {
        try{
            io.to(data.roomId).emit('onConversationTransferRequest', data);
            console.log('====================================');
            console.log("conversation transfer request");
            console.log('====================================');
            logger.info(`Event: onConversationTransferRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

        }catch(err){
            logger.error(`Event: onConversationTransferRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

        }
     
    });


    // onConversationTransferAccept : Fired when user accept transfer.
    socket.on('onConversationTransferAccept', (data) => {
        try{
            io.to(data.roomId).emit('onConversationTransferAccept', data);

            console.log('====================================');
            console.log("conversation transfer accepted");
            console.log('====================================');
            logger.info(`Event: onConversationTransferAccept ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

        }catch(err){
            logger.error(`Event: onConversationTransferAccept ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

        }

    });

    // onConversationTransferReject : Fired when user reject transfer.
    socket.on('onConversationTransferReject', (data) => {
        try{
            io.to(data.roomId).emit('onConversationTransferReject', data);
            console.log('====================================');
            console.log("conversation transfer Reject");
            console.log('====================================');
            logger.info(`Event: onConversationTransferReject ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

        }catch(err){
            logger.error(`Event: onConversationTransferReject ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

        }
 
    });
}

export default ioConversationMembersEvents