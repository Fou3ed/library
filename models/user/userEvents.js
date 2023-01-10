import userActions from './userMethods.js'
import {
    io
} from '../../index.js'
const foued = new userActions
const ioUserEvents = function () {

    io.on('connection', function (socket) {

        // onUserLogin : Fired when the user log in.
        socket.on('onUserLogin', (data) => {
            console.log('====================================');
            console.log("user login successfully ");
            console.log('====================================');
        });
        // onUserLogout : Fired when the user log out.
        socket.on('onUserLogOut', (data) => {
            console.log('====================================');
            console.log("user logout");
            console.log('====================================');
        });
        // onUserUpdated : Fired when the user date updated.
        socket.on('onUserUpdated', (data) => {
            console.log('====================================');
            console.log("user updated");
            console.log('====================================');
        });
        // onUserDeleted : Fired when the user deleted

        socket.on('onUserDeleted', (data) => {
            console.log('====================================');
            console.log("user deleted");
            console.log('====================================');
        });

    })

}

export default ioUserEvents