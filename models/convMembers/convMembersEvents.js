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
import { getUserByP, getUsersById, getUsersByP } from '../../services/userRequests.js';
import {
    getCnvById,
    getConversationById,
    putConvType
} from '../../services/conversationsRequests.js';
import { socketIds } from '../connection/connectionEvents.js';
import messageActions from '../messages/messageMethods.js'
import conversationActions from '../conversations/conversationMethods.js';
import { informOperator } from '../../utils/informOperator.js';

const conversationDb = new conversationActions

const ioConversationMembersEvents = function () {

    io.on('connection', function (socket) {

        // onConversationMemberRequest : Fired when the join request created.
        socket.on('onConversationMemberCreate', async (data) => {
            try {
                await foued.addMember(data).then((res) => {
                    socket.emit('onConversationMemberCreated', res)

                })
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('onConversationMemberJoined', async (conversation) => {
            // join room
            socket.join(conversation._id);
            //  get members details
             conversation.members=await userM.getUser(conversation.members)
              socket.emit("onConversationStarted",conversation);

       
          });


          socket.on('joinConversationRoom', async (conversation) => {
            // join room
            socket.join(conversation);
    
          });
          
          
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
                
                });
                logger.info(`Event: onConversationMemberJoin, data: ${JSON.stringify(conversationId)}, socket_id: ${socket.id}, token: "" ", date: ${fullDate}"\n`);
            } catch (err) {
                logger.error(`Event: onConversationMemberJoin, data: ${JSON.stringify(conversationId)}, socket_id: ${socket.id}, token: "" ", error:${err}, date: ${fullDate}"\n`);
            }
        });




        // onConversationMemberLeft : Fired when the member left a conversation.
        socket.on('onConversationMemberLeft', async (data) => {
            try {
                await foued.deleteMember(data.id).then((res) => {
                    io.to(data.metaData.conversation).emit('onConversationMemberLeft', res);

                })
     
                logger.info(`Event: onConversationMemberLeft ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationMemberLeft ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error:${err} , date: ${fullDate}"   \n `)
            }


        });
        // onConversationMemberBanned : Fired when the member is banned.
        socket.on('onConversationMemberBanned', (data) => {
            try {
                io.to(data.roomId).emit('onConversationMemberBanned', data);
              ;
                logger.info(`Event: onConversationMemberBanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationMemberBanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error:${err} , date: ${fullDate}"   \n `)
            }

        });
        // onConversationMemberUnbanned : Fired when the member is unbanned
        socket.on('onConversationMemberUnbanned', (data) => {
            try {
                io.to(data.roomId).emit('onConversationMemberUnbanned', data);
          
                logger.info(`Event: onConversationMemberUnbanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationMemberUnbanned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error:${err} , date: ${fullDate}"   \n `)
            }
        })
        // onConversationTransferRequest : Fired when transfer created.
        socket.on('onConversationTransferRequest', (data) => {
            try {
                io.to(data.roomId).emit('onConversationTransferRequest', data);
         
                logger.info(`Event: onConversationTransferRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationTransferRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error:${err} , date: ${fullDate}"   \n `)

            }

        });

        socket.on('transferConversation', async (data) => {
            try {
                //get the conversation details from data base 
                let conversationDetails = await getCnvById(data.conversation_id);
                if (conversationDetails) {
                        // Check if the member is already in the conversation or not.
                        const exist = conversationDetails.member_details.filter(member => data.users.includes(member._id));
                        if (exist.length !== data.users.length) {
                          const user=  data.users.filter(user=>!exist.includes(user))
                            const userId = await getUsersById(user);
                            if (userId) {
                                  if (conversationDetails.conversation_type == 4) {
                                    data.conversation_type = "1";
                                } else {
                                    data.conversation_type = "2";
                                }
                                // data.user_id = userId._id.toString();
                                    data.users=userId.map(user=>user._id.toString())
                                    //add member in the conversation data base 
                                await foued.addMember(data);
        
                                // Get the user socket_id
                                conversationDetails = await getCnvById(data.conversation_id);
                                Object.entries(socketIds).forEach(([socketId, user]) => {
                                   
                                    if (data.users.find(sender => user.userId.includes(sender))) {
                                        io.to(socketId).emit("onConversationTransferAccept", conversationDetails, data.message_id);
                                    }
                                });
        


                                io.in(conversationDetails._id.toString()).emit('onConversationTransferAcceptedJoined', conversationDetails);
                                socket.emit('conversationTransferred', conversationDetails);
                                    const msgDb = new messageActions()
                                          const  userIx=socketIds[socket.id]
                                    const savedMessage = await msgDb.addMsg({
                                        app: "638dc76312488c6bf67e8fc0",
                                        user: data.user_id,
                                        action: "message.create",
                                        metaData: {
                                          type: "log",
                                          conversation_id: data.conversation_id, 
                                          user: data.user_id,
                                          message: JSON.stringify( {
                                            "user_id": data.user_id,
                                            "action": "transfer",
                                            "log_date": currentDate,
                                            "list_of_users":data.users,
                                            "message_id":data.message_id,
                                            ...(userIx.role === 'ADMIN' ? {admin:true} : {})
                                          }
                                            
                                        ),
                                          origin: "web",
                                        }
                                      });



                                      const conversationData = await conversationDb.getCnv(conversationDetails._id.toString());
                                      if (conversationData.status == 0) {
                                        let eventName="conversationTransferred"
                                        let eventData= [conversationDetails]
                                        try{
                                          informOperator(io,socket.id,conversationData,eventName,eventData);
                                        }catch(err){
                                          console.log("informOperator err",err)
                                          throw err;
                                        }
                                      }


                                      const messageData = {
                                        content: savedMessage.message,
                                        id: savedMessage._id,
                                        from: data.user_id,
                                        conversation: data.conversation_id,
                                        date: savedMessage.created_at,
                                        type:"log",
                                        paid:false
                                      };
                                      
                                      io.in(conversationDetails._id.toString()).emit('onMessageReceived',{
                                        messageData,
                                        conversation:data.conversation_id,
                                        userId: data.user_id,
                                      })


                                      if (conversationData.status == 0) {
                                        let eventName="onMessageReceived"
                                        let eventData= [{
                                            messageData,
                                            conversation:data.conversation_id,
                                            userId: data.user_id,
                                          }]
                                        try{
                                          informOperator(io,socket.id,conversationData,eventName,eventData);
                                        }catch(err){
                                          console.log("informOperator err",err)
                                          throw err;
                                        }
                                      }


                            }
                        } else {
                            socket.emit('onConversationTransferFailed', { exist: true });
                        }
                    
                }
                logger.info(`Event: onConversationTransferAccept ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `);
            } catch (err) {
                socket.emit('onConversationTransferFailed', { error: true });
                console.log("err", err);
                logger.error(`Event: onConversationTransferAccept ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error:${err} , date: ${fullDate}"   \n `);
            }
        });
        
        socket.on('onConversationTransferAccepted', (conversationId) => {
            try {
                socket.join(conversationId)
            } catch (err) {
                logger.error(`Event: onConversationTransferAccepted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error:${err} , date: ${fullDate}"   \n `)
            }
        })



        // onConversationTransferReject : Fired when user reject transfer.
        socket.on('onConversationTransferReject', (data) => {
            try {
                io.to(data.roomId).emit('onConversationTransferReject', data);
              
                logger.info(`Event: onConversationTransferReject ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onConversationTransferReject ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error:${err} , date: ${fullDate}"   \n `)
            }
        });


        socket.on('removeConversationMember', async (data) => {
            try {
                //get the conversation details from data base 
                let conversationDetails = await getCnvById(data.conversation_id);
                if (conversationDetails) {
                    // Check if the member is already in the conversation or not.
                    const exist = conversationDetails.member_details.find(member => data.user_id === member._id.toString());
                    if (exist) {
                        if (conversationDetails.members.length > 2) {
                            
                            const user = await getUserByP(exist.id);
                            if (user) {
                                
                                if (user.role !== 'CLIENT') {
                                    if (conversationDetails.members.length === 3) {
                                        data.conversation_type = "2";
                                    }
                                    await foued.removeMember(data.conversation_id, user._id.toString(), conversationDetails.members.length === 3 ? "2" : conversationDetails.conversation_type);
                                    // Get the user socket_id
                                    conversationDetails = await getCnvById(data.conversation_id);
                                    Object.entries(socketIds).forEach(([socketId, socketUser]) => {
                                        if (user._id.toString() == user.userId) {
                                            io.to(socketId).emit("conversationMemberRemoved", data.conversation_id, user._id.toString());
                                        }
                                    });
                                    io.in(conversationDetails._id.toString()).emit("conversationMemberRemoved", data.conversation_id, user._id.toString());
                                    socket.emit('removeConversationMemberSuccess', data.conversation_id, user._id.toString());
                                    const msgDb = new messageActions()
                                    const socketUser = socketIds[socket.id]
                                    const savedMessage = await msgDb.addMsg({
                                        app: "638dc76312488c6bf67e8fc0",
                                        user: socketUser.userId,
                                        action: "message.create",
                                        metaData: {
                                            type: "log",
                                            conversation_id: data.conversation_id,
                                            user: socketUser.userId,
                                            message: JSON.stringify({
                                                "user_id": socketUser.userId,
                                                "action": "remove member",
                                                "log_date": currentDate,
                                                "member": user,
                                                ...(socketUser.role ==='ADMIN' ? {admin: true} : {})
                                            }),
                                            origin: "web",
                                        }
                                    });

                                    const conversationData = await conversationDb.getCnv(conversationDetails._id.toString());
                                    if (conversationData.status == 0) {
                                        let eventName = "conversationMemberRemoved"
                                        let eventData = [data.conversation_id, user._id.toString()]
                                        try {
                                            informOperator(io, socket.id, conversationData, eventName, eventData);
                                        } catch (err) {
                                            console.log("informOperator err", err)
                                            throw err;
                                        }
                                    }

                                    const messageData = {
                                        content: savedMessage.message,
                                        id: savedMessage._id,
                                        from: socketUser.userId,
                                        conversation: data.conversation_id,
                                        date: savedMessage.created_at,
                                        type: "log",
                                        paid: false
                                    };

                                    io.in(conversationDetails._id.toString()).emit('onMessageReceived', {
                                        messageData,
                                        conversation: data.conversation_id,
                                        userId: socketUser.userId.toString(),
                                    })

                                    if (conversationData.status == 0) {
                                        let eventName = "onMessageReceived"
                                        let eventData = [{
                                            messageData,
                                            conversation: data.conversation_id,
                                            userId: socketUser.userId.toString(),
                                        }]
                                        try {
                                            informOperator(io, socket.id, conversationData, eventName, eventData);
                                        } catch (err) {
                                            console.log("informOperator err", err)
                                            throw err;
                                        }
                                    }
                                } else {
                                    socket.emit('removeConversationMemberFailure','client');
                                }
                            } else {
                                socket.emit('removeConversationMemberFailure', 'user_not_found');
                            }
                        } else {
                            socket.emit('removeConversationMemberFailure', 'direct_conversation');
                        }
                    } else {
                        socket.emit('removeConversationMemberFailure', 'user_not_found');
                    }
                }
                logger.info(`Event: removeConversationMemberFailure ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `);
            } catch (err) {
                socket.emit('removeConversationMemberFailure', 'error');
                console.log("err", err);
                logger.error(`Event: removeConversationMemberFailure ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error:${err} , date: ${fullDate}"   \n `);
            }
        });


    })
}
export default ioConversationMembersEvents