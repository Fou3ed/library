import userActions from './userMethods.js'
import {
    io
} from '../../index.js'
import logger from '../../config/newLogger.js'
const foued = new userActions
const ioUserEvents = function () {

    io.on('connection', function (socket) {

        // onUserLogin : Fired when the user log in.
        socket.on('onUserLogin', (data) => {
            try {
                io.to(data.roomId).emit('onUserLogin', data);
                console.log('====================================');
                console.log("user login successfully ");
                console.log('====================================');
                foued.logIn(data)
                logger.info(`Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

            }

        });
        // onUserLogout : Fired when the user log out.
        socket.on('onUserLogOut', (data) => {
            try {
                io.to(data.roomId).emit('onUserLogOut', data);
                console.log('====================================');
                console.log("user logout");
                console.log('====================================');
                logger.info(`Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)
                logger.info(`Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onUserLogin ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

            }

        });
        // onUserUpdated : Fired when the user date updated.
        socket.on('onUserUpdated', (data) => {
            try {
                io.to(data.roomId).emit('onUserUpdated', data);
                console.log('====================================');
                console.log("user updated");
                console.log('====================================');
                logger.info(`Event: onUserUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onUserUpdated ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)

            }

        });
        // onUserDeleted : Fired when the user deleted

        socket.on('onUserDeleted', (data) => {
            try {
                io.to(data.roomId).emit('onUserDeleted', data);
                console.log('====================================');
                console.log("user deleted");
                console.log('====================================');
                logger.info(`Event: onUserDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha , date: ${fullDate}"   \n `)

            } catch (err) {
                logger.error(`Event: onUserDeleted ,data: ${JSON.stringify(data)} , socket_id : ${socket.id} ,token :"taw nzidouha ,error ${err}, date: ${fullDate} "   \n `)


            }

        });

    })
}

export default ioUserEvents