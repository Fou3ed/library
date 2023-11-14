import userActions from "./userMethods.js";
const userDb = new userActions();
import { io } from "../../index.js";
const currentDate = new Date();
import axios from "axios";
const fullDate = currentDate.toLocaleString();
import conversationActions from "../conversations/conversationMethods.js";
const conversationDb = new conversationActions();
import messagesActions from "../messages/messageMethods.js";
const messageDb = new messagesActions();
import logger from "../../config/newLogger.js";

import { socketIds } from "../connection/connectionEvents.js";
import { filterForms } from "../../utils/forms.js";
import {
  deleteConversation,
  getAllConversations,
  getAllTotalConversationsDetails,
  getCnvById,
  getConv,
  getConvBetweenUserAndAgent,
  getUserConversationsCounts,
} from "../../services/conversationsRequests.js";
import reviewBalance from "../../utils/balance.js";
import sendEmail from "../../utils/nodeMailer.js";
import { clientBalance } from "../connection/connectionEvents.js";
import { informOperator } from "../../utils/informOperator.js";
import { apiKeys } from "../../utils/getApiKeys.js";
import {
  agentAvailable,
  getAgentByAccountId,
  getAgentDetails,
  getAgentBy_Id,
  getUserByP,
  getUsersById,
  getAgentsByAccountId,
} from "../../services/userRequests.js";
import { login } from "../../utils/login.js";
import { response } from "express";
const ioUserEvents = function () {
  io.on("connection", function (socket) {
    // onUserLogin : Fired when the user log in.
    socket.on("onUserLogin", (data) => {
      try {
        io.to(data.roomId).emit("onUserLogin", data);
        console.log("====================================");
        console.log("user login successfully ");
        console.log("====================================");
        userDb.logIn(data);
        logger.info(
          `Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
      } catch (err) {
        logger.error(
          `Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `
        );
      }
    });

    async function sendPostRequest(data) {
      let country;
      try {
        // const response = await axios.get(
        //   `${process.env.GET_COUNTRY}${socket.request.connection.remoteAddress}`
        // );

        // country = response.data.countryCode;
         country = "TN";
      } catch (error) {
        console.error("Error:");
      }
      try {
        // Find the appKey based on the appId from apiKeys
        const apiKeyItem = apiKeys.find((item) => item.appId == data.accountId);
        if (apiKeyItem) {
          const response = await axios.post(
            `${process.env.API_PATH}/AddGuestContact`,
            {
              // ipAddress: socket.request.connection.remoteAddress,
              ipAddress: socket.request.connection.remoteAddress,
              country: country,
              browser: data.browser,
              platform: data.platform,
              ...data,
            },
            {
              headers: {
                key: apiKeyItem.appKey,
                "Content-Type": "application/json",
              },
            }
          );
          return response;
        } else {
          console.error("No matching apiKey found for the provided appId.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    socket.on("login", async (data) => {
      login(data, socket);
    });
    socket.on("createGuest", async (data) => {
      try {
  
        let gocc;
        let name;
        const dataContact = data?.contact_id ? data?.contact_id : data?.lead_id;
        if (data?.source == "gocc" && dataContact) {
          const source_type = data?.contact_id ? "contact" : "lead";
          const response = await axios.get(
            process.env.GOCC + `?${source_type}_id=${dataContact}`,
            {
              headers: {
                Authorization:
                  "Basic YXBpX2tleTpjYTFmMjk1ZGM2NmE5NDY4MDllYTZhMzZhNzZjOTA1MA==",
              },
            }
          );
          if (response?.data?.data?.id) {
            data = {
              ...data,
              ...{
                gender: response.data.data.gender,
                firstname: response.data.data.first_name,
                lastname: response.data.data.last_name,
                nickname: response.data.data.nickname,
                email: response.data.data.email_addresses[0]?.address,
                phone: response.data.data.phone_numbers[0]?.number,
                // country: response.data.data.country,
                country: "TN",
                origin: "gocc",
                date_birth: response.data.data.birth_date,
                source_type: source_type,
                source_id: dataContact,
              },
            };
            name =
              response.data.data.first_name +
              " " +
              response.data.data.last_name;
            gocc = data?.contact_id ? data.contact_id : data.lead_id;
          }
        }
        // create guest in admin's data base
        const contactData = await sendPostRequest(data);
            
        if(contactData.data.existed){
          socket.emit("accountExist",contactData.data.data)
          return;
        }
        if (contactData?.data?.data?.id) {

            // const exist = await getUserByP(contactData.data.data.id)         
          // save guest in my data base

          const guestInfo = await userDb.createGuest({
            role: "CLIENT",
            status: 0,
            id: contactData.data.data.id,
            accountId: data.accountId,
            is_active: true,
            free_balance: data.free_balance,
            full_name:
             name
                ? name
                : "Guest #" + contactData.data.data.id,
            socket_id: socket.id,
            ...(gocc
              ? {
                  metaData: {
                    goccId: data.contact_id ? data.contact_id : undefined,
                    goccLeadId: data.lead_id ? data.lead_id : undefined,
                  },
                }
              : {}),
          });
          // add guest details to socketIds array
          socketIds[socket.id] = {
            userId: [guestInfo._id.toString()],
            accountId: guestInfo.accountId,
            role: guestInfo.role,
            contactId: guestInfo.id,
          };

          //create conversation with robot
          const robotDetails = await userDb.getUserByP(
            process.env.ROBOT_ID_CONTACT,
            "BOT"
          );
          //create conversation
          const conversationDetails = await conversationDb.addCnv({
            app: data.accountId,
            user: guestInfo._id,
            action: "conversation.create",
            metaData: {
              name: robotDetails.full_name,
              channel_url: "",
              conversation_type: "4",
              description: "private chat",
              owner_id: data.accountId,
              members: [guestInfo._id.toString(), robotDetails._id.toString()],
              permissions: [],
              members_count: 2,
              status: "1",
              max_length_message: "256",
            },
          });

          socket.emit("guestCreated", {
            user: guestInfo._id,
            contact: contactData.data.data.id,
            availableAgent: robotDetails._id.toString(),
            accountId: data.accountId,
            senderName: robotDetails.full_name,
            conversationId: conversationDetails._id,
            role: robotDetails.role,

            ...(gocc
              ? {
                  [data.lead_id ? "leadId" : "contactId"]:
                    data.lead_id || data.contact_id,
                }
              : {}),
          });

          socket.join(conversationDetails._id.toString());
          //inform operation
            let eventName = "guestCreated";
            let eventData = [
              {
                user: guestInfo._id,
                contact: contactData.data.data.id,
                availableAgent: robotDetails._id.toString(),
                accountId: data.accountId,
                senderName: robotDetails.full_name,
                conversationId: conversationDetails._id,
                ...(gocc
                  ? {
                      [data.lead_id ? "leadId" : "contactId"]:
                        data.lead_id || data.contact_id,
                    }
                  : {}),
              },
            ];
            // socket.emit('displayRobotAvatar',robotDetails)
            try {
              informOperator(
                io,
                socket.id,
                conversationDetails,
                eventName,
                eventData
              );
            } catch (err) {
              console.log("informOperator err", err);
              throw err;
            }
          
          //inform all the agents about the new guest with displaying the conversation
          // Object.entries(socketIds).forEach(([socketId, user]) => {
          //   if (
          //     user.role !== "CLIENT" &&
          //     user.accountId === guestInfo.accountId
          //   ) {
          //     io.to(socketId).emit(
          //       "conversationStatusUpdated",
          //       {
          //         ...JSON.parse(JSON.stringify(conversationDetails)),
          //         member_details: [guestInfo],
          //       },
          //       1
          //     );
          //   }
          // });
          let agentStatus = Object.values(socketIds).some(
            (entry) =>
              entry.role === "AGENT" && entry.accountId === guestInfo.accountId
          );
          agentStatus = agentStatus ? 1 : 0;
          try {
            //if !response
            const formMsg = filterForms(
              "1",
              data.accountId,
              data?.source ? "gocc" : null,
              agentStatus
            );
            if (formMsg) {
              formMsg.status = 0;
              //add message to data base and emit to the client
              messageDb
                .addMsg({
                  app: "1",
                  user: robotDetails._id.toString(),
                  action: "message.create",
                  from: robotDetails._id.toString(),
                  metaData: {
                    type: "form",
                    conversation_id: conversationDetails._id,
                    user: robotDetails._id.toString(),
                    message: JSON.stringify(formMsg),
                    data: "non other data",
                    origin: "web",
                  },
                  to: guestInfo._id,
                })
                .then((savedMsg) => {
                  socket.emit("onMessageReceived", {
                    messageData: {
                      content: savedMsg.message,
                      id: savedMsg._id,
                      from: "",
                      conversation: conversationDetails._id,
                      date: savedMsg.created_at,
                      uuid: savedMsg.uuid,
                      type: "form",
                      agentId: robotDetails._id.toString(),
                    },
                    contactAgentId: "0",

                    conversation: conversationDetails._id,
                    isSender: false,
                    direction: "out",
                    userId: data.user,
                    senderName: robotDetails.full_name,
                  });
                  if (conversationDetails.status == 0) {
                    let eventName = "onMessageReceived";
                    let eventData = [
                      {
                        messageData: {
                          content: savedMsg.message,
                          id: savedMsg._id,
                          from: "",
                          conversation: conversationDetails._id,
                          date: savedMsg.created_at,
                          uuid: savedMsg.uuid,
                          type: "form",
                        },
                        conversation: conversationDetails._id,
                        isSender: false,
                        direction: "out",
                        userId: data.user,
                        senderName: robotDetails.full_name,
                      },
                    ];
                    try {
                      informOperator(
                        io,
                        socket.id,
                        conversationDetails,
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
              console.log("form is not found ");
            }
          } catch (error) {
            console.error(error);
          }

          logger.info(
            `Event: createGuest ,data: ${JSON.stringify(data)} , socket_id : ${
              socket.id
            } ,token :"taw nzidouha , date: ${fullDate}"   \n `
          );
        } else {
          socket.emit("createGuestFailed", false);

          console.log("error creating guest in Iheb's data base");
        }
      } catch (err) {
        socket.emit("createGuestFailed", err);
        console.log("error creating guest", err);
        logger.error(
          `Event: createGuest ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `
        );
      }
    });

    // onUserLogout : Fired when the user log out.
    socket.on("onUserLogOut", (data) => {
      try {
        io.to(data.roomId).emit("onUserLogOut", data);
        console.log("====================================");
        console.log("user logout");
        console.log("====================================");
        logger.info(
          `Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
        logger.info(
          `Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
      } catch (err) {
        logger.error(
          `Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `
        );
      }
    });
    // onUserUpdated : Fired when the user date updated.
    socket.on("onUserUpdated", (data) => {
      try {
        io.to(data.roomId).emit("onUserUpdated", data);
        console.log("====================================");
        console.log("user updated");
        console.log("====================================");
        logger.info(
          `Event: onUserUpdated ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
      } catch (err) {
        logger.error(
          `Event: onUserUpdated ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `
        );
      }
    });
    // onUserDeleted : Fired when the user deleted

    socket.on("onUserDeleted", (data) => {
      try {
        io.to(data.roomId).emit("onUserDeleted", data);
        console.log("====================================");
        console.log("user deleted");
        console.log("====================================");
        logger.info(
          `Event: onUserDeleted ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
      } catch (err) {
        logger.error(
          `Event: onUserDeleted ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `
        );
      }
    });

    socket.on("monitoring", async (data) => {
      try {
        socket.emit("monitoringData", {
          active_conversations:
            (
              await getAllConversations({
                id: socketIds[socket.id].accountId,
                active: "1",
                ...(socketIds[socket.id].role === "ADMIN"
                  ? {}
                  : { user_id: socketIds[socket.id].userId }),
              })
            )?.data ?? [],
        });
        logger.info(
          `Event: onUserDeleted ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
      } catch (err) {
        logger.error(
          `Event: onUserDeleted ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `
        );
        console.log(err);
      }
    });

    socket.on("getActiveConversations", async (data) => {
      try {
        if (socketIds[socket.id]?.accountId) {
          const user = socketIds[socket.id];
          socket.emit(
            "getActiveConversations",
            (
              await getAllConversations({
                id: user.accountId,
                active: "1",
                ...(user.role === "ADMIN" ? {} : { user_id: user.userId }),
              })
            )?.data ?? [],
            await getUserConversationsCounts({
              id: user.accountId,
              ...(user.role === "ADMIN" ? {} : { user_id: user.userId }),
            })
          );
        }
        logger.info(
          `Event: getActiveConversations ,data: ${JSON.stringify(
            data
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
      } catch (err) {
        logger.error(
          `Event: getActiveConversations ,data: ${JSON.stringify(
            data
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `
        );

        console.log(err);
      }
    });

    socket.on("getMonoActiveConversations", async (data) => {
      try {
        if (socketIds[socket.id]?.accountId) {
          const user = socketIds[socket.id];
          socket.emit(
            "getMonoActiveConversations",
            (
              await getAllTotalConversationsDetails({
                id: user.accountId,
              
                ...(user.role === "ADMIN" ? {} : { user_id: user.contactId }),
              })
            )?.data ?? []
          );
        }
        logger.info(
          `Event: getMonoActiveConversations ,data: ${JSON.stringify(
            data
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
      } catch (err) {
        logger.error(
          `Event: getMonoActiveConversations ,data: ${JSON.stringify(
            data
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `
        );

        console.log(err);
      }
    });

    socket.on("getOnlineUsers", async () => {
      const globalUser = socketIds[socket.id];
      const users = await getUsersById(
        Object.values(socketIds)
          .flatMap((user) =>
            user.accountId === globalUser?.accountId
              ? user.userId
              : null
          )
          .filter((item) => item))
      socket.emit(
        "getOnlineUsers",
        users.map(user => ({
          user_id: user._id,
          id: user.id,
          role: user.role,
          ...(clientBalance[user._id]
            ? { balance: clientBalance[user._id].balance }
            : {}),
          ...(user.role === "CLIENT"
            ? { status: clientBalance[user._id] ? 1 : 0 }
            : {}),
            freeBalance:user.free_balance
        })),( await getAgentsByAccountId(globalUser.accountId))
      );
    });
    socket.on("updateTotalBalance", (balanceData) => {
      reviewBalance(io, socket, balanceData);
    });
    socket.on("robotConversationUpdated", (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on("getUserPresentations", async (accountId) => {
      try {
        const profiles = await axios.post(
          `${process.env.API_PATH}/presentationUsers`,
          {
            account_id: accountId,
          },
          {
            headers: {
              key: `${process.env.API_KEY}`,
            },
          }
        );
        const agents = await getAgentByAccountId(accountId);

        socket.emit(
          "getUserPresentations",
          profiles.data.data
            .map((profile) => {
              const agent = agents.find(
                (agent) =>
                  agent.id == profile.user_id && agent.profile_id == profile.id
              );
              if (agent) {
                return { ...profile, _id: agent._id };
              }
              return null;
            })
            .filter((value) => value)
        );

      } catch (error) {
        console.error("error", error);

        socket.emit("getUserPresentationsError", error);
      }
    });

    socket.on("availableAgent", async (data) => {
      try {
        let availableAgent;

        const userData = await getAgentDetails(data.userId);

        //1)get available agent
        if (data.agentId) {
          availableAgent = await getAgentBy_Id(data.agentId);

        } else {
          availableAgent = await agentAvailable(data.accountId);
        }
        if(availableAgent){
          const conversationFirst = await getConv(data.agentId,data.userId)
            if(conversationFirst.data){
              socket.emit('checkConversation',conversationFirst.data.conversation[0]._id.toString(),availableAgent.id,availableAgent.full_name)
              return;
            }
          //2)delete conversation with robot
          const deleteCnv = await deleteConversation(data.conversationId);
          //3)create a conversation with the available agent
          const conversationDetails = await conversationDb.addCnv({
            app: data.accountId,
            user: availableAgent._id,
            action: "conversation.create",
            metaData: {
              name: availableAgent.full_name,
              channel_url: "",
              conversation_type: "1",
              description: "private chat",
              owner_id: data.accountId,
              members: [data.userId, availableAgent._id.toString()],
              permissions: [],
              members_count: 2,
              status: availableAgent.is_active ? "1" : "0",
              max_length_message: "256",
            },
          });
  
          let agentStatus;
          availableAgent.is_active ? (agentStatus = 1) : (agentStatus = 2);
          //4)send form to that conversation
          if (conversationDetails) {
            // const conversationData = await getCnvById(
            //   conversationDetails._id
            // );
            socket.emit("availableAgent", availableAgent, data.conversationId);
  
            Object.entries(socketIds).forEach(([socketId, user]) => {
              if (user.role !== "CLIENT" && user.accountId === data.accountId) {
                io.to(socketId).emit(
                  "deleteRobotConversation",
                  data.conversationId
                );
              }
            });
            const formMsg = filterForms(
              "2",
              data.accountId,
              data?.source ? "gocc" : null,
              agentStatus
            );
            if (formMsg) {
              socket.join(conversationDetails._id.toString());
  
              Object.entries(socketIds).forEach(([socketId, user]) => {
                if (
                  user.accountId === availableAgent.accountId &&
                  user.userId.includes(availableAgent._id.toString())
                ) {
                  io.to(socketId).emit(
                    "conversationStatusUpdated",
                    {
                      ...JSON.parse(JSON.stringify(conversationDetails)),
                      member_details: [userData, availableAgent],
                    },
                    1
                  );
                }
              });
              formMsg.status = 0;
              //add message to data base and emit to the client
              messageDb
                .addMsg({
                  app: data.accountId,
                  user: availableAgent._id.toString(),
                  action: "message.create",
                  from: availableAgent._id.toString(),
                  metaData: {
                    type: "form",
                    conversation_id: conversationDetails._id,
                    user: availableAgent._id.toString(),
                    message: JSON.stringify(formMsg),
                    data: "non other data",
                    origin: "web",
                  },
                  to: data.userId,
                })
                .then((savedMsg) => {
                  socket.emit("onMessageReceived", {
                    messageData: {
                      content: savedMsg.message,
                      id: savedMsg._id,
                      from: availableAgent._id.toString(),
                      conversation: conversationDetails._id,
                      date: savedMsg.created_at,
                      uuid: savedMsg.uuid,
                      type: "form",
                    },
                    conversation: conversationDetails._id,
                    isSender: false,
                    direction: "out",
                    userId: data.user,
                    senderName: availableAgent.full_name,
                    contactAgentId: availableAgent.id,
                    status: conversationDetails.status,
                  });
                  if (conversationDetails.status == 0) {
                    let eventName = "onMessageReceived";
                    let eventData = [
                      {
                        messageData: {
                          content: savedMsg.message,
                          id: savedMsg._id,
                          from: availableAgent._id.toString(),
                          conversation: conversationDetails._id,
                          date: savedMsg.created_at,
                          uuid: savedMsg.uuid,
                          type: "form",
                        },
                        conversation: conversationDetails._id,
                        isSender: false,
                        direction: "out",
                        userId: data.user,
                        senderName: availableAgent.full_name,
                      },
                    ];
                    try {
                      informOperator(
                        io,
                        socket.id,
                        conversationDetails,
                        eventName,
                        eventData
                      );
                    } catch (err) {
                      console.log("informOperator err", err);
                      throw err;
                    }
                  }
                });
            }}
        }
       
        
      } catch (error) {
        console.error("error", error);
      }
    });

    socket.on("displayAgents", async (accountId) => {
      try {
        const profiles = await axios.post(
          `${process.env.API_PATH}/presentationUsers`,
          {
            account_id: accountId,
          },
          {
            headers: {
              key: `${process.env.API_KEY}`,
            },
          }
        );
        const agents = await getAgentByAccountId(accountId);

        socket.emit(
          "displayAgents",
          profiles.data.data
            .map((profile) => {
              const agent = agents.find(
                (agent) =>
                  agent.id == profile.user_id && agent.profile_id == profile.id
              );
              if (agent) {
                return { ...profile, _id: agent._id };
              }
              return null;
            })
            .filter((value) => value)
        );
      } catch (error) {
        console.error("error", error);

        socket.emit("displayAgents", error);
      }
    });




  });
};

export default ioUserEvents;
