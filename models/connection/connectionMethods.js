import {
getConnection
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

}

export default connectionActions