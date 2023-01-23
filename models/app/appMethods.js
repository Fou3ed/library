import {
deleteAPP,getAppById,getApps,postApps,putApp
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
        const response = await getApps();
        const resData = await response;
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
        const response = await postApps(data)
        return response
    }
    /**
     * updatedMessage : update message data.
     */
    async putApp(id, data) {
        const response = await putApp(id, data)
        const resData = await response.json()
        return resData
    }
    /**
     * deleteMessage : delete message.
     */
    async deleteAPP(id) {
        const response = await deleteAPP(id)
        const resData = await response
        return resData
    }
}

export default appActions