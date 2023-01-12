import {
    io
} from '../../index.js'
const ioConnEvents = function () {
   /* A middleware that is executed before the connection event. */
    // io.use ((socket,next)=>{
            
    // })

    io.on('connection', async (socket) => {
        /**
         * onConnect : User connect to websocket
         */
        socket.on('onConnect', async (data) => {
            console.log("user just connected!!", socket.id)
            socket.join(socket.id)
            socket.emit("connected in socket id : ",socket.id)
        })

        /**
         * onDisconnect : User disconnect from websocket
         */
        socket.on('onDisconnect', async (data) => {
            console.log("user disconnected",socket.id)
            socket.leave(socket.id)
            socket.emit('onDisconnect : ',socket.id)
        })

        /**
         * onReconnect : User reconnect to websocket
         */
        socket.on('onReconnect', async (data) => {
            console.log("user reconnect")
            socket.emit('onReconnect',data)
        })
    })

}
export default ioConnEvents

