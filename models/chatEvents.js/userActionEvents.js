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
import joinRoom from '../../utils/joinRoom.js'
import checkJoined from '../../utils/joinRoom.js'
const ioChatEvents = function () {

    io.on('connection', function (socket) {
        // onMessageRead : Fired when the user read a message.
        socket.on('onMessageRead', async (data) => {
            try {
                console.log('====================================');
                console.log("message read");
                console.log('====================================');
                await foued.readMsg(data).then(async (res) => {
                    console.log("res read message",res.modifiedCount)
                    if(res.modifiedCount===0){
                            console.log("all messages are being seen")
                    }else {
                    let status = await checkJoined(io, socket, data.metaData.conversation, data.user);
                    let emitEvent = "onMessageRead";
                    // socket.emit("onMessageRead",res)
                         console.log(data,status)   
                    switch (status) {
                        case 0:
                            socket.emit(emitEvent, data);
                            break;
                        case 1:
                        case 2:
                        case 3:
                            io.to(data.metaData.conversation).emit(emitEvent, data);
                            break;
                        default:
                            console.log("error reading a message");
                            break;
                    }
                    logger.info(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                }
                });
            } catch (err) {
                logger.error(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
            }
        });

        // onMessagePinned : Fired when the user pin a message.

        socket.on('pinMsg', async (data) => {
            try {
                console.log('====================================');
                console.log("message pinned", data);
                console.log('====================================');
                const user_id = data.user
                const messageId = data.metaData.message_id
                await foued.pinMsg(messageId, user_id).then(async (newRes) => {
                    let status = await checkJoined(io, socket, data.metaData.conversation, user_id);
                    let emitEvent = "onMsgPinned";
                    switch (status) {
                        case 0:
                            socket.emit(emitEvent, newRes);
                            break;
                        case 1:
                        case 2:
                        case 3:
                            io.to(data.metaData.conversation).emit(emitEvent, newRes);
                            break;
                        default:
                            console.log("error pinning  a message");
                            break;
                    }
                });
                logger.info(`Event: pinMsg ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {

                logger.error(`Event: onMsgPinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
            }
        });

        // onMessageUnpinned : Fired when the user unpin a message.
        socket.on('unPinMsg', async (data) => {
            try {
                console.log('====================================');
                console.log("message unpinned");
                console.log('====================================');

                await foued.unPinMsg(data).then(async (res) => {
                    let status = await checkJoined(io, socket, data.metaData.conversation, data.user);
                    let emitEvent = "onMsgUnPinned";
                    switch (status) {
                        case 0:
                            socket.emit(emitEvent, res);
                            break;
                        case 1:
                        case 2:
                        case 3:
                            io.to(data.metaData.conversation).emit(emitEvent, res);
                            break;
                        default:
                            console.log("error unPinning a message");
                            break;
                    }
                });

                logger.info(`Event: onMessageUnPinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :" taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onMessageUnpinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

            }

        });
        // onMessageReacted : Fired when the user add a reaction to message.
        socket.on('reactMsg', async function (data) {
            try {
                console.log('====================================');
                console.log("message reacted",data);
                console.log('====================================');

                //if the message is being reacted by  the same person , delete the react and update it with the new one , else create new one directly
                const user_id = data.user
                const message = data.metaData.message_id
                await react.getMsgReact(message, user_id).then(async (res) => {
                    if (res.length > 0) {
                        joinRoom(io, socket, data.metaData.conversation, user_id)

                        await react.putReact(res[0]._id, data).then((newRes) => {
                            io.to(data.metaData.conversation).emit("onMsgReacted", newRes)
                            socket.emit("onMsgReacted", newRes, res)
                        })
                    } else {
                        joinRoom(io, socket, data.metaData.conversation, user_id)
                        await react.postReact(data).then((res) => {
                            io.to(data.metaData.conversation).emit("onMsgReacted", res)
                            socket.emit("onMsgReacted", res)
                        })
                    }
                })
                logger.info(`Event: onMessageReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.info(`Event: onMessageReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
        });
        // onMessageUnReacted : Fired when the user remove a reaction from message.
        socket.on('unReactMsg', async function (data) {
            try {
                console.log('====================================');
                console.log("message UnReacted",data);
                console.log('====================================');
                await react.unReactMsg(data.metaData.message_id).then(async (newRes) => {
                    
                    let status = await checkJoined(io, socket, data.metaData.conversation, data.user);
                    let emitEvent = "onUnReactMsg";
                    console.log(status)
                    switch (status) {
                        case 0:
                            socket.emit(emitEvent, newRes);
                            break;
                        case 1:
                        case 2:
                        case 3:
                             io.in(data.metaData.conversation).emit(emitEvent, newRes);
                            break;
                        default:
                            console.log("error unReacting a message");
                            break;
                    }
                });
                logger.info(`Event: onMessageUnReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onMessageUnReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
        });
        // onMentionRequest : Fired when the user add mention.
        socket.on('requestMention', async function (data) {
            try {
                console.log('====================================');
                console.log("Mention Request");
                console.log('====================================');
                let status = await checkJoined(io, socket, data.metaData.conversation, data.user);
                let emitEvent = "onMentionRequest";
                switch (status) {
                    case 0:
                      socket.emit(emitEvent, res);
                      break;
                    case 1:
                    case 2:
                    case 3:
                      io.to(data.metaData.conversation).emit(emitEvent, res);
                      break;
                    default:
                      console.log("error deleting a message");
                      break;
                  }
                logger.info(`Event: onMentionRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onMentionRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }

        });
        // onMentionReceived : Fired when the user remove mention.
        socket.on('onMentionReceived', async function (data) {
            try {

                console.log('====================================');
                console.log("Mention Received");
                console.log('====================================');
                //change something in dataBase
                let status = await checkJoined(io, socket, data.metaData.conversation, data.user);
                let emitEvent = "onMentionReceived";
                switch (status) {
                    case 0:
                        socket.emit(emitEvent);
                        break;
                    case 1:
                    case 2:
                    case 3:
                        io.to(data.metaData.conversation).emit(emitEvent);
                        break;
                    default:
                        console.log("error mention received");
                        break;
                }

                logger.info(`Event: onMentionReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onMentionReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }

        });
        // onTypingStarted : Fired when the user start typing.
        socket.on('onTypingStart', async function (data) {
            try {
                
                let status = await checkJoined(io, socket, data.metaData.conversation, data.user);
                let emitEvent = "onTypingStarted";

                switch (status) {
                    case 0:
                      console.log("user offline")
                        break;
                    case 1:
                    case 2:
                    case 3:
                        socket.to(data.metaData.conversation).emit(emitEvent, data);
                        break;
                    default:
                        console.log("error onTypingStart a message");
                        break;
                }

                logger.info(`Event: onTypingStart ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onTypingStart ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }

        });
        // onTypingStopped : Fired when the user stop typing.
        socket.on('onTypingStop', async function (data) {
            try {
                let status = await checkJoined(io, socket, data.metaData.conversation, data.user);
                let emitEvent = "onTypingStopped";
                switch (status) {
                    case 0:
                        socket.emit(emitEvent, data);
                        break;
                    case 1:
                    case 2:
                    case 3:
                        io.to(data.metaData.conversation).emit(emitEvent, data);
                        break;
                    default:
                        console.log("error onTypingStopped a message");
                        break;
                }
                logger.info(`Event: onTypingStop ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            } catch (err) {
                logger.error(`Event: onTypingStop,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
        });
    })
}

export default ioChatEvents