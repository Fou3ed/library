import {
    GetMessages,postMessage,deleteMessage
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
        const response = await GetMessages;
        const resData = await response();
        return resData;
    }
    /**
     * getMessage : get message data.
     */
    async getMsg(id) {
        const response = await fetch(`http://127.0.0.1:3000/message/${id}`)
        const resData = await response.json();
        return resData;
    }
    /**
     * createMessage : create message.
     */
    async addMsg(data) {
        const response = await postMessage(data)
        const resData = await response
        return resData
    }
    /**
     * updatedMessage : update message data.
     */
    async putMsg(id, data) {
        const response = await fetch(`http://127.0.0.1:3000/message/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData = await response.json()
        return resData
    }
    /**
     * deleteMessage : delete message.
     */
    async deleteMsg(id) {
        console.log("haw lenna",id)
        const response = await deleteMessage(id)
        const resData = await response
        return resData
    }
    /**
     * markMessageAsRead : mark a message as read.
     */
    async readMsg(data) {
        const response = await fetch(`http://127.0.0.1:3000/message/read/${data.messageId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData = await response.json()
        return resData
    }

    /**
     * markMessageAsDelivered : mark a message as delivered.
     */
    async deliverMsg(id, data) {
        const response = await fetch(`http://127.0.0.1:3000/message/deliver/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData = await response.json()
        return resData
    }

    /**
     * getUnreadMessages : get unread messages.
     */
    async getUnReadMsg() {
        const response = await fetch("http://127.0.0.1:3000/message/unread/messages");
        const resData = await response.json();
        return resData;
    }

    /**
     * getUnreadMessages : get unread messages.
     */
    async getUnReadMsgCount() {
        const response = await fetch("http://127.0.0.1:3000/message/unread/messages/count");
        const resData = await response.json();
        return resData;
    }
}

export default messageActions