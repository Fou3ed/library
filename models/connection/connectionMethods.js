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
        const resData = await response;
        return resData;
    }

}

export default connectionActions