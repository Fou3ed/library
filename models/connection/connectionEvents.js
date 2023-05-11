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
import https from 'https'

export let  clientBalance=[]
const ioConnEvents = function () {
    io.on('connection', async (socket) => {
        socket.on("user-connected", async (onConnectData) => {

            const user = onConnectData.user
            console.log("user-connected : ", onConnectData)
            //update the user socket for every connection event
            await userAct.putUserSocket(user, socket.id)
            const status = true
            //update the use activity to is_active=true
            await userAct.putUserActivity(socket.id, status)
            //save connection to data base 
            await db.postConnection(onConnectData.metaData, socket.id).then((newData) => {
                    
    const options = {
        hostname: 'iheb.local.itwise.pro',
        path: '/private-chat-app/public/api/getbalancesbycontact/3',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2Nzg5NjUzMzQsImV4cCI6MTYyMDA1NzIzMzMzLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlcm5hbWUiOiJ0ZXN0QGdtYWlsLmNvbSJ9.fUm3v7Bk6ooi0J8LJ9WmAmsIYsJUZlfvNplrnPgPnP0j3k2lf4E9GsltoqeQin20pnUoMQq7O5CQKjuqK8xO8WAeORC1yMX0dhdlXZapd9SQKCFrEviS_JoXiLOyB7qeNiaKlzm4n-gpDX0o6_LuN__p6u4_WB_abHI3dOmsJwliU4SElXQhfqYPDnkT9dcnHIHt6fv9H0urApxF42oSMMvhXYT_UJeL6r9cJ-tzHdqtpl6tsfsWhPgz1WdjuRyTZI-xctDIpDoX3xZ8wwruXMjEAPMfbz6UbX6FYJbBnNYrETsdS1lXgrWhnAmLVJT_6TzHfOmeGJZP-fDDnr7ozg'
        }
      };
      const req = https.request(options, res => {      
        let data = '';
        res.on('data', d => {
          data += d;
        });
      
        res.on('end', () => {
          const parsedData = JSON.parse(data);
          const balance = parsedData[0].balance;
          const balanceId=parsedData[0].id
          clientBalance.push({user,balance,balanceId})
        });
      });
      req.on('error', error => {
        console.error(error);
      });
      
      req.end();
                    userAct.getUser(user).then((userData)=>{
                        socket.broadcast.emit("user-connection", userData)

                    })
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
            // get user with socket.id
             const user= await userAct.getUserBySocket(socket.id)
             clientBalance = clientBalance.filter(obj => obj.user !== user);

            //inform all the users in the name space user disconnection
             socket.broadcast.emit("onDisconnected", reason, user)
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
                             //TODO  get balance and send it with the emit and save it in array 
                            
                                
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