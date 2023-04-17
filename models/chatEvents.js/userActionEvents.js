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
const ioChatEvents = function () {

    io.on('connection', function (socket) {
        // onMessageRead : Fired when the user read a message.
        socket.on('onMessageRead', (data) => {
            try {
                console.log('====================================');
                console.log("message read");
                console.log('====================================');
                logger.info(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                foued.readMsg(data).then((res) =>{     
                    socket.emit("onMessageRead",res)
                    io.to(data.metaData.conversation).emit('read-msg', data);
                })
        } catch (err) {
                logger.error(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
            }
        });

        // onMessagePinned : Fired when the user pin a message.

        socket.on('pinMsg',async (data) => {
            try {

                console.log('====================================');
                console.log("message pinned", data);
                console.log('====================================');
                const user_id=data.user
                const messageId=data.metaData.message_id
                await foued.pinMsg(messageId,user_id).then((newRes) => {
                    io.to(data.metaData.conversation).emit("onMsgPinned", newRes )
                    socket.emit("onMsgPinned",newRes)
                })

                logger.info(`Event: pinMsg ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {

                logger.error(`Event: onMsgPinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

            }

        });
        // onMessageUnpinned : Fired when the user unpin a message.
        socket.on('unPinMsg', (data) => {
            try {
                console.log('====================================');
                console.log("message unpinned");
                console.log('====================================');
                logger.info(`Event: onMessagePinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :" taw nzidouha , date: ${fullDate}"   \n `)
                console.log("unpin", data)
                foued.unPinMsg(data).then((res) => {
                    io.to(data.metaData.conversation).emit("onMsgUnPinned", res)
                    socket.emit("onMsgUnPinned",res)
                })


            } catch (err) {
                logger.error(`Event: onMessageUnpinned ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

            }

        });
        // onMessageReacted : Fired when the user add a reaction to message.
        socket.on('reactMsg', async function (data) {
            try {
                console.log('====================================');
                console.log("message reacted");
                console.log('====================================');
                logger.info(`Event: onMessageReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

                //if the message is being reacted by  the same person , delete the react and update it with the new one , else create new one directly
                const user_id = data.user
                const message = data.metaData.message_id
                await react.getMsgReact(message, user_id).then(async (res) => {
                    if (res.length>0) {
                   joinRoom(io,socket,data.metaData.conversation,user_id)

                        await react.putReact(res[0]._id,data).then((newRes)=>{
                            console.log("conversation id ",data.metaData.conversation)
                            io.to(data.metaData.conversation).emit("onMsgReacted", newRes)       
                            socket.emit("onMsgReacted",newRes,res)
                            console.log("just update")
                        })
                    } else {                
                            joinRoom(io,socket,data.metaData.conversation,user_id)

                        await react.postReact(data).then((res) => {                         
                            io.to(data.metaData.conversation).emit("onMsgReacted", res)
                            socket.emit("onMsgReacted",res) 
                        })
                    }
                })
            } catch (err) {
                logger.info(`Event: onMessageReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
        });
        // onMessageUnReacted : Fired when the user remove a reaction from message.
        socket.on('unReactMsg', async function (data) {
            try {
                console.log('====================================');
                console.log("message UnReacted");
                console.log('====================================');
                        await react.unReactMsg(data.metaData.message_id).then((newRes)=>{
                            io.to(data.metaData.conversation).emit("onUnReactMsg", newRes)       
                            socket.emit("onUnReactMsg",newRes)

                        })
                
                   
            } catch (err) {
                logger.info(`Event: onMessageUnReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
        });
        // onMentionRequest : Fired when the user add mention.
        socket.on('requestMention', function (data) {
            try {
                io.to(data.metaData.conversation).emit("onMentionRequest", data)

                console.log('====================================');
                console.log("Mention Request");
                console.log('====================================');
                logger.info(`Event: onMentionRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onMentionRequest ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }

        });
        // onMentionReceived : Fired when the user remove mention.
        socket.on('onMentionReceived', function (data) {
            try {
                io.to(data.metaData.conversation).emit('onMentionReceived', data);
                console.log('====================================');
                console.log("Mention Received");
                console.log('====================================');
                logger.info(`Event: onMentionReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onMentionReceived ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }

        });
        // onTypingStarted : Fired when the user start typing.
        socket.on('onTypingStart', function (data) {
            try {
                socket.to(data.metaData.conversation).emit('onTypingStarted', data)
                logger.info(`Event: onTypingStart ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onTypingStart ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }

        });
        // onTypingStopped : Fired when the user stop typing.
        socket.on('onTypingStop', function (data) {
            try {
                socket.to(data.metaData.conversation).emit('onTypingStopped', data);
                logger.info(`Event: onTypingStop ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            } catch (err) {
                logger.error(`Event: onTypingStop,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }
        });
    })







}

export default ioChatEvents