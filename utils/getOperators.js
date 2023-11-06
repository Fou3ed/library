import { socketIds } from "../models/connection/connectionEvents";
function getUserIdByAccountAndRole(socketIds, accountId, role) {
    try {
      for (const socketId in socketIds) {
        const socketData = socketIds[socketId];
        if (socketData.accountId === accountId && socketData.role === role) {
          return socketData.userId;
        }
      }
    } catch (error) {
      // Handle the error here or log it for debugging purposes
      console.error('Error occurred while searching for userId:', error);
    }
  
    // Return null if no matching accountId and role is found
    return null;
  }
  