import {
    GetLogs,
    
    getLog,
    postLog,

} from "../../services/logsRequests.js"

class Logs {


    /**
     * getMembers : get members of conversation.
     */
    async getLogs() {
        const response = await GetLogs;
        const resData = await response.json();
        return resData;
    }
    /**
     * getMember : get member data.
     */
    async getLog(id) {
        const response = await getLog(id)
        const resData = await response
        return resData;
    }
    /**
     * addMembers : add members to conversation.
     */

    async addLog(data) {
        const response = await postLog(data)
        return response
    }
}
export default Logs