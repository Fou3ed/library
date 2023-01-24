import {
    deleteAPP,
    getAppById,
    getApps,
    postApps,
    putApp
} from "../../services/appRequests.js"

'use-strict'
/* eslint-disable no-unused-vars */

class appActions {
    constructor() {

    }
    /**
     * getApps: get all apps 
     */
    async getApps() {
        const response = await fetch("http://127.0.0.1:3000/apps");
        const resData = await response.json();
        return resData;
    }
    /**
     * getApp by id 
     */
    async getAppById(id) {
        const response = await getAppById(id)
        return response;
    }
    /**
     * Add app
     */
    async postApps(data) {
        const response = await fetch(`http://127.0.0.1:3000/apps`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData = await response.json()
        return resData
    }
    /**
     * updatedMessage : update message data.
     */
    async putApp(id, data) {
        const response = await fetch(`http://127.0.0.1:3000/apps/${id}`, {
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
    async deleteAPP(id) {
        const response = await fetch(`http://127.0.0.1:3000/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const resData = await response.json()
        return resData
    }
}

export default appActions