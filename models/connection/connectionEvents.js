import {
    io
} from '../../index.js'
import check from '../../utils/auth.js'
const ioConnEvents = function () {


    io.on('connection', async (socket, data) => {


        /**
         * onConnect : User connect to websocket
         */

        socket.on('onConnect', async (data) => {
         check(data.app_id).then((res) => {
                if (res){
                    console.log("user just connected!!", socket.id)
                    socket.join(socket.id)
                    socket.emit("connected in socket id : ", socket.id)
                 } else {
                         socket.leave(socket.id)
                        console.log("not allowed")
                    }
            })
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