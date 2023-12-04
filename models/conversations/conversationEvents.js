//import conversation from './conversationModel.js'

import { io } from "../../index.js";
import conversationActions from "./conversationMethods.js";
import { informOperator } from "../../utils/informOperator.js";
const conversationDb = new conversationActions();
import logger from "../../config/newLogger.js";
import * as info from "../../data.js";
import { socketIds } from "../connection/connectionEvents.js";
import {
  getCnvById,
  getConv,
  getConversationById,
  searchConversationMessages,
} from "../../services/conversationsRequests.js";
import { getAgent, getAgentDetails } from "../../services/userRequests.js";
const currentDate = new Date();
import messagesActions from "../messages/messageMethods.js";
import { filterForms } from "../../utils/forms.js";
import { sendForm } from "../../utils/sendForm.js";
const messageDb = new messagesActions();
const fullDate = currentDate.toLocaleString();

const ioConversationEvents = function () {
  //room namespace
  io.on("connection", async (socket) => {
    // Create a new room
    // onConversationStart : Fired when the conversation created.
    // menich nesta3mel feha
    // socket.on("onConversationStart", (data) => {
    //   try {
    //     if (data) {
    //       conversationDb.addCnv(data).then(async (res) => {
    //         // Find the socket IDs corresponding to the members
    //         const socketIdsToNotify = Object.entries(socketIds)
    //           .map(([socketId, user]) =>
    //             res.members?.includes(user.userId) ||
    //             (user.accountId == res.owner_id && user.role === "ADMIN")
    //               ? socketId
    //               : null
    //           )
    //           .filter((item) => item);
    //         socket.join(res._id.toString());
    //         // Send the "joinMember" event to the  socket IDs
    //         socketIdsToNotify.forEach((socketIdObj) => {
    //           socket
    //             .to(socketIdObj.socketId)
    //             .emit("joinConversationMember", res);
    //         });
    //         socket.emit("onConversationStarted", res);
    //         const conversationData = await conversationDb.getCnv(
    //           res._id.toString()
    //         );
    //         if (conversationData.status !== 1) {
    //           let eventName = "onConversationStarted";
    //           let eventData = [res];
    //           try {
    //             informOperator(
    //               io,
    //               socket.id,
    //               conversationData,
    //               eventName,
    //               eventData
    //             );
    //           } catch (err) {
    //             console.log("informOperator err", err);
    //             throw err;
    //           }
    //         }
    //       });
    //       logger.info(
    //         `Event: onConversationStart ,data: ${JSON.stringify(
    //           data
    //         )} , socket_id : ${
    //           socket.id
    //         } ,token taw nzidouha , date: ${fullDate}"   \n `
    //       );
    //     }
    //   } catch (err) {
    //     logger.error(
    //       `Event: onConversationStart ,data: ${JSON.stringify(
    //         data
    //       )} , socket_id : ${
    //         socket.id
    //       } ,token :taw nzidouha ,error ${err}, date: ${fullDate}    \n `
    //     );
    //   }
    // });

    socket.on("joinRoom", (data) => {
      try {
        socket.join(data);
        socket.emit("roomJoined", data);
      } catch (err) {
        logger.error(
          `Event: onCreate roo ,data: ${JSON.stringify(data)} , socket_id : ${
            socket.id
          } ,token :taw nzidouha ,error ${err}, date: ${fullDate}    \n `
        );
      }
    });

    // onConversationEnd : Fired when the conversation ended.
    socket.on("onConversationEnd", (data) => {
      try {
        logger.info(
          `Event: onConversationEnd ,data: ${JSON.stringify(
            data
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
        socket.emit("onConversationEnd", data);
      } catch (err) {
        logger.error(
          `Event: onConversationEnd ,data: ${JSON.stringify(
            data
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `
        );
      }
    });
    // onConversationUpdated : Fired when the conversation data updated.
    socket.on("updateConversationLM", async (id, message, from) => {
      try {
        await  getConversationById(id).then(async (res) => {
          if (res.owner_id === id) {
          }
          await conversationDb.putCnvLM(id, message);
          socket.emit("onConversationUpdated", id, message);
        });
        logger.info(
          `Event: onConversationUpdated ,data: ${JSON.stringify(
            id,
            message
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
      } catch (err) {
        logger.error(
          `Event: onConversationUpdated ,data: ${JSON.stringify(
            id,
            message
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `
        );
      }
    });

    // onConversationDeleted : Fired when the conversation deleted.

    socket.on("onConversationDeleted", (data) => {
      try {
        logger.info(
          `Event: onConversationDeleted ,data: ${JSON.stringify(
            data
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha , date: ${fullDate}"   \n `
        );
        conversationDb.deleteCnv(data.metaData).then((res) => {
          socket.emit("onConversationDeleted", res);
        });
      } catch (err) {
        logger.error(
          `Event: onConversationDeleted ,data: ${JSON.stringify(
            data
          )} , socket_id : ${
            socket.id
          } ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `
        );
      }
    });

    // onConversationSearch : Search for messages containing a specific term.

    socket.on(
      "onConversationSearch",
      async (conversationId, term, messageId) => {
        try {
          // logger.info(`Event: onConversationDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
          const user = socketIds[socket.id];
          socket.emit(
            "onConversationSearchResult",
            await searchConversationMessages(
              conversationId,
              term,
              user,
              messageId
            )
          );
        } catch (err) {
          console.log("error", err);
          socket.emit("onConversationSearchFailed", err.toString());
        }
      }
    );

    socket.on("checkConversation", async (data) => {
      const conversationFirst = await getConv(data.userId, data.agentId);
      const agentDetails = await getAgentDetails(data.agentId);
      const userData = await getAgentDetails(data.userId);
      if (conversationFirst.data.messages.messages.length>0) {
        socket.emit(
          "checkConversation",
          conversationFirst.data.conversation[0]._id.toString(),
          agentDetails.id,
          agentDetails.nickname
        );
      } else {
        //create conversation and send form
        const conversationDetails = await conversationDb.addCnv({
          app: data.accountId,
          user: data.agentId,
          action: "conversation.create",
          metaData: {
            name: agentDetails.nickname,
            channel_url: "",
            conversation_type: "1",
            description: "private chat",
            owner_id: data.accountId,
            members: [data.userId, data.agentId],
            permissions: [],
            members_count: 2,
            status: agentDetails.is_active === true ? "1" : "0",
            max_length_message: "256",
          },
        });
        let agentStatus = agentDetails.is_active ? 1 : 0;

        //send conversationStatusUpdated to agent agentDetails.socket_id
        if (agentDetails.is_active) {
          const conversationData = await getCnvById(
            conversationDetails._id.toString()
          );
          socket.join(conversationDetails._id.toString());

          Object.entries(socketIds).forEach(([socketId, user]) => {
            if (
              (user.accountId === agentDetails.accountId &&
                user.userId.includes(agentDetails._id.toString())) ||
              (user.role === "ADMIN" &&
                agentDetails.accountId == user.accountId)
            ) {
              io.to(socketId).emit(
                "conversationStatusUpdated",
                {
                  ...JSON.parse(JSON.stringify(conversationDetails)),
                  member_details: [userData, agentDetails],
                },
                1
              );
            }
          });
        }

        if (conversationDetails) {
          socket.emit(
            "checkConversation",
            conversationDetails._id.toString(),
            agentDetails.id,
            agentDetails.nickname
          );

          const formMsg = filterForms(
            "2",
            data.accountId,
            data?.source ? "gocc" : null,
            agentStatus
          );

            if (formMsg) {
              formMsg.status = 0;
              //add message to data base and emit to the client
              sendForm(socket,conversationDetails,userData,agentDetails,formMsg,data.accountId)

            
          }
        }
      }
    });
  });
};

export default ioConversationEvents;
