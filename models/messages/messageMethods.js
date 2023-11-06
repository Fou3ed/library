import {
    GetLastMessage,
    postMessage,
    deleteMessage,
    MarkMessageAsRead,
    GetUnreadMessages,
    GetUnreadMessagesCount,
    getMessage,
    markMessageAsDelivered,
    putMessage,
    MarkMessageAsPinned,
    MarkMessageAsUnPinned,
    MarkMessageAsForwarded,
    putPlanMessage
} from "../../services/messageRequests.js"


'use-strict'
/* eslint-disable no-unused-vars */

class messageActions {
    constructor() {

    }
    /**
     * getMessages : get messages.
     */
    async getMsgs() {
        const response = await GetLastMessage();
        const resData = await response.json();
        return resData;
    }
    /**
     * getMessage : get message data.
     */
    async getMsg(id) {
        const response = await getMessage(id)
        return response;
    }
    /**
     * createMessage : create message.
     */
    async addMsg(data) {
        const response = await postMessage(data)
        return response
    }
    /**
     * updatedMessage : update message data.
     */
    async putMsg(messageId,content) {
        const response = await putMessage(messageId,content)
     
        return response
    }
    async putPlanMessage(messageId,status) {
        const response = await putPlanMessage(messageId,status)
     
        return response
    }

    
    /**
     * deleteMessage : delete message.
     */
    async deleteMsg(id) {
        const response = await deleteMessage(id)
        return response
    }
    /**
     * markMessageAsRead : mark a message as read.
     */
    async readMsg(data) {
        const response = await MarkMessageAsRead(data)
        return response
    }
    /**
     * MarkMsg as Pinned 
     */
    async pinMsg(message,user){
        const response=await MarkMessageAsPinned(message,user)
        return response
    }
      /**
     * MarkMsg as unPinned 
     */
      async unPinMsg(id){
        const response=await MarkMessageAsUnPinned(id)
        return response
    }
    /**
     * markMessageAsDelivered : mark a message as delivered.
     */
    async deliverMsg(id) {
        const response = markMessageAsDelivered(id)
        const resData = await response
        return resData
    }

    /**
     * getUnreadMessages : get unread messages.
     */
    async getUnReadMsg() {
        const response = await GetUnreadMessages();
        const resData = await response
        return resData;
    }

    /**
     * getUnreadMessages : get unread messages.
     */
    async getUnReadMsgCount() {
        const response = await GetUnreadMessagesCount();
  
        return response;
    }
    async markMessageAsForwarded(data){
        const response = await MarkMessageAsForwarded(data)
        return response
    }
}

export default messageActions