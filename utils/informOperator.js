import { socketIds } from "../models/connection/connectionEvents.js";
import mongoose from "mongoose";


export  async function informOperator(io,senderSocketId,conversationData,eventName,eventData) {
  try {

    //search for the operators socket ids in the global array socketIds
    Object.entries(socketIds).forEach(([socketId, user]) => {
      if ( senderSocketId !== socketId &&
        conversationData.operators?.includes(user.userId.map(userId => mongoose.Types.ObjectId(userId)))
      ) {
        io.to(socketId).emit(eventName,...eventData)
      }
    });
  } catch (error) {
    console.error("Error in informOperator function:", error);
    throw error; 
  }
}
