import messageActions from '../messages/messageMethods.js'
import {
    io
} from '../../index.js'
import logger from '../../config/newLogger.js'
import reactActions from '../reactions/reactionMethods.js'
const foued = new messageActions
const react = new reactActions
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
import userMethod from '../user/userMethods.js'
import saveFormData from '../../utils/saveForm.js'
const userM = new userMethod() 
import conversationActions from '../conversations/conversationMethods.js';
import { informOperator } from '../../utils/informOperator.js'
import sendVerificationEmail from '../../utils/verificatioMail.js'
const conversationAct = new conversationActions


const ioChatEvents = function () {

    io.on('connection', function (socket) {
        // onMessageRead : Fired when the user read a message.
        socket.on('onMessageRead', async (data) => {
            try {
                await foued.readMsg(data).then(async (res) => {
                 if(res.modifiedCount!==0){
                    socket.to(data.metaData.conversation).emit("onMessageRead", data);       
                    const conversationData = await conversationAct.getCnv(data.metaData.conversation);
                    if (conversationData.status == 0) {
                      let eventName="onMessageRead"
                      let eventData= [data]
                      try{
                        informOperator(io,socket.id,conversationData,eventName,eventData);
                      }catch(err){
                        console.log("informOperator err",err)
                        throw err;
                      }
                    } 
                    logger.info(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
                    }
                })
            } catch (err) {
                logger.error(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error ${err}, date: ${fullDate} "   \n `)
            }
        });
        // onMessagePinned : Fired when the user pin a message.
        socket.on('pinMsg', async (data) => {
            try {
            await foued.pinMsg(data.metaData.message_id, data.user).then(async (newRes) => {                            
                     socket.to(data.metaData.conversation).emit("onMsgPinned", newRes,data.user);
                    socket.emit("onMsgPinned", newRes,data.user)

                    const conversationData = await conversationAct.getCnv(data.metaData.conversation);
                    if (conversationData.status == 0) {
                      let eventName="onMsgPinned"
                      let eventData = [newRes, data.user,conversationData];
                      try{
                        informOperator(io,socket.id,conversationData,eventName,eventData);
                      }catch(err){
                        console.log("informOperator err",err)
                        throw err;
                      }
                    }
                logger.info(`Event: pinMsg ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
                })
            } catch (err) {
                logger.error(`Event: onMsgPinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error ${err}, date: ${fullDate} "   \n `)
            }
        });

        // onMessageUnpinned : Fired when the user unpin a message.
        socket.on('unPinMsg', async (data) => {
            try {
                await foued.unPinMsg(data).then(async (res) => {
                    socket.to(data.metaData.conversation).emit("onMsgUnPinned", res,data.user);      
                    socket.emit("onMsgUnPinned", res,data.user)    
                    const conversationData = await conversationAct.getCnv(data.metaData.conversation);
                    if (conversationData.status == 0) {
                      let eventName="onMsgUnPinned"
                      let eventData= [res,data.user]
                      try{
                        informOperator(io,socket.id,conversationData,eventName,eventData);
                      }catch(err){
                        console.log("informOperator err",err)
                        throw err;
                      }
                    }
                });
                logger.info(`Event: onMessageUnPinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :" " " , date: ${fullDate}"   \n `)
            } catch (err) {
                logger.error(`Event: onMessageUnpinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " ,error ${err}, date: ${fullDate} "   \n `)
            }
        });
        // onMessageReacted : Fired when the user add a reaction to message.
        socket.on('reactMsg', async function (data) {
            try {        
                //if the message is being reacted by  the same person , delete the react and update it with the new one , else create new one directly              
                 react.getMsgReact(data.metaData.message_id, data.user).then(async (res) => {
                    if (res.length > 0) {
                        await react.putReact(res[0]._id, data).then(async (newRes) => {
                                    socket.to(data.metaData.conversation).emit("onMsgReacted", {...({...newRes})._doc,conversation_id:data.metaData.conversation});
                                    socket.emit("onMsgReacted", {...({...newRes})._doc,conversation_id:data.metaData.conversation})

                                    const conversationData = await conversationAct.getCnv(data.metaData.conversation);
                                    if (conversationData.status == 0) {
                                      let eventName="onMsgReacted"
                                      let eventData= [{...({...newRes})._doc,conversation_id:data.metaData.conversation}]
                                      try{
                                        informOperator(io,socket.id,conversationData,eventName,eventData);
                                      }catch(err){
                                        console.log("informOperator err",err)
                                        throw err;
                                      }
                                    }
                            logger.info(`Event: updateReact ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
                        }
                        )
                    } else {
                        await react.postReact(data).then(async (res) => {
                                    socket.to(data.metaData.conversation).emit("onMsgReacted" , {...({...res})._doc,conversation_id:data.metaData.conversation});
                                    socket.emit("onMsgReacted" , {...({...res})._doc,conversation_id:data.metaData.conversation})
                                    
                                    const conversationData = await conversationAct.getCnv(data.metaData.conversation);
                                    if (conversationData.status == 0) {
                                      let eventName="onMsgReacted"
                                      let eventData= [{...({...res})._doc,conversation_id:data.metaData.conversation}]
                                      try{
                                        informOperator(io,socket.id,conversationData,eventName,eventData);
                                      }catch(err){
                                        console.log("informOperator err",err)
                                        throw err;
                                      }
                                    }


                            logger.info(`Event: postReact(onMessageReacted) ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
                        }
                        )
                    }
                })
            } catch (err) {
                logger.info(`Event: onMessageReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
            }
        });
        // onMessageUnReacted : Fired when the user remove a reaction from message.
        socket.on('unReactMsg', async function (data) {
            try {  
                    if(data){
                     const newRes= await react.unReactMsg(data)           
                     socket.to(data.metaData.conversation).emit("onUnReactMsg", {...({...newRes})._doc,conversation_id:data.metaData.conversation});
                     socket.emit("onUnReactMsg", {...({...newRes})._doc,conversation_id:data.metaData.conversation}) 

                     const conversationData = await conversationAct.getCnv(data.metaData.conversation);
                     if (conversationData.status == 0) {
                       let eventName="onUnReactMsg"
                       let eventData= [{...({...newRes})._doc,conversation_id:data.metaData.conversation}]
                       try{
                         informOperator(io,socket.id,conversationData,eventName,eventData);
                       }catch(err){
                         console.log("informOperator err",err)
                         throw err;
                       }
                     }
                     
                    logger.info(`Event: onMessageUnReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
                }
            } catch (err) {
                logger.error(`Event: onMessageUnReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
            }
        });
        // onMentionRequest : Fired when the user add mention.
        socket.on('requestMention', async function (data) {
            try {               
                      socket.to(data.metaData.conversation).emit("onMentionRequest", res);
                    socket.emit("onMentionRequest", res)

                  
                logger.info(`Event: onMentionRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onMentionRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)

            }

        });
        // onMentionReceived : Fired when the user remove mention.
        socket.on('onMentionReceived', async function (data) {
            try {

                let emitEvent = "onMentionReceived";
            
                        io.to(data.metaData.conversation).emit(emitEvent);
                logger.info(`Event: onMentionReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onMentionReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
            }

        });
        // onTypingStarted : Fired when the user start typing.
        socket.on('onTypingStart', async function (data) {
            try {
              if(data.metaData.conversation){

              
                        userM.getUser(data.user).then(async (userData)=>{
                          const conversationData = await conversationAct.getCnv(data.metaData.conversation);

                            const combinedData = { ...data, user_data:({...userData})._doc,conversationData};

                            socket.to(data.metaData.conversation).emit("onTypingStarted", combinedData);

                            if (conversationData.status == 0) {
                              let eventName="onTypingStarted"
                              let eventData= [combinedData]
                              try{
                                informOperator(io,socket.id,conversationData,eventName,eventData);
                              }catch(err){
                                console.log("informOperator err",err)
                                throw err;
                              }
                            }

                        })
                        }
                 logger.info(`Event: onTypingStart ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)

            } catch (err) {
                 logger.error(`Event: onTypingStart ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
            }

        });
 
        // onTypingStoppe : Fired when the user stop typing.
        socket.on('onTypingStop', async function (data) {
            try {
              if(data.metaData.conversation){
                const conversationData = await conversationAct.getCnv(data.metaData.conversation);

                userM.getUser(data.user).then(async (userData)=>{
                  const combinedData = { ...data, user_data:({...userData})._doc ,conversation:conversationData};
                        socket.to(data.metaData.conversation).emit("onTypingStopped", data);
                        if (conversationData.status == 0) {
                          let eventName="onTypingStopped"
                          let eventData=[combinedData]
                          try{
                            informOperator(io,socket.id,conversationData,eventName,eventData);
                          }catch(err){
                            console.log("informOperator err",err)
                            throw err;
                          }
                        }
                        }
                )}
                logger.info(`Event: onTypingStopped ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"   \n `)
            } catch (err) {
                logger.error(`Event: onTypingStopped,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"" " , date: ${fullDate}"  ,err :${err} \n `)
            }
        });
        
        socket.on('saveForm',async function (data){
                try{
                    saveFormData(data,socket)
                }catch(err){
                    console.log("error ",err)
                }
        })
        socket.on("verifyEmail",async function (data,applicationName,language){
          try{
               sendVerificationEmail(data,socket,applicationName,language)
          }catch(err){
            console.log("error",err )
          }
        })


       

    })
}

export default ioChatEvents