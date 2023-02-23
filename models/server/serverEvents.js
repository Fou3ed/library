import {
    io
} from '../../index.js'
const ioServerEvents = function () {
    /**
   * 
onClose : Websocket connection closed
onError : Websocket connection closed

   */
    /**
     * onOpen : Websocket connection opened
     */
    io.on('connection', function (socket) {

        socket.on('onOpen', function (data) {
            try {

            } catch (err) {

            }
            /**
             * -check app_token 
             * 
             * -inti connection socket 
             */
        })

        socket.on('onClose', function (data) {
            try {

            } catch (err) {

            }
        })

        socket.on('onError', function (data) {
            try {
                
            } catch (err) {

            }
        })
    })
}
export default ioServerEvents