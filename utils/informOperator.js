import { socketIds } from "../models/connection/connectionEvents.js";
import mongoose from "mongoose";


export  async function informOperator(io,senderSocketId,conversationData,eventName,eventData) {
  console.log("inform operator",conversationData,eventName)
  try {
    //search for the operators socket ids in the global array socketIds
    Object.entries(socketIds).forEach(([socketId, user]) => {
      if ( senderSocketId !== socketId &&
        user.userId.find(userId => conversationData.operators.includes(userId))
      ) {
        io.to(socketId).emit(eventName,...eventData)
      }
    });
  } catch (error) {
    console.error("Error in informOperator function:", error);
    throw error; 
  }
}
