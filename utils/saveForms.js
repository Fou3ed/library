import axios from "axios";
import { postMessage, putMessage } from "../services/messageRequests.js";
// import addLogs from "./addLogs.js";
import { socketIds } from "../models/connection/connectionEvents.js";
import sendTextCapture from "./sendTextCapture.js";
import { informOperator } from "./informOperator.js";
import sendEmail from "./nodeMailer.js";
import { getCnvById } from "../services/conversationsRequests.js";
import { putUser } from "../services/userRequests.js";
import {
  io
} from '../index.js'
export const saveForms = async (dataForm, socket) => {
  let data = JSON.parse(dataForm);
  try {
    axios.post(`${process.env.API_PATH}/addcontactforms`, dataForm, {
      headers: {
        'Content-Type': 'application/json',
        "key": `${process.env.API_KEY}`
      }
    })
      .then(async response => {
        try {
          let receiverEmail = null;
          if (data.form && data.form.fields && Array.isArray(data.form.fields)) {
            for (const field of data.form.fields) {
              if (field.field_type == 6 && field.field_value) {
                receiverEmail = field.field_value;
                break;
              }
            }
          }

          if (receiverEmail) {
            sendEmail(receiverEmail, response.data.data, response.data.data.firstname, data.language, data.applicationName)
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
        putMessage(data.messageId, data.form, false)
        //add, logs
        const user = socketIds[socket.id]
        const messageData = await postMessage({
          app: user.accountId,
          user: user.userId,
          action: "message.create",
          metaData: {
            type: "log",
            conversation_id: data.conversationId,
            user: user.userId,
            message: JSON.stringify({
              "messageId": data.messageId,
              "user_id": user.userId,
              "action": "end form",
              "element": "21",
              "element_id": data.form.form_id,
              "log_date": new Date(),
              "source": "2",
            }),
            origin: "web",
          },
        })

        socket.to(data.conversationId).emit('onMessageReceived', {
          messageData,
          conversation: data.conversationId,
          userId: user.userId,
        });

        // addLogs({
        //   action: "end form",
        //   element: "21",
        //   element_id: data.form.form_id,
        //   source: 2,
        //   user_id: user.contactId,
        // })


        //update user information 
        const userDetails = await putUser(user.userId, data.form)

        Object.entries(socketIds).forEach(([socketId, user]) => {
          if (
            user.userId == userDetails._id.toString()
          ) {
            io.to(socketId).emit("formSaved", true, userDetails, dataForm)
          }
        });


        socket.to(data.conversationId).emit('userUpdated', userDetails)
        socket.to(data.conversationId).emit("formSaved", true, dataForm)
        const conversationData = await getCnvById(data.conversationId);
        //for the client : receive message , for the agent : sent message of the text_capture of the form                 

        const differentIdMember = conversationData.member_details.find(member => member._id.toString() !== user.userId);
        // if(data?.form?.message_capture){
        //   socket.join(data.conversationId)
        //  await sendTextCapture(user,differentIdMember,conversationData,data.form.message_capture,data.form.form_type)
        // }
        socket.join(data.conversationId)
        await sendTextCapture(user, differentIdMember, conversationData, data?.form?.message_capture, data.form.form_type,socket)

        //add message fl bdd messageBloc 
        //send receiveMessage

        if (conversationData.status !== 1) {
          let eventName = "formSaved"
          try {
            informOperator(io, socket.id, conversationData, eventName, dataForm);
            informOperator(io, socket.id, conversationData, "userUpdated", userDetails);
          } catch (err) {
            console.log("informOperator err", err)
            throw err;
          }
        }
      })
      .catch(error => {
        console.log("error saving form", error)
        socket.emit("formSaved", false, dataForm)
      });

  } catch (err) {
    console.log("error saving form in iheb's data base", err)
  }
}