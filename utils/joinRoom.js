import messageActions from '../models/messages/messageMethods.js'
import convMembersAction from '../models/convMembers/convMembersMethods.js'
import userMethod from '../models/user/userMethods.js'

const foued = new messageActions()
const convMember = new convMembersAction()
const userM = new userMethod()


export default async function checkJoined(io, socket, conversationId, userId) {
    let status = "";
    try {
      // get conversation Members
      const members = await convMember.getConversationMembers(conversationId);
  
      const receiver = members.filter((member) => member !== userId);
  
      // get receiver information
      const res = await userM.getUser(receiver);
  
      // Check if the receiver is online (connected to the socket)
      if (res.is_active === true) {
        console.log("receiver is active");
  
        // Check if the room exists, if not create the room
        const room = io.of('/').adapter.rooms.get(conversationId);
        if (room === undefined) {
          console.log("room been created");
          socket.join(conversationId);
          io.to(res.socket_id).emit('joinConversationMember', conversationId);
          status = 3;
        }
        // Check if the receiver is joined, if not send an emit to join them
        else if (!(room && room.has(res.socket_id))) {
          console.log(`Socket ${res.socket_id} is in room ${conversationId}`);
  
          io.to(res.socket_id).emit('joinConversationMember', conversationId);
          console.log("join Member to the conversation");
          status = 2;
        } else {
          console.log('Users are already joined');
          status = 1;
        }
      } else {
        console.log('Receiver is offline');
        status = 0;
      }
    } catch (err) {
      console.log('Error:', err);
      status = -1; // or any other value that indicates an error
    }
    return status;
  }
  