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
const ioConnEvents = function () {




    io.on('connection', async (socket) => {

        socket.on("user-connected", async (onConnectData) => {
            const user = onConnectData.user
            console.log("user-connected : ", user)
            //update the user socket for every connection event
            await userAct.putUserSocket(user, socket.id)
            const status = true
            //update the use activity to is_active=true
            await userAct.putUserActivity(socket.id, status)
            //save connection to data base 
            console.log(onConnectData.metaData)
            await db.postConnection(onConnectData.metaData, socket.id).then((newData) => {
                //send an event to all users at the same namespace except the sender  to inform them about the new connection 
                 socket.broadcast.emit("user-connection", user)
            });
        });


        socket.on("disconnect", async (reason) => {
            if (reason === "io server disconnect") {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket.connect();
            }
            console.log("user disconnected :  ", socket.id, "reason", reason)
            //update user activity to is_active=false
            const status = false
            await userAct.putUserActivity(socket.id, status)
            //inform all the users in the name space user disconnection
             socket.broadcast.emit("onDisconnected", reason, socket.id)
        });


        /**
         * onConnect : User connect to websocket
         */
        socket.on('onConnect', async (data) => {

            try {
                check(data.app_id).then((res) => {
                    console.log(socket.id)
                    if (res) {
                        info.onConnected.socket_id = socket.client.id;
                        userAct.putUserSocket(data.user, socket.id).then((res) => {
                            console.log(res)
                        })
                        console.log("user just connected!!", socket.id);
                        logger.info(`Event: onConnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}" \n `);
                        db.postConnection(data.metaData, socket.id).then((newData) => {
                            socket.emit('onConnected', info.onConnected, newData, data, socket.data)
                        });

                    } else {
                        logger.info(`Event: Attempt to onConnect ,data: ${JSON.stringify(data)} , date: ${fullDate}" \n `);
                        socket.leave(socket.id);
                        console.log("not allowed");
                    }
                });
            } catch (err) {
                logger.error(`Event: onConnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate} , error : ${err}" \n `);
            }
        });
        /**
         * onDisconnect : User disconnect from websocket
         */
        socket.on('onDisconnect', async (data) => {
            try {
                console.log("user disconnected", socket.id)

                logger.info(`Event: Disconnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                socket.emit('onDisconnected : ', info.onDisconnected)
                socket.disconnect(socket.id)

            } catch (err) {
                console.log(err)
                logger.error(`Event: disconnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate} , error : ${err}"   \n `)
            }
        })
        /**
         * onReconnect : User reconnect to websocket
         */
        socket.on('onReconnect', async (data) => {
            try {
                console.log("user reconnect")
                socket.emit('onReconnect', data)
                logger.info(`Event: reconnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
            } catch (err) {
                logger.error(`Event: reconnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate} , error : ${err}"   \n `)
            }
        })
    })
}
export default ioConnEvents