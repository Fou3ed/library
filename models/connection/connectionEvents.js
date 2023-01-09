import {
    io
} from '../../index.js'
const ioConnEvents = function () {
    /**
     * onConnect : User connect to websocket
     */
    io.on('connection', function (socket) {

        socket.on('onConnect', function (data) {
            /**
             * -check user_token 
             * -inti connection socket 
             */
        })

        /**
         * onDisconnect : User disconnect from websocket
         */
        socket.on('onDisconnect', function (data) {
            /**
             * -disconnect user
             * 
             */
        })
        /**
         * onReconnect : User reconnect to websocket
         */
        socket.on('onReconnect', function (data) {
            /**
             * -reconnect user
             * 
             */
        })



    })
}
export default  ioConnEvents