import { socketIds } from "../models/connection/connectionEvents.js";
import userActions from "../models/user/userMethods.js";
import conversationActions from "../models/conversations/conversationMethods.js";
import { checkLoginUser } from "../services/userRequests.js";
import messagesActions from "../models/messages/messageMethods.js";
import { filterForms } from "./forms.js";
const messageDb = new messagesActions();
const conversationDb = new conversationActions();
const userDb = new userActions();
export async function login(data,socket) {
  const userInfo = await checkLoginUser(data);
  if(userInfo.length>0){
    socket.emit('login-user',userInfo[0])
  }else {
    const guestInfo = await userDb.createGuest({
        role:"CLIENT",
        status:0,
        id:data.profile_id,
        is_active:true,
        full_name:data.nickname,
        socket_id:data.socket_id
       });
  // add guest details to socketIds array
  socketIds[socket.id] = {
    userId: guestInfo._id.toString(),
    accountId: guestInfo.accountId,
    role: guestInfo.role,
    contactId: guestInfo.id,
  };
  //create conversation with robot
  const robotDetails = await userDb.getUserByP(process.env.ROBOT_ID_CONTACT);
  //create conversation
  const conversationDetails = await conversationDb.addCnv({
    app: data.accountId,
    user: guestInfo._id,
    action: "conversation.create",
    metaData: {
      name: robotDetails.nickname,
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
    contact: guestInfo.id,
    availableAgent: robotDetails._id.toString(),
    accountId: data.accountId,
    senderName: robotDetails.nickname,
    conversationId: conversationDetails._id,
    role: robotDetails.role,
  })
  socket.join(conversationDetails._id.toString());


  let agentStatus = Object.values(socketIds).some(
    (entry) => entry.role === "AGENT" && entry.accountId === guestInfo.accountId
  );
      agentStatus=agentStatus ? 1 : 0
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
            },
            conversation: conversationDetails._id,
            isSender: false,
            direction: "out",
            userId: data.user,
            senderName: robotDetails.nickname,
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
                senderName: robotDetails.nickname,
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
    }else {
      console.log("form is not found ")
    }
  } catch (error) {
    console.error(error);
  }




  
  }

  

}
