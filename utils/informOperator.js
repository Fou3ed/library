import { socketIds } from "../models/connection/connectionEvents.js";

export async function informOperator(io, senderSocketId, conversationData, eventName, eventData) {
  try {
    // Search for the operators' socket ids in the global array socketIds
    Object.entries(socketIds).forEach(([socketId, user]) => {
      if (
        senderSocketId !== socketId &&
        user.userId.find((userId) => conversationData.operators.includes(userId))
      ) {
        const roomName = conversationData._id.toString();


        // Check if socketId is a member of the roomName
        if (!(io.sockets.adapter.rooms.get(roomName)?.has(socketId))) {
          io.to(socketId).emit(eventName, ...eventData);

        } 
      }
    });
  } catch (error) {
    console.error("Error in informOperator function:", error);
    throw error;
  }
}
