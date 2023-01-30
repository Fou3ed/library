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
        const response = await fetch("http://127.0.0.1:3000/connection");
        return response;
    }
    

    async postConnection(data,socket_id){
        const response=await postConnection(data,socket_id);
        return response;
    }
}

export default connectionActions