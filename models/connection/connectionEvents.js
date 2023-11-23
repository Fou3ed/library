import {
  io
} from '../../index.js'
import check from '../../utils/auth.js'
import logger from '../../config/newLogger.js'
import * as info from '../../data.js'
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
import methods from './connectionMethods.js'
const db = new methods()
import userAction from '../user/userMethods.js'
const userAct = new userAction()
import {
  conversationTotalMessages,
  getActiveConversationsOwner
} from '../../services/conversationsRequests.js'
import {
  putActiveCnvs,
  putInactiveCnvs
} from '../../services/conversationsRequests.js';
import mongoose from 'mongoose';
import { contactForms } from '../../utils/forms.js';
import { getUsersByP } from '../../services/userRequests.js';

export let clientBalance = []
export let socketIds = {}

const ioConnEvents = function () {
  io.on('connection', async (socket) => {

    socket.on("user-connected", async (onConnectData) => {
      try{
      if (onConnectData.user) {
        const globalUser = await getUsersByP(onConnectData.user,onConnectData.type);
        if (!globalUser.length) {
          socket.emit('user-connection-error',onConnectData) 
            return;
        }

        //change it to emit to only admin/agents who are in the same accountId with the user 
          Object.entries(socketIds).forEach(([socketId,user])=> {
            if (user.role === "AGENT",user.accountId===globalUser[0].accountId) {
              for(let user of globalUser){
                io.to(socketId).emit("user-connection",user);
              }
            }
           })   
           const profileIds = globalUser.map(user=>user._id.toString());
        let accountIds = Object.values(socketIds).filter(user => user.accountId == globalUser[0].accountId && !(globalUser[0].role == user.role && globalUser[0].id==user.contactId)).flatMap(user=>user.userId)
        let updatedConversation=[];
        for(let user of profileIds){
          let other_profiles = profileIds.filter(uId => uId !== user); 
           updatedConversation.push(...(await putActiveCnvs(user, [...accountIds, ...other_profiles])))  
        }
        socket.emit("onConnected", onConnectData.type ? globalUser : globalUser[0], onConnectData.type ? undefined : globalUser[0]?.balance );
        // Add every user connection in socketIds array as key:socket.id, value:{userId,role,accountId}
         socketIds[socket.id] = {
             userId: profileIds,
             accountId: globalUser[0].accountId,
             role: globalUser[0].role,
             contactId: onConnectData.user
        };
        // Update the user activity to is_active=true
        for(let user of globalUser){
          await userAct.putUserActivity({
            userId:  user._id.toString(),
            socketId: socket.id,
            status: true
          });
        }

        
        if (accountIds.length > 0) {
          // Get all the active conversations the user has
          const activeConversations = (globalUser[0].role === "ADMIN" ? await getActiveConversationsOwner(globalUser[0].accountId) : updatedConversation.map(conversation => conversation._id.toString()));
          // Join the user to each conversation
          activeConversations.forEach((conversationId) => {
            socket.join(conversationId);
          });
          updatedConversation.forEach(async (conversation) => {
             let members=conversation.member_details.map(member=>member._id.toString()).filter(item=>!globalUser.map(user => user._id.toString()).includes(item))
             let countMessages=await conversationTotalMessages(conversation)
             conversation.total={countMessages}
             let memberSocketId=Object.entries(socketIds).map(([socketId,user])=>(members.find(member => user.userId.includes(member)) || (conversation.operators.find(admin =>user.userId.includes(admin.toString()))))  ? socketId:null).filter(user => user)
              memberSocketId.forEach(member => {
                io.to(member).emit('conversationStatusUpdated',conversation,1)
             });
          });
        }
        if (!onConnectData.type && (globalUser[0]?.balance || globalUser[0]?.free_balance)) {
          try {
            clientBalance[globalUser[0]._id]={
              user: globalUser[0].id,
              balance:globalUser[0]?.balance ?? 0,
              free_balance:globalUser[0]?.free_balance ?? 0,
              balance_type:1,
              sync:false,
            };
          } catch (error) {
            socket.emit('connection-error',onConnectData)

            console.error(error);
            return;
          }
        }
      } else {
        socket.emit('connection-error',onConnectData)
        socket.disconnect(true)
      }
    }catch(error){
      console.log(error)
      socket.emit('connection-error',onConnectData,error)

    }
    });


socket.on("disconnecting", async (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      }

      // const rooms = [...socket.rooms].map(room=>room!==socket.id?mongoose.Types.ObjectId(room):null).filter(item=>item);
      const user = socketIds[socket.id]

         // Remove user from socketIds array
    if (socketIds[socket.id] ?? false) {
      delete socketIds[socket.id]
    }
      await new Promise((resolve) => {
        setTimeout(resolve, 10000); 
      });
      
if(user){

  const socketIdsWithUserId = Object.keys(socketIds).filter(socketId => {
    return (socketIds[socketId].role == user.role && socketIds[socketId].contactId == user.contactId);
  });
   if(socketIdsWithUserId.length){
    return;
   } 
   let accountIds = Object.values(socketIds).filter(user_ => user_.accountId == user.accountId && !(user_.role == user.role && user_.contactId == user.contactId)).flatMap(user=>user.userId)
      let conversations=[];
      for(let user_ of user?.userId  ){
         conversations.push(...(await putInactiveCnvs(user_ , accountIds )))
      }
  conversations.forEach(conversation => {
    const room = io.of('/').adapter.rooms.get(conversation._id.toString());
      if(room){
        io.in(conversation._id.toString()).emit('conversationStatusUpdated',conversation,0)
      }else {
        if(user){
          Object.entries(socketIds).forEach(([socketId,user])=> {
            if (user.role === "ADMIN",user.accountId===user.accountId) {
              io.to(socketId).emit("conversationStatusUpdated",conversation,0);
            }
           })   
        }
       conversation.members.forEach(member => {
        Object.entries(socketIds).forEach(([socketId,user])=> {
          if (user.userId.includes(member)) {

            io.to(socketId).emit("conversationStatusUpdated",conversation,0);
          }
         })    
        });
      }
  });

  if (user) {
const currentTimestamp = new Date();
const formattedTimestamp = currentTimestamp.toISOString();

    for(let user_ of user.userId){
      userAct.putUserActivity({
        userId: user_,
        socketId: socket.id,
        status: false,
        last_seen_at:formattedTimestamp
      });
    }
  

        Object.entries(socketIds).forEach(([socketId,userr])=>{
        if(user!==undefined && user.accountId===userr.accountId){
          for(let user_ of user.userId){
            socket.to(socketId).emit("onDisconnected", reason, {_id:user_,role:user.role,socketId:socket.id});
          }
          
        }
      })

    // Remove user from clientBalance array
    if(user.role==="CLIENT" && clientBalance[user.userId[0]]){
      delete clientBalance[user.userId[0]]
    }


  }
}
    });

    
    socket.on("disconnect", async (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });


    /**
     * onConnect : User connect to websocket
     */
    socket.on('onConnect', async (data) => {
      try {
        check(data.app_id).then((res) => {
          if (res) {
            info.onConnected.socket_id = socket.client.id;
            userAct.putUserSocket(data.user, socket.id).then((res) => {})

            logger.info(`Event: onConnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}" \n `);
            db.postConnection(data.metaData, socket.id).then((newData) => {
              socket.emit('onConnected', info.onConnected, newData, data, socket.data)
            });

          } else {
            logger.info(`Event: Attempt to onConnect ,data: ${JSON.stringify(data)} , date: ${fullDate}" \n `);
            socket.leave(socket.id);
          }
        });
      } catch (err) {
        logger.error(`Event: onConnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate} , error : ${err}" \n `);
      }
    });
    /**
     * onDisconnect : User disconnect from websocket
     */
    socket.on('onDisconnect', async (data) => {
      try {
        logger.info(`Event: Disconnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
        socket.emit('onDisconnected : ', info.onDisconnected)
        socket.disconnect(socket.id)
      } catch (err) {
        console.log(err)
        logger.error(`Event: disconnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate} , error : ${err}"   \n `)
      }
    })

    /**
     * onReconnect : User reconnect to websocket
     */
    socket.on('onReconnect', async (data) => {
      try {
        socket.emit('onReconnect', data)
        logger.info(`Event: reconnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
      } catch (err) {
        logger.error(`Event: reconnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate} , error : ${err}"   \n `)
      }
    })

    socket.on('contact-form', (data) => {
      try {
        const existingFormIndex = contactForms.findIndex((element) => element.form_id === data.form_id);
        if (existingFormIndex !== -1) {
          contactForms[existingFormIndex] = { ...contactForms[existingFormIndex], ...data };

        } else {
          contactForms.push(data);
        }

        io.to(socket.id).emit('contact-form-saved',true)
        logger.info(`Event: contact-form, data: ${JSON.stringify(data)}, socket_id: ${socket.id}, token: "" ", date: ${fullDate}" \n`);
      } catch (err) {
        io.to(socket.id).emit('contact-form-saved',false)

        logger.error(`Event: contact-form, data: ${JSON.stringify(data)}, socket_id: ${socket.id}, token: "" ", date: ${fullDate}, error: ${err}" \n`);
      }
    });  
  })
}
export default ioConnEvents