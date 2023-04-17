import messageActions from '../models/messages/messageMethods.js'
import convMembersAction from '../models/convMembers/convMembersMethods.js'
import userMethod from '../models/user/userMethods.js'

const foued = new messageActions()
const convMember = new convMembersAction()
const userM = new userMethod()


export default async function checkJoined(io,socket,conversationId,userId) {
    const status=""

    if (conversationId) {

        const members = await convMember.getConversationMembers(conversationId);

        const receiver = await Promise.all(
            members
            .filter(member => member !== userId)
            .map(async (member) => {
                return member;
            })
        );
        //get receiver information
        userM.getUser(receiver).then((res) => {
            // Check if the receiver is online (connected to the socket)
            if (res.is_active === true) {
                console.log("receiver is active")
                // Check if the room exists, if not create the room
                const room = io.of('/').adapter.rooms.get(conversationId);
                if (room === undefined) {
                    console.log("room been created")
                    socket.join(conversationId)
                    io.to(res.socket_id).emit('joinConversationMember', conversationId);
                     
                }
                // Check if the receiver is joined, if not send an emit to join them
                else if (!(room && room.has(res.socket_id))) {
                    console.log(`Socket ${res.socket_id} is in room ${conversationId}`)

                    io.to(res.socket_id).emit('joinConversationMember', conversationId);
                    console.log("join Member to the conversation")
               
                } else {
                    console.log('Users are already joined');
              
                }
            } else {
              
                console.log('Receiver is offline');

            }
        })
    }
}
