import {
    io
} from '../../index.js'
const ioConnEvents = function () {
   /* A middleware that is executed before the connection event. */
    io.use ((socket,next)=>{
            
    })
    io.on('connection', async (socket) => {

        /**
         * onConnect : User connect to websocket
         */
        socket.on('onConnect', async (data) => {
            console.log("user just connected!!", data)
            socket.join(data.id)
            socket.emit("connected")

        })

        /**
         * onDisconnect : User disconnect from websocket
         */
        socket.off('onDisconnect', async (data) => {
            console.log("user disconnected")
            socket.leave(data.id)
        })
        /**
         * onReconnect : User reconnect to websocket
         */
        socket.on('onReconnect', async (data) => {
            console.log("user reconnect ")
     
        })



    })
}
export default ioConnEvents