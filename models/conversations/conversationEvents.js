//import conversation from './conversationModel.js'
import conversationActions from './conversationMethods.js';
import {
    randomUUID
} from 'crypto';
import {
    io
} from '../../index.js';
const foued = new conversationActions
import logger from '../../config/newLogger.js'
import * as info from '../../data.js'

const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
const ioConversationEvents = function () {

    //room namespace
    io.on('connection', async (socket) => {



        // Create a new room
        // onConversationStart : Fired when the conversation created.
        socket.on('onConversationStart', (data) => {
            console.log("conversation",data)
            try {
                console.log(data.metaData.name == "")
                if (data.metaData.name == "") {
                    console.log("conversation must obtain a name ")
                } else {
                    console.log('====================================');
                    console.log("conversation created")
                    console.log("socket id:", socket.id)
                    console.log("client id : ", socket.client.id)
                    console.log("room id : ", socket.rooms)
                    console.log('====================================');
                    /**
                     * find if the room already exist in data base 
                     * else create new one 
                     */

                    foued.addCnv(data).then((res) => {
                        socket.join(res._id)
                        socket.emit('onConversationStarted', info.onConversationCreated, res)
                    })
                    logger.info(`Event: onConversationStart ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token taw nzidouha , date: ${fullDate}"   \n `)
                }
            } catch (err) {
                logger.error(`Event: onConversationStart ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :taw nzidouha ,error ${err}, date: ${fullDate}    \n `)
            }
        });

        socket.on('joinRoom',(data)=>{
            try{
                socket.join(data)
                socket.emit('roomJoined',data)
            }catch(err){
                logger.error(`Event: onCreate roo ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :taw nzidouha ,error ${err}, date: ${fullDate}    \n `)
            }
        })


        // onConversationEnd : Fired when the conversation ended.
        socket.on('onConversationEnd', (data) => {
            try {
                console.log('====================================');
                console.log("socket rooms : ", socket.rooms);
                console.log('====================================');
                logger.info(`Event: onConversationEnd ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                socket.emit("onConversationEnd", data)
            } catch (err) {
                logger.error(`Event: onConversationEnd ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)
            }
        });
        // onConversationUpdated : Fired when the conversation data updated.
        socket.on('onConversationUpdated', (data) => {
            try {
                console.log('====================================');
                console.log("socket rooms : ", socket.rooms);
                console.log('====================================');
                logger.info(`Event: onConversationUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                foued.putCnv(data.metaData.conversation, data).then((res) => {
                    socket.emit("onConversationUpdated", data, res)
                })
            } catch (err) {
                logger.error(`Event: onConversationUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
            }
        });

        // onConversationDeleted : Fired when the conversation deleted.

        socket.on('onConversationDeleted', (data) => {
            try {
                console.log('====================================');
                console.log("conversation deleted : ", socket.rooms);
                console.log('====================================');
                logger.info(`Event: onConversationDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                foued.deleteCnv(data.metaData).then((res) => {
                    socket.emit("onConversationDeleted", res)
                })
            } catch (err) {
                logger.error(`Event: onConversationDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error:${err} , date: ${fullDate}"   \n `)
            }
        });
    });
}


export default ioConversationEvents