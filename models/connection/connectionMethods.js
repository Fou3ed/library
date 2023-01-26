import {
getConnection,postConnection
} from "../../services/connection.js"


'use-strict'
/* eslint-disable no-unused-vars */

class connectionActions {
    constructor() {

    }
    /**
     * getMessages : get messages.
     */
    async getConnection() {
        const response = await getConnection();
        return response;
    }

    async postConnection(data,socket_id){
        const response=await postConnection(data,socket_id);
        return response;
    }
}

export default connectionActions