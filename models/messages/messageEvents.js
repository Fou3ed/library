import messageActions from "./messageMethods.js";
import convMembersAction from "../convMembers/convMembersMethods.js";
import userMethod from "../user/userMethods.js";
import conversationActions from "../conversations/conversationMethods.js";
import { socketIds } from "../connection/connectionEvents.js";
import axios from "axios";
import { io } from "../../index.js";
const msgDb = new messageActions();
const convMember = new convMembersAction();
const userM = new userMethod();
const conversationAct = new conversationActions();
import logger from "../../config/newLogger.js";

import { clientBalance } from "../connection/connectionEvents.js";
import {
  putUserBalance,
  putBuyBalance,
  getUsersByP,
  getOperators,
  putUserFreeBalance,
  getUsersById,
  userTotalMessages,
  ClientTotalMessages,
} from "../../services/userRequests.js";
import {
  findMessageWithSiblings,
  getConversationMessages,
  getMessage,
  getSocketConversationMessages,
  putLinkMessage,
  updateAllMessages,
} from "../../services/messageRequests.js";
import { addMember } from "../../services/convMembersRequests.js";
import {
  deleteRobot,
  getCnvById,
  getConversationById,
  getConversationMemberIds,
  getConvBetweenUserAndAgent,
  deleteConversation,
  putCnvStatus,
  getAllTotalConversationsDetails,
  conversationTotalMessages} from "../../services/conversationsRequests.js";
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
import message from "../messages/messageModel.js";
import process from "process";
import { dotenv } from "../../dependencies.js";
import { informOperator } from "../../utils/informOperator.js";
import addLogs from "../../utils/addLogs.js";
const ioMessageEvents = function () {
  dotenv.config();
  io.on("connection",async  function (socket) {
    socket.on("onMessageCreated", async (data, error) => {
     try {
        const sender = socketIds[socket.id];
        if (sender && sender.userId.includes(data.user)) {

          const senderId = data.user;
          const conversationData = await conversationAct.getCnv(
            data.metaData.conversation_id
          );
          if(conversationData.status == 1 || conversationData.status ==0 ){
            const updatedConversation = await  putCnvStatus(data.metaData.conversation_id,conversationData.status,socket)
            let eventName = "cnvStatusUpdated";
            let eventData = [
              {
                conversationId:updatedConversation._id.toString(),
                status:updatedConversation.status
              },
            ];

            try {
              informOperator(
                io,
                socket.id,
                updatedConversation,
                eventName,
                eventData
              );
            } catch (err) {
              console.log("informOperator err", err);
              throw err;
            }
          }

          const memberIds = await getConversationMemberIds(
            data.metaData.conversation_id
          );
          let agentId = null;
          for (const member of memberIds) {
            if (member.role === "AGENT") {
              agentId = member.id;
              break;
            }
          }
          const exist = conversationData.members.includes(senderId);
          
          if (
            exist ||
            (conversationData.conversation_type == "4" &&
              ["AGENT", "ADMIN"].includes(sender.role) &&
              conversationData.owner_id == sender.accountId)
          ) {
            if (!exist) {
              const conversationData = await getCnvById(
                data.metaData.conversation_id
              );
              const clientIdObject = conversationData.members.find(
                (member) => member.user_id.toString() !== process.env.ROBOT_ID
              );  
              const conversationBetweenAgentAndClient=await getConvBetweenUserAndAgent(senderId,clientIdObject.user_id.toString())
                  if((conversationBetweenAgentAndClient.length==0)){
                    await addMember({
                      user_id: senderId,
                      conversation_id: data.metaData.conversation_id,
                    });
                    await deleteRobot(
                      data.metaData.conversation_id,
                      process.env.ROBOT_ID
                    );
                    const sentId = [];
                    conversationData.members.forEach((member) => {
                      sentId.push(member.user_id.toString());
                    });
                    Object.entries(socketIds).forEach(([socketId, user]) => {
                      if (user.accountId === sender.accountId) {
                        if (user.role === "ADMIN" || sentId.includes(user.userId)) {
                          sentId.push(socketId);
                          if (socketId === socket.id) {
                            socket.emit(
                              "conversationStatusUpdated",
                              conversationData,
                              1
                            );
                          } else {
                            io.to(socketId).emit(
                              "conversationStatusUpdated",
                              conversationData,
                              1,
                              "robotUpdated"
                            );
                          }
                        } else {
                          io.to(socketId).emit(
                            "robotConversationUpdated",
                            conversationData._id
                          );
                        }
                      }
                    });
                  }else {
                      const updatedMessages =  await  updateAllMessages(data.metaData.conversation_id,conversationBetweenAgentAndClient[0]._id)
                      const deletedCnv=await deleteConversation(data.metaData.conversation_id)
                      data.metaData.conversation_id=conversationBetweenAgentAndClient[0]._id.toString()
                      const savedMessage = await msgDb.addMsg(data);
                      io.in(conversationBetweenAgentAndClient[0]._id.toString()).emit("mergeConversation",{messagesIds:updatedMessages,deletedConversationId:deletedCnv._id,newConversation:conversationBetweenAgentAndClient[0]._id})                    
                  }
                  return;
            }
            const userBalance = clientBalance[senderId];
            if (userBalance && data?.metaData.type === "MSG") {
              if (Number(userBalance?.free_balance) > 0)   {
                data.metaData.paid = false;
                const savedMessage = await msgDb.addMsg(data);
                userBalance.free_balance = (
                  parseInt(userBalance.free_balance) - 1
                ).toString();
                await putUserFreeBalance(userBalance.user, userBalance.free_balance);
                const messageData = {
                  content: data.metaData.message,
                  id: savedMessage._id,
                  from: data.user,
                  conversation: data.metaData.conversation_id,
                  senderName: data.metaData.senderName,
                  date: savedMessage.created_at,
                  uuid: data.uuid,
                  type: data.metaData.type,
                  paid: false,
                  status: conversationData.status,
                  agent_id:agentId,
                  user_data:memberIds.find(member=>member._id ==agentId),

                };
                if (data.metaData.type === "log") {
                  addLogs(data.logData);
                }
                if (
                  data.metaData.type !== "log" ||
                  data.logData?.action !== "focus" || data.metaData.type !=="bloc"
           
                ) {       socket.emit("onMessageSent", {
                    ...messageData,
                    isSender: true,
                    direction: "in",
                    conversationName: conversationData.name,
                    temporary_id: data.metaData?.temporary_id,
                    userBalance: userBalance?.balance,
                    userFreeBalance:userBalance?.free_balance
                  });
                  socket.to(data.metaData.conversation_id).emit(
                    "onMessageReceived",
                    {
                      messageData,
                      conversation: data.metaData.conversation_id,
                      isSender: false,
                      direction: "out",
                      userId: data.user,
                      conversationName: conversationData.name,
                      aux: data.aux,
                      userBalance:userBalance?.balance,
                      userFreeBalance:userBalance?.free_balance

                    },

                  );

                  if (conversationData.status != 1) {
                    let eventName = "onMessageReceived";
                    let eventData = [
                      {
                        messageData,
                        conversation: data.metaData.conversation_id,
                        isSender: false,
                        direction: "out",
                        userId: data.user,
                        conversationName: conversationData.name,
                        aux: data.aux,
                        userBalance: userBalance?.balance,
                        userFreeBalance:userBalance?.free_balance
                      },
                    ];

                    try {
                      informOperator(
                        io,
                        socket.id,
                        conversationData,
                        eventName,
                        eventData
                      );
                    } catch (err) {
                      console.log("informOperator err", err);
                      throw err;
                    }
                  }
                }
              } else 
              if (Number(userBalance?.balance) > 0)   {
                data.metaData.paid = true;
                const savedMessage = await msgDb.addMsg(data);
                userBalance.balance = (
                  parseInt(userBalance.balance) - 1
                ).toString();
                await putUserBalance(userBalance.user, userBalance.balance);
                const messageData = {
                  content: data.metaData.message,
                  id: savedMessage._id,
                  from: data.user,
                  conversation: data.metaData.conversation_id,
                  senderName: data.metaData.senderName,
                  date: savedMessage.created_at,
                  uuid: data.uuid,
                  type: data.metaData.type,
                  paid: true,
                  status: conversationData.status,
                  agent_id:agentId,
                
                };
                if (data.metaData.type === "log") {
                  addLogs(data.logData);
                }
                if (
                  data.metaData.type !== "log" ||
                  data.logData?.action !== "focus" || data.metaData.type !=="bloc"
                ) {
                  socket.emit("onMessageSent", {
                    ...messageData,
                    isSender: true,
                    direction: "in",
                    conversationName: conversationData.name,
                    temporary_id: data.metaData?.temporary_id,
                    userBalance: userBalance?.balance,
                    userFreeBalance:userBalance?.free_balance
                  });
                  socket.to(data.metaData.conversation_id).emit(
                    "onMessageReceived",
                    {
                      messageData,
                      conversation: data.metaData.conversation_id,
                      isSender: false,
                      direction: "out",
                      userId: data.user,
                      conversationName: conversationData.name,
                      aux: data.aux,
                      userBalance: userBalance?.balance,
                      userFreeBalance:userBalance?.free_balance
                    },
                    userBalance.balance
                  );

                  if (conversationData.status == 0) {
                    let eventName = "onMessageReceived";
                    let eventData = [
                      {
                        messageData,
                        conversation: data.metaData.conversation_id,
                        isSender: false,
                        direction: "out",
                        userId: data.user,
                        conversationName: conversationData.name,
                        aux: data.aux,
                        userBalance: userBalance?.balance,
                        userFreeBalance:userBalance?.free_balance
                      },
                    ];

                    try {
                      informOperator(
                        io,
                        socket.id,
                        conversationData,
                        eventName,
                        eventData
                      );
                    } catch (err) {
                      console.log("informOperator err", err);
                      throw err;
                    }
                  }
                }
              } 
            } else {
              data.metaData.paid = false;

              const savedMessage = await msgDb.addMsg(data);

              const messageData = {
                content: data.metaData.message,
                id: savedMessage._id,
                from: data.user,
                conversation: data.metaData.conversation_id,
                date: savedMessage.created_at,
                uuid: data.uuid,
                type: data.metaData.type,
                paid: false,
                status: conversationData.status,
                agent_id:agentId,
                user_data:memberIds.find(member=>member._id.toString() == data.user),

              };
       
              if (data.metaData.type === "log") {
                addLogs(data.logData);
              }
              if (
                data.metaData.type !== "log" ||
                data.logData?.action !== "focus"
              ) {
                getConversationById();
                socket.emit("onMessageSent", {
                  ...messageData,
                  isSender: true,
                  direction: "in",
                  conversationName: conversationData.name,
                  temporary_id: data.metaData?.temporary_id,
                  
                });

                socket
                  .to(data.metaData.conversation_id)
                  .emit("onMessageReceived", {
                    messageData,
                    senderName: data.metaData.senderName,
                    conversation: data.metaData.conversation_id,
                    isSender: false,
                    direction: "out",
                    userId: data.user,
                    conversationName: conversationData.name,
                    aux: data.aux,
                    userBalance: userBalance?.balance,
                    userFreeBalance:userBalance?.free_balance
                  });
                if (conversationData.status == 0) {
                  let eventName = "onMessageReceived";
                  let eventData = [
                    {
                      messageData,
                      conversation: data.metaData.conversation_id,
                      isSender: false,
                      direction: "out",
                      userId: data.user,
                      conversationName: conversationData.name,
                      aux: data.aux,
                      userBalance: userBalance?.balance,
                      userFreeBalance:userBalance?.free_balance
                    },
                  ];
                  try {
                    informOperator(
                      io,
                      socket.id,
                      conversationData,
                      eventName,
                      eventData
                    );
                  } catch (err) {
                    console.log("informOperator err", err);
                    throw err;
                  }
                }
              }
            }
          }
        } 

      } catch (err) {
        console.error(`Error while processing message: ${err}`);
        logger.error(
          `Event: onMessageCreated, data: ${JSON.stringify(data)}, socket_id: ${socket.id
          }, token: "" "", error: ${err}, date: ${fullDate}`
        );
      }
    });

    socket.on("onConversationMemberJoined", async (conversationId) => {
      socket.join(conversationId._id);
    });

    socket.on("receiveMessageForwarded", async (conversationId, data) => {
      const conversationData = await conversationAct.getCnv(conversationId);
      const conversationName = conversationData.name;
      // Emit an event to all members of the conversation except the sender to indicate that a new message was received
      socket.to(conversationId).emit("onMessageReceivedForwarded", {
        messageData: data,
        isSender: false,
        direction: "out",
        conversationName: conversationName,
      });

      if (conversationData.status == 0) {
        let eventName = "onMessageReceivedForwarded";
        let eventData = [
          {
            messageData: data,
            isSender: false,
            direction: "out",
            conversationName: conversationName,
          },
        ];
        try {
          informOperator(io, socket.id, conversationData, eventName, eventData);
        } catch (err) {
          console.log("informOperator err", err);
          throw err;
        }
      }
    });

    socket.on("onMessageDelivered", (data) => {
      // Emit an event to the sender of the message to indicate that the message was delivered
      socket.emit("onMessageDelivered", data);
    });
    io.on("connect_error", (err) => {
      console.error(`An error occurred: ${err.message}`);
    });
    // onMessageUpdated : Fired when the message data updated.
    socket.on("updateMessage", async (data) => {
      try {

        const sender = socketIds[socket.id];
        
        const userBalance = clientBalance[sender.userId];

        if (userBalance && ((Number(userBalance.free_balance) > 0 && userBalance.free_balance--) || (Number(userBalance.balance) > 0 && userBalance.balance--))) {
          await putUserBalance(userBalance.user, userBalance.balance, userBalance.free_balance);
        
        
        await msgDb
          .putMsg(data.metaData.message, data.metaData.fields.content)
          .then(async (res) => {
            socket.to(data.metaData.conversation).emit("onMessageUpdated", {res:res,userBalance:userBalance?.balance});
            socket.emit("onMessageUpdated", {res:res,userBalance:userBalance?.balance});
            const conversationData = await conversationAct.getCnv(
              data.metaData.conversation
            );
            if (conversationData.status == 0) {
              let eventName = "onMessageUpdated";
              let eventData = [{res:res,userBalance:userBalance?.balance}];
              try {
                informOperator(
                  io,
                  socket.id,
                  conversationData,
                  eventName,
                  eventData
                );
              } catch (err) {
                console.log("informOperator err", err);
                throw err;
              }
            }
          });
        logger.info(
          `Event: onMessageUpdated ,data: ${JSON.stringify(
            data
          )} , socket_id : ${socket.id
          } ,token :"" " , date: ${fullDate}"   \n `
        );
        }else {
          console.log("update impossible no balance")
        }
      } catch (err) {
        logger.error(
          `Event: onMessageUpdated ,data: ${JSON.stringify(
            data
          )} , socket_id : ${socket.id
          } ,token :"" " ,error ${err}, date: ${fullDate} "   \n `
        );
      }
    });

    // onMessageDeleted : Fired when the message deleted

    socket.on("onMessageDeleted", async (data) => {
      try {
        //change this to update status = 0 means the message is deleted .
        msgDb.deleteMsg(data).then(async (res) => {
          socket.to(data.metaData.conversation).emit("onMessageDeleted", res);
          socket.emit("onMessageDeleted", res);

          const conversationData = await conversationAct.getCnv(
            data.metaData.conversation
          );
          if (conversationData.status == 0) {
            let eventName = "onMessageDeleted";
            let eventData = [res];
            try {
              informOperator(
                io,
                socket.id,
                conversationData,
                eventName,
                eventData
              );
            } catch (err) {
              console.log("informOperator err", err);
              throw err;
            }
          }
        });
        logger.info(
          `Event: onMessageDeleted ,data: ${JSON.stringify(
            data
          )} , socket_id : ${socket.id
          } ,token :"" " , date: ${fullDate}"   \n `
        );
      } catch (err) {
        logger.error(
          `Event: onMessageDeleted ,data: ${JSON.stringify(
            data
          )} , socket_id : ${socket.id
          } ,token :"" " ,error ${err}, date: ${fullDate} "   \n `
        );
      }
    });

    socket.on("forwardMessage", async (data) => {
      //check if they have a conversation together else create one (user 1 and user 2)
      //data will have an array of the users who are gonna receive the message
      //the user can forward the message to multiple
      try {
        const messageContent = await message.findById(data.message_id);

        if (messageContent) {
          const senderId = socketIds[socket.id];

          if(!senderId.userId.includes(data.user_id)){
            socket.emit("onMessageForwardFailed", "unauthorized");
              return;
          }

          const receiver = data.users;
          const userIds = await getUsersById(receiver);

          if (userIds.length > 0) {
            for (let userId of userIds) {
              const conversationData =
                await conversationAct.getPrivateConvBetweenUsers(
                  userId._id.toString(),
                  data.user_id
                );

              const date = currentDate;
              if (conversationData) {
                const savingMessage = {
                  app: messageContent.app,
                  user: data.user_id,
                  action: "message.forward",
                  metaData: {
                    type: messageContent.type,
                    conversation_id: conversationData._id.toString(),
                    user: data.user_id,
                    message: messageContent.message,
                    status: "3",
                    origin: "web",
                  },
                };
                msgDb.addMsg(savingMessage).then((savedMessage) => {
                  socket.emit("onMessageForwardSent", {
                    content: savedMessage.message,
                    id: savedMessage._id,
                    conversation: conversationData._id.toString(),
                    date,
                    type: savingMessage.type,
                    status: savingMessage.status,
                  });

                  if (conversationData?.status == 0) {
                    let eventName = "onMessageForwardSent";
                    let eventData = [
                      {
                        content: savedMessage.message,
                        id: savedMessage._id,
                        conversation: conversationData._id.toString(),
                        date,
                        type: savingMessage.type,
                        status: savingMessage.status,
                      },
                    ];
                    try {
                      informOperator(
                        io,
                        socket.id,
                        conversationData,
                        eventName,
                        eventData
                      );
                    } catch (err) {
                      console.log("informOperator err", err);
                      throw err;
                    }
                  }

                  const messageData = {
                    content: savedMessage.message,
                    id: savedMessage._id,
                    from: data.user_id,
                    conversation: conversationData._id.toString(),
                    date: savedMessage.created_at,
                    uuid: data.uuid,
                    type: savedMessage.type,
                    status: savedMessage.status,
                    paid: false,
                  };

                  io.in(conversationData._id.toString()).emit(
                    "onMessageReceived",
                    {
                      messageData,
                      conversation: conversationData._id.toString(),
                      isSender: false,
                      direction: "out",
                      userId: data.user_id,
                    }
                  );

                  if (conversationData.status == 0) {
                    let eventName = "onMessageReceived";
                    let eventData = [
                      {
                        messageData,
                        conversation: conversationData._id.toString(),
                        isSender: false,
                        direction: "out",
                        userId: data.user_id,
                      },
                    ];
                    try {
                      informOperator(
                        io,
                        socket.id,
                        conversationData,
                        eventName,
                        eventData
                      );
                    } catch (err) {
                      console.log("informOperator err", err);
                      throw err;
                    }
                  }
                });
              } else {
      
                //never spoke ,create conversation then conversation members
                const conversationInfo = {
                  app: messageContent.app,
                  user: data.user_id,
                  action: "conversation.create",
                  metaData: {
                    name: "test",
                    channel_url: "msgDb/test",
                    conversation_type: "1",
                    description: "private chat",
                    operators: [],
                    status: "1",

                    owner_id: senderId.accountId,
                    members: [data.user_id, userId._id.toString()],
                    members_count: 2,
                    max_length_message: "256",
                  },
                };
                const res=await conversationAct.addCnv(conversationInfo)
             
                  if (res) {
                    const savingMessage = {
                      app: messageContent.app,
                      user: data.user_id,
                      action: "message.forward",
                      metaData: {
                        type: messageContent.type,
                        conversation_id: res._id.toString(),
                        user: data.user_id,
                        origin: "web",
                        message: messageContent.message,
                        status: "3",
                      },
                    };

                    const conversationInfo = await getCnvById(
                      res._id.toString()
                    ); 
                    const sentId = [];
                    conversationInfo.members.forEach((member) => {
                      sentId.push(member.user_id.toString());
                    });
                    Object.entries(socketIds).forEach(([socketId, user]) => {
                      if (

                        (user.role === "ADMIN" &&
                          user.accountId === senderId.accountId) ||
                        sentId.find(sender => user.userId.includes(sender))
                      ) {
                        sentId.push(socketId);
                        if (socketId === socket.id) {
                          socket.emit(
                            "conversationStatusUpdated",
                            conversationInfo,
                            1
                          );
                        } else {
                          io.to(socketId).emit(
                            "conversationStatusUpdated",
                            conversationInfo,
                            1
                          );
                        }
                      }
                    });
                    const savedMessage=await msgDb.addMsg(savingMessage)
                   if (savedMessage) {
                      socket.emit("onMessageForwardSent", {
                        content: savedMessage.message,
                        id: savedMessage._id,
                        conversation: res._id.toString(),
                        date,
                        type: savingMessage.status,
                      });
                      const messageData = {
                        content: savedMessage.message,
                        id: savedMessage._id,
                        from: data.user_id,
                        conversation: res._id.toString(),
                        date: savedMessage.created_at,
                        uuid: data.uuid,
                        type: savedMessage.type,
                        paid: false,
                      };

                      io.in(res._id.toString()).emit("onMessageReceived", {
                        messageData,
                        conversation: res._id.toString(),
                        isSender: false,
                        direction: "out",
                        userId: data.user_id,
                      });

                      if (conversationInfo.status == 0) {
                        let eventName = "onMessageReceived";
                        let eventData = [
                          {
                            messageData,
                            conversation: res._id.toString(),
                            isSender: false,
                            direction: "out",
                            userId: data.user_id,
                          },
                        ];
                        try {
                          informOperator(
                            io,
                            socket.id,
                            conversationInfo,
                            eventName,
                            eventData
                          );
                        } catch (err) {
                          console.log("informOperator err", err);
                          throw err;
                        }
                      }
                    }
                  }
                };
            }
          } else {
            socket.emit("onMessageForwardFailed");
            const conversationData = await conversationAct.getCnv(
              data.conversation_id
            );
            if (conversationData.status == 0) {
              let eventName = "onMessageForwardFailed";
              let eventData = ["users_not_found"];
              try {
                informOperator(
                  io,
                  socket.id,
                  conversationData,
                  eventName,
                  eventData
                );
              } catch (err) {
                console.log("informOperator err", err);
                throw err;
              }
            }
          }
        } else {
          socket.emit("onMessageForwardFailed", "message_not_found");
          const conversationData = await conversationAct.getCnv(
            data.conversation_id
          );
          if (conversationData.status == 0) {
            let eventName = "onMessageForwardFailed";
            let eventData = ["message_not_found"];
            try {
              informOperator(
                io,
                socket.id,
                conversationData,
                eventName,
                eventData
              );
            } catch (err) {
              console.log("informOperator err", err);
              throw err;
            }
          }
        }
      } catch (err) {
        socket.emit("onMessageForwardFailed", "error");
        const conversationData = await conversationAct.getCnv(
          data.conversation_id
        );
        if (conversationData.status == 0) {
          let eventName = "onMessageForwardFailed";
          let eventData = ["error"];
          try {
            informOperator(
              io,
              socket.id,
              conversationData,
              eventName,
              eventData
            );
          } catch (err) {
            console.log("informOperator err", err);
            throw err;
          }
        }
        console.log(err);
      }
    });

    
    socket.on('addSale',async(data)=>{
      const userInfo=await axios.get(`${process.env.API_PATH}/getDataByProfileId/${data.contact}`,{
        headers:{
          key: `${process.env.API_KEY}`,

        }
      })
     

      //check if sale been made from agent message
      if (data.messageId) {
        const messageInfo = await msgDb.getMsg(data.messageId);
        const contactId = await userM.getAgent(messageInfo.user);
        data.agent_id = contactId.id;
      } else {
        data.agent_id = null;
      }
      try {
        const user = socketIds[socket.id];
        if (user) {
          //add sale into admin data base 
          const response = await axios.post(
            `${process.env.API_PATH}/add_sales`,
            data,
            {
              headers: {
                key: `${process.env.API_KEY}`,
              },
            }
          );
          if (response.status === 200) {      
              socket.emit("saleAdded",{
                amount:response.data.plan_tariff,
                currency:response.data.plan_currency,
                country:"",
                last_name:userInfo.data.data.lastname,
                first_name:userInfo.data.data.firstname,
                email:userInfo.data.data.email,
                id_sale:response.data.sale_id,
                messageId:data.messageId
              })
            
          } else {
            socket.emit("addSaleFailed", "failed");
          }
        }
      } catch (error) {
        socket.emit("addSaleFailed", error.toString());
        console.error("An error occurred:", error);
      }
    })

    socket.on("saleSucceed", async (data) => {      
      try {

        if (data.messageId) {
          const messageInfo = await msgDb.getMsg(data.messageId);
          const contactId = await userM.getAgent(messageInfo.user);
          data.agent_id = contactId.id;
        } else {
          data.agent_id = null;
        }

          const response = await axios.post(
            `${process.env.API_PATH}/update_sales`,
            {
                sale_id:data.id_sale,
                status:1,
                date_end:data.date_end,
                agent_id:data.agent_id
            },
            {
              headers: {
                key: `${process.env.API_KEY}`,
              },
            }
          );
            
             if (data?.messageId) {
                //update plan message status to 1
                msgDb.putPlanMessage(data.messageId, 1);
                  }    
            
            // userM.putUserStatus(data.contact);
            // UserIndex returns the position of the client who bought a plan
            const newBalance = await putBuyBalance(
              data.contact,
              response.data.balance
            );
    
            // User does not exist in clientBalance array, push new data
            clientBalance[data.userId] = {
              user: data.contact,
              balance: newBalance.balance,
              free_balance:clientBalance[data.userId]?.free_balance ?? 0,
              balance_type: 1,
              sync: false,
            };

             socket.emit("planBought", response.data, newBalance.balance);
              Object.entries(socketIds).forEach(([socketId, user]) => {
                if (
                  user.accountId == data.accountId &&
                  (user.role === "ADMIN" || user.role === "AGENT")
                ) {
                  io.to(socketId).emit("planBought", {
                    newPlan: response.data,
                    messageId: data.messageId,
                    userBalance: newBalance.balance,
                    userId: data.userId,
                    contactId: data.contact,
                    userFreeBalance:newBalance.free_balance
                  });
                }
              });
              // add purchase log
              const logData = {
                user_id: data.contact,
                action: "purchase completed",
                element: "3",
                element_id: response.data.id,
                log_date: currentDate,
                source: "3",
                plan_name: response.data.plan_name,
                messageId: data?.messageId,
              };
              //save log in data base as a message
              const savedMessage = await msgDb.addMsg({
                app: "638dc76312488c6bf67e8fc0",
                user: data.userId,
                action: "message.create",
                metaData: {
                  type: "log",
                  conversation_id: data.conversationId,
                  user: data.userId,
                  message: JSON.stringify(logData),
                  data: "",
                  origin: "web",
                },
              });
              const messageData = {
                content: savedMessage.message,
                id: savedMessage._id,
                from: data.userId,
                conversation: data.conversationId,
                senderName: data?.senderName,
                date: savedMessage.created_at,
                type: savedMessage.type,

              };
              //if the purchase been made in a conversation
              if (savedMessage?._id) {
                // send a message to the conversation
                socket.emit("onMessageSent", {
                  ...messageData,
                  isSender: true,
                  direction: "in",
                });
                socket.to(data.conversationId).emit("onMessageReceived", {
                  messageData,
                  senderName: data?.senderName,
                  conversation: data.conversationId,
                  isSender: false,
                  direction: "out",
                  userId: data.userId,
                  planName: data.plan,
                });
                const conversationData = await conversationAct.getCnv(
                  data.conversationId
                );
                if (conversationData.status == 0) {
                  let eventName = "onMessageReceived";
                  let eventData = [
                    {
                      messageData,
                      senderName: data?.enderName,
                      conversation: data.conversationId,
                      isSender: false,
                      direction: "out",
                      userId: data.userId,
                      planName: data.plan,
                    },
                  ];
                  try {
                    informOperator(
                      io,
                      socket.id,
                      conversationData,
                      eventName,
                      eventData
                    );
                  } catch (err) {
                    console.log("informOperator err", err);
                    throw err;
                  }
                }
              }
            
          
        
      } catch (error) {
        socket.emit("planBoughtFailed", error.toString());
        logger.info(
          `
           error: ${JSON.stringify(error)}, date: ${fullDate}`
        );
        console.error("An error occurred:", error);
      }
    });

    socket.on("linkClick", (messageId) => {
      putLinkMessage(messageId)
        .then(async (updatedMessage) => {
          io.in(updatedMessage.conversation_id.toString()).emit(
            "linkClicked",
            updatedMessage
          );
          const conversationData = await conversationAct.getCnv(
            updatedMessage.conversation_id.toSTring()
          );
          if (conversationData.status == 0) {
            let eventName = "onMessageReceived";
            let eventData = [updatedMessage];
            try {
              informOperator(
                io,
                socket.id,
                conversationData,
                eventName,
                eventData
              );
            } catch (err) {
              console.log("informOperator err", err);
              throw err;
            }
          }
        })
        .catch((error) => {
          console.log("error updating link clicking");
        });
    });

    socket.on('saleFailed', async (data) => {
      try {
          //update sale in data base status=params.status,id_sale=params=id_sale,reason=params.reason,date_end=DataNow()
        const response = await axios.post(`${process.env.API_PATH}/update_sales`, {
          sale_id:data.id_sale,
          status:2,
          date_end:data.date_end,
          reason:data.reason,
        },{
          headers: {
            key: `${process.env.API_KEY}`,
          },
        });
      } catch (error) {
        console.error('Error updating sale:', error);
      }
    });
    
    
    socket.on(
      "findMessageWithSiblings",
      async (messageId, count, firstMessage) => {
        try {
          socket.emit(
            "findMessageWithSiblingsResult",
            messageId,
            await findMessageWithSiblings(
              messageId,
              count,
              firstMessage,
              socketIds[socket.id]
            )
          );
        } catch (err) {
          console.log("err", err);
          socket.emit(
            "findMessageWithSiblingsFailed",
            messageId,
            err.toString()
          );
        }
      }
    );
    socket.on("getConversationMessages", async (data) => {
      try {
        const result =await getSocketConversationMessages(data)

        socket.emit(
          "getConversationMessagesResult",result.messages ?? [],
          data,
          result.totalUnreadMessages ?? 0,
          result.contact ?? null
        );
      } catch (err) {
        socket.emit("getConversationMessagesFailed", err.toString(), data);
      }
    });

    socket.on('loadMessages',async (data)=>{
      const result =await getConversationMessages(socket,data)
      socket.emit('loadMessages',result)
    })
    

  });


};


export default ioMessageEvents;
