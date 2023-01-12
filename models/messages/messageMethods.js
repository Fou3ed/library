import {
    GetMessages,
    postMessage,
    deleteMessage,
    MarkMessageAsRead,
    GetUnreadMessages,
    GetUnreadMessagesCount,
    getMessage,
    markMessageAsDelivered,
    putMessage
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
        const response = await GetMessages();
        const resData = await response;
        return resData;
    }
    /**
     * getMessage : get message data.
     */
    async getMsg(id) {
        const response = await getMessage(id)
        const resData = await response
        return resData;
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
    async putMsg(id, data) {
        const response = await putMessage(id, data)
        const resData = await response.json()
        return resData
    }
    /**
     * deleteMessage : delete message.
     */
    async deleteMsg(id) {
        const response = await deleteMessage(id)
        const resData = await response
        return resData
    }
    /**
     * markMessageAsRead : mark a message as read.
     */
    async readMsg(id) {
        const response = await MarkMessageAsRead(id)
        const resData = await response
        return resData
    }

    /**
     * markMessageAsDelivered : mark a message as delivered.
     */
    async deliverMsg(id) {
        const response = markMessageAsDelivered(id)
        const resData = await response.json()
        return resData
    }

    /**
     * getUnreadMessages : get unread messages.
     */
    async getUnReadMsg() {
        const response = await GetUnreadMessages();
        const resData = await response.json();
        return resData;
    }

    /**
     * getUnreadMessages : get unread messages.
     */
    async getUnReadMsgCount() {
        const response = await GetUnreadMessagesCount();
        const resData = await response.json();
        return resData;
    }
}

export default messageActions