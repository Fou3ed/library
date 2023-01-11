//client.js
// import {
//     randomUUID
// } from 'crypto';
import * as io from 'socket.io-client'

let socket = io.connect('http://localhost:3000', {
    reconnect: true
});


/* Listening to all events. */
socket.onAny((event, ...args) => {
    console.log(event, args);
});

/**
 *                            connection Events
 */

/**
 * on connect
 */
export const connect= () => {
    socket.emit('onConnect')

}

connect()

/**
 * on disconnect
 */
export const disconnect= () => {
    socket.emit('onDisconnect')
}

/**
 * on reconnect
 */
export const reconnect=()=>{
    socket.emit('onReconnect')
}




/**
 *                                        Conversation Events
 */

/**
 * 
 * @param {*roomId} data 
 */
export const createConversation = (data) => {
    socket.emit('onConversationStart', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("conversation created");
        console.log('====================================');
    })
    socket.on('onConversationStart',()=> {
        console.log("okay okay")
    })
}
// let client={
//     client:"foued"
// }
// createConversation(client)

export const onConversationEnd = (data) => {
    socket.emit('onConversationEnd', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("conversation End ");
        console.log('====================================');
        socket.on("onConversationEnd",()=>{
            
        })

    })
}


export const onConversationUpdated = (data) => {
    socket.emit('onConversationUpdated', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("conversation updated ");
        console.log('====================================');
        socket.on("onConversationUpdated",()=>{

        })

    })
}
export const onConversationDeleted = (data) => {
    socket.emit('onConversationDeleted', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("conversation Deleted ");
        console.log('====================================');
        socket.on("onConversationDeleted",()=>{
            
        })
    })
}

export const onConversationEndRequest = (data) => {
    socket.emit('onConversationEndRequest', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("conversation End request ");
        console.log('====================================');
        socket.on("onConversationEndRequest",()=>{
            
        })

    })
}
/**
 *  room id : randomUUID 
 */
// let data =randomUUID()
//  createConversation(data)
// onConversationUpdated()
// onConversationEnd()
// onConversationDeleted()
// onConversationEndRequest()


/**
 *                       Conversation Members
 */


export const onConversationMemberRequest = (data) => {
    socket.emit('onConversationMemberRequest', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log(" Member request to join conversation ");
        console.log('====================================');
        socket.on("onConversationMemberRequest",()=>{
            
        })

    })
}
export const onConversationMemberJoined = (data) => {
    socket.emit('onConversationMemberRequest', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("Member joined the conversation");
        console.log('====================================');
        socket.on("onConversationMemberRequest",()=>{
            
        })

    })
}

export const onConversationMemberLeft = (data) => {
    socket.emit('onConversationMemberLeft', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("Member Left the conversation");
        console.log('====================================');

    })
}

export const onConversationMemberBanned = (data) => {
    socket.emit('onConversationMemberBanned', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("Member banned from the conversation");
        console.log('====================================');

    })
}

export const onConversationMemberUnbanned = (data) => {
    socket.emit('onConversationMemberBanned', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("Member Unbanned from the conversation");
        console.log('====================================');
    })
}


export const onConversationTransferRequest = (data) => {
    socket.emit('onConversationTransferRequest', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("Transfer request");
        console.log('====================================');
    })
}

export const onConversationTransferAccept = (data) => {
    socket.emit('onConversationTransferAccept', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("transfer accepted");
        console.log('====================================');
    })
}

export const onConversationTransferReject = (data) => {
    socket.emit('onConversationTransferReject', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("transfer rejected");
        console.log('====================================');
    })
}

/**
 * 
 *                                    Message Events               
 */
export const onMessageDelivered = (data) => {
    socket.emit('onMessageDelivered', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("message Delivered ");
        console.log('====================================');
        socket.on('onMessageDelivered',(data)=>{
            console.log("foued",data)
        })
        
    })
}

// let data = {
//         "type": "MESG",
//         "conversation_id": "63907b74266e3b8358516cd1",
//         "user": "6390b306dfb49a27e7e3c0bb",
//         "mentioned_users": "6390b4d54a1ba0044836d613",
//         "readBy": "6390b4d54a1ba0044836d613",
//         "is_removed": false,
//         "message": "nzid f id v2",
//         "data": "additional message information ",
//         "attachments": {
//           "key": "value"
//         },
//         "parent_message_id": "6390bbb76b96e925c5eb1858",
//         "parent_message_info": "6390bbb76b96e925c5eb1858",
//         "location": "",
//         "origin": "web",
//         "read": null
//       }
// onMessageDelivered(data)

