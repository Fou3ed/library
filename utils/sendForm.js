import { io } from "../index.js";
import { postMessage } from "../services/messageRequests.js";


import { informOperator } from "./informOperator.js";
export async function sendForm(socket,conversationDetails,userData,availableAgent,formMsg,accountId){
              //add message to data base and emit to the client
          const savedMsg=await    postMessage({
                app: accountId,
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
                to: userData._id.toString(),
              })
                  if(savedMsg){
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
                    userId: availableAgent._id.toString(),
                    senderName: availableAgent.nickname,
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
                        userId: availableAgent._id.toString(),
                        senderName: availableAgent.nickname,
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
                  };
}