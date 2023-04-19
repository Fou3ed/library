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
import {
    getConversationById,
    putConvType
} from '../../services/conversationsRequests.js';
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
            console.log("here to add the other member in ", conversationId)
            // join room
            socket.join(conversationId);
            socket.emit('memberJoinedDone', conversationId)
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
        socket.on('onConversationMemberLeft', async (data) => {
            try {
                await foued.deleteMember(data.id).then((res) => {
                    io.to(data.metaData.conversation).emit('onConversationMemberLeft', res);

                })
                console.log('====================================');
                console.log("conversation member left ");
                console.log('====================================');
                logger.info(`Event: onConversationMemberLeft ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

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

        socket.on('transferConversation', async (data) => {

            try {

                await foued.checkMember(data.conversation_id, data.user_id).then(async (exist) => {
                    
                    if (exist.length == 0) {
                        console.log("data",data)
                    //if (user_id in the member where conversation_id=conversation id ) do not add 
                    await foued.addMember(data).then(async (res) => {
                        console.log('====================================');
                        console.log("conversation transfer ", data);
                        console.log('====================================');

                        //get the user socket_id 
                        const user = await userM.getUser(data.user_id)

                        const userActive = user.is_active
                        const status = "2"
                        await putConvType(data.conversation_id, status).then(async (res) => {
                            if (userActive) {

                                await getConversationById(data.conversation_id).then((newRes) => {

                                    io.to(user.socket_id).emit('onConversationTransferAccept', newRes,data.message_id);

                                })
                            } else {
                                console.log("agent is offline ")
                            }
                        })
                    })
                  

                    } else {
                        console.log("member is already there ")
                    }




                })
                logger.info(`Event: onConversationTransferAccept ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationTransferAccept ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

            }

        });
        socket.on('onConversationTransferAccepted', (conversationId) => {
            try {

                socket.join(conversationId)
                io.to(conversationId).emit('onConversationTransferAcceptedJoined', conversationId)

            } catch (err) {
                logger.error(`Event: onConversationTransferAccepted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)

            }
        })



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