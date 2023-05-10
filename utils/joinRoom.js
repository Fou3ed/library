import messageActions from '../models/messages/messageMethods.js'
import convMembersAction from '../models/convMembers/convMembersMethods.js'
import userMethod from '../models/user/userMethods.js'

const foued = new messageActions()
const convMember = new convMembersAction()
const userM = new userMethod()

export default async function checkJoined(io, socket, conversationId, userId) {
    let status = "";
    try {
      if (conversationId){
      // get conversation Members
      const members = await convMember.getConversationMembers(conversationId);

      const receiver = members.filter((member) => member !== userId);
      // get receiver information
      // receiver.forEach(async person => {
        const res = await userM.getUser(receiver);
      
        // Check if the receiver is online (connected to the socket)
        if (res.is_active === true) {
          // Check if the room exists, if not create the room
          const room = io.of('/').adapter.rooms.get(conversationId);
          if (room === undefined) {
            socket.join(conversationId);
            io.to(res.socket_id).emit('joinConversationMember', conversationId);
            status = 3;
          }
          // Check if the receiver is joined, if not send an emit to join them
          else if (!(room && room.has(res.socket_id))) {  
            io.to(res.socket_id).emit('joinConversationMember', conversationId);
            status = 2;
          } else {
             socket.emit('joinConversationMember', conversationId);
            status = 1;
          }
        } else {
          console.log('Receiver is offline');
          status = 0; 
        }}
      else{
        console.log("no conv id")
      }
    } catch (err) {
      console.log('Error:', err);
      status = -1; 
    }
    return status;
  }
  