import convMembers from './convMembersMethods.js';
import {
    io
} from '../../index.js';
import logger from '../../config/newLogger.js'
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
const foued = new convMembers()
import convMembersAction from '../convMembers/convMembersMethods.js'
const convMember = new convMembersAction()
import userMethod from '../user/userMethods.js'
const userM = new userMethod()
const ioConversationMembersEvents = function () {

    io.on('connection', function (socket) {

        // onConversationMemberRequest : Fired when the join request created.
        socket.on('onConversationMemberCreate', async (data) => {
            try {
                console.log('====================================');
                console.log('conversation member created');
                console.log('====================================');

                await foued.addMember(data).then((res) => {
                    socket.emit('onConversationMemberCreated', res)

                })
            } catch (err) {
                console.log(err);
            }
        });
        socket.on('onConversationMemberJoined', async (conversationId) => {
            console.log("here to add the other member in ",conversationId)
      // join room
      socket.join(conversationId);
            socket.emit('memberJoinedDone',conversationId)
})

        socket.on('onConversationMemberJoin', async (info, conversationId) => {
            try {

                const members = await convMember.getConversationMembers(conversationId);
                const specificSocketsToJoin = await Promise.all(members.map(async (member) => {
                    const socket_id = await userM.getUser(member);
                    return socket_id;
                }));

                // Join the sender to the conversation(room)
                socket.join(conversationId);    

                // Emit the event to the other members of the conversation
                const otherSocketsToJoin = specificSocketsToJoin.filter((socket_id) => socket_id !== socket.id);
                otherSocketsToJoin.forEach((socket_id) => {
                    io.to(socket_id).emit('JoinConversationMember', socket.id, info, conversationId);
                    console.log('====================================');
                    console.log(" Join conversation member");
                    console.log('====================================');
                });
                logger.info(`Event: onConversationMemberJoin, data: ${JSON.stringify(conversationId)}, socket_id: ${socket.id}, token: "taw nzidouha, date: ${fullDate}"\n`);
            } catch (err) {
                logger.error(`Event: onConversationMemberJoin, data: ${JSON.stringify(conversationId)}, socket_id: ${socket.id}, token: "taw nzidouha, error:${err}, date: ${fullDate}"\n`);
            }
        });

   


        // onConversationMemberLeft : Fired when the member left a conversation.
        socket.on('onConversationMemberLeft', (data) => {
            try {
                io.to(data.metaData.conversation).emit('onConversationMemberLeft', data);
                console.log('====================================');
                console.log("conversation member left ");
                console.log('====================================');
                logger.info(`Event: onConversationMemberLeft ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                //foued.updateConvMember()
            } catch (err) {
                logger.error(`Event: onConversationMemberLeft ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
            }


        });
        // onConversationMemberBanned : Fired when the member is banned.
        socket.on('onConversationMemberBanned', (data) => {
            try {
                io.to(data.roomId).emit('onConversationMemberBanned', data);
                console.log('====================================');
                console.log("conversation member left");
                console.log('====================================');
                logger.info(`Event: onConversationMemberBanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationMemberBanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
            }

        });
        // onConversationMemberUnbanned : Fired when the member is unbanned
        socket.on('onConversationMemberUnbanned', (data) => {
            try {
                io.to(data.roomId).emit('onConversationMemberUnbanned', data);
                console.log('====================================');
                console.log("conversation member unbanned");
                console.log('====================================');
                logger.info(`Event: onConversationMemberUnbanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationMemberUnbanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
            }

        });

        // onConversationTransferRequest : Fired when transfer created.
        socket.on('onConversationTransferRequest', (data) => {
            try {
                io.to(data.roomId).emit('onConversationTransferRequest', data);
                console.log('====================================');
                console.log("conversation transfer request");
                console.log('====================================');
                logger.info(`Event: onConversationTransferRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationTransferRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

            }

        });
        //   socket.on('onConversationMemberRequest', async (conversationId) => {
        //     try{
        //         console.log('====================================');
        //         console.log("conversation member request");
        //         console.log('====================================');
        //         const members = await convMember.getConversationMembers(conversationId);
        //         const specificSocketsToJoin = await Promise.all(members.map(async (member) => {
        //           const socket_id = await userM.getUser(member);
        //           return socket_id;
        //         }));
        //         // Emit the event to the sender and receiver sockets
        //         specificSocketsToJoin.forEach((socket_id) => {
        //             io.to(socket_id).emit('onConversationMemberJoined',socket_id, conversationId);
        //         });

        //         logger.info(`Event: onConversationMemberRequest ,data: ${JSON.stringify(conversationId)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
        //     }catch(err){
        //         logger.error(`Event: onConversationMemberRequest ,data: ${JSON.stringify(conversationId)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
        //     }
        // });

        // onConversationTransferAccept : Fired when user accept transfer.
        socket.on('onConversationTransferAccept', (data) => {
            try {
                io.to(data.roomId).emit('onConversationTransferAccept', data);

                console.log('====================================');
                console.log("conversation transfer accepted");
                console.log('====================================');
                logger.info(`Event: onConversationTransferAccept ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationTransferAccept ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

            }

        });

        // onConversationTransferReject : Fired when user reject transfer.
        socket.on('onConversationTransferReject', (data) => {
            try {
                io.to(data.roomId).emit('onConversationTransferReject', data);
                console.log('====================================');
                console.log("conversation transfer Reject");
                console.log('====================================');
                logger.info(`Event: onConversationTransferReject ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationTransferReject ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

            }

        });
    })
}
export default ioConversationMembersEvents