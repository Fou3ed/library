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

const ioConnEvents = function () {

    io.on('connection', async (socket) => {

        /**
         * onConnect : User connect to websocket
         */
        socket.on('onConnect', async (data) => {
            io.sockets.sockets['foued'] = socket.id;

            try {
                console.log(socket.foued)
                check(data.app_id).then((res) => {
                    if (res) {
                        // Save user_id and socket_id together in socket data
                        socket.data.user_id = data.user;
                        socket.data.socket_id = socket.id;
                            console.log(socket.data)
                        info.onConnected.socket_id = socket.client.id
                        console.log("user just connected!!", socket.id)
                        socket.join(socket.id)
                        logger.info(`Event: onConnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}" \n `)
                        db.postConnection(data.metaData, socket.id).then((newData) => {
                            socket.emit('onConnected', info.onConnected, newData, data,socket.data)
                        })
                    } else {
                        logger.info(`Event: Attempt to onConnect ,data: ${JSON.stringify(data)} , date: ${fullDate}" \n `)
                        socket.leave(socket.id)
                        console.log("not allowed")
                    }
                })
            } catch (err) {
                logger.error(`Event: onConnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate} , error : ${err}" \n `)
            }
        })


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