export const onMessageReceived = (data) => {
    socket.emit('onMessageReceived', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("message received ");
        console.log('====================================');
    })
}

export const onMessageUpdated = (data) => {
    socket.emit('onMessageUpdated', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("message updated ");
        console.log('====================================');
    })
}

export const onMessageDeleted = (data) => {
    socket.emit('onMessageDeleted', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("message deleted ");
        console.log('====================================');
    })
}

/**
 *                  user Events
 */
export const onUserLogin = (data) => {
    socket.emit('onUserLogin', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("user login successfully ");
        console.log('====================================');
    })
}

export const onUserLogOut = (data) => {
    socket.emit('onUserLogOut', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("user logout");
        console.log('====================================');
    })
}

export const onUserUpdated = (data) => {
    socket.emit('onUserUpdated', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("user updated");
        console.log('====================================');
    })
}
export const onUserDeleted = (data) => {
    socket.emit('onUserDeleted', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("user deleted");
        console.log('====================================');
    })
}

/**
 *                                 USER ACTION EVENTS 
 */

export const readMsg = (data) => {
    socket.emit('onMessageRead', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("message read");
        console.log('====================================');
    })

}


export const onMessagePinned = (data) => {
    socket.emit('onMessagePinned', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("message pinned");
        console.log('====================================');
    })
}
export const onMessageUnPinned = (data) => {
    socket.emit('onMessageUnPinned', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("message unpinned");
        console.log('====================================');
    })
}
export const onMessageReacted = (data) => {
    socket.emit('onMessageReacted', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("message reacted");
        console.log('====================================');
    })
}

export const onMessageUnReacted = (data) => {
    socket.emit('onMessageUnReacted', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("message unReacted");
        console.log('====================================');
    })
}

export const onMentionRequest = (data) => {
    socket.emit('onMentionRequest', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("mention request");
        console.log('====================================');
    })
}
export const onMentionReceived = (data) => {
    socket.emit('onMentionReceived', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log("mention received");
        console.log('====================================');
    })
}
export const onTypingStarted = (data) => {
    socket.emit('onTypingStarted', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log(" start typing");
        console.log('====================================');
    })
}
export const onTypingStopped = (data) => {
    socket.emit('onTypingStopped', data, error => {
        if (error) {
            setError(error)
        }
        console.log('====================================');
        console.log(" stop typing");
        console.log('====================================');
    })
}







// const joinRoom = (client) => {
//     socket.emit('add-pUser', client);

// }

// joinRoom({
//     user: "foued",
//     roomId: "1"
// })



// const sendMsg = (message) => {
//     socket.emit('send-pMsg', message);
// }

// let message={
//     type: "test",
//     conversation_id: "639ae9e25597b9d338e0e44e",
//     user: "6390b2efdfb49a27e7e3c0b9",
//     mentioned_users: "6390b306dfb49a27e7e3c0bb",
//     message: "alooo",
//     origin: "web"
// }
// sendMsg(message)


// const deleteMsg=(message)=>{
//     socket.emit('deleted-pMsg',message)
// }

// let data= {
//     id:"63bc0cf5c8c7a8efca2ba4d6",
//     roomId:"1"
// }
// deleteMsg(data)
// const privateMessage=(message)=>{
//     socket.emit("private message",message)

// }
// const getMsg=()=>{
//     socket.on('send-pMsg',message =>{
//         return message 
//     })
// } 
// let data = {
//     "type": "MESG",
//     "conversation_id": "63907b74266e3b8358516cd1",
//     "user": "6390b306dfb49a27e7e3c0bb",
//     "mentioned_users": "6390b4d54a1ba0044836d613",
//     "readBy": "6390b4d54a1ba0044836d613",
//     "is_removed": false,
//     "message": "lol",
//     "data": "additional message information ",
//     "attachments": {
//       "key": "value"
//     },
//     "parent_message_id": "6390bbb76b96e925c5eb1858",
//     "parent_message_info": "6390bbb76b96e925c5eb1858",
//     "location": "",
//     "origin": "web",
//     "read": null
//   }
// privateMessage(data)
// console.log(getMsg())


// const userConnection=(data)=>{
//     socket.emit('onConnect',data)
// }
// userConnection()