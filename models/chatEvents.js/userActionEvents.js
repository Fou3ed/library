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
const ioChatEvents = function () {

    io.on('connection', function (socket) {
        // onMessageRead : Fired when the user read a message.
        socket.on('onMessageRead', (data) => {
            try {
                io.to(data.metaData.conversation).emit('read-msg', data);
                console.log('====================================');
                console.log("message read");
                console.log('====================================');
                logger.info(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                foued.readMsg(data).then((res) =>
                    socket.emit("onMessageRead", {
                        res: res,
                    }, )
                )
            } catch (err) {
                logger.error(`Event: onMessageRead ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
            }
        });

        // onMessagePinned : Fired when the user pin a message.

        socket.on('pinMsg', (data) => {
            try {

                console.log('====================================');
                console.log("message pinned", data);
                console.log('====================================');
                foued.pinMsg(data).then((res) => {
                    io.to(data.metaData.conversation).emit("onMsgPinned", {
                        res: res,
                    }, )

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
                        await react.putReact(res).then((res)=>{
                            io.to(data.metaData.conversation).emit("onMsgReacted", res)
                            console.log("just update")
                        })
                        
                    } else {
                        await react.postReact(data).then((res) => {
                            console.log("add React ", res)
                            io.to(data.metaData.conversation).emit("onMsgReacted", res)

                        })
                    }
                })



            } catch (err) {
                logger.info(`Event: onMessageReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            }

        });
        // onMessageUnReacted : Fired when the user remove a reaction from message.
        socket.on('unReactMsg', function (data) {
            try {

                console.log('====================================');
                console.log("message unReacted");
                console.log('====================================');
                react.unReactMsg(data).then((res) => {
                        io.to(data.metaData.conversation).emit("onUnReactMsg", res)
                    }

                )
                logger.info(`Event: onMessageUnReacted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
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