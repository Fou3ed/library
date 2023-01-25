import {
    io
} from '../../index.js'
import check from '../../utils/auth.js'
import logs from '../logs/logsMethods.js'
const foued = new logs()
import logger from '../../config/newLogger.js'
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();
const ioConnEvents = function () {


    io.on('connection', async (socket) => {
        /**
         * onConnect : User connect to websocket
         */  
        socket.on('onConnect', async (data,newData) => {
            socket.emit('onConversationStarted')

            try{
                check(data.app_id).then((res) => {
                    if (res) {
                        console.log("user just connected!!", socket.id)
                        socket.join(socket.id)
                
                    } else {
                        socket.leave(socket.id)
                        console.log("not allowed")
                    }
                })
               
                logger.info(`Event: onConnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            }catch(err){
             logger(err)
                logger.error(`Event: onConnect ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate} , error : ${err}"   \n `)
            }

        })
    

        /**
         * onDisconnect : User disconnect from websocket
         */
        socket.on('onDisconnect', async (data) => {
            console.log("user disconnected", socket.id)
            socket.leave(socket.id)
            socket.emit('onDisconnect : ', socket.id)
        })

        /**
         * onReconnect : User reconnect to websocket
         */
        socket.on('onReconnect', async (data) => {
            console.log("user reconnect")
            socket.emit('onReconnect', data)
        })
    })
}
export default ioConnEvents