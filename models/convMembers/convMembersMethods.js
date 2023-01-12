import {
    GetMembers,
    deleteMember,
    getMember,
    postMember,
    putMember
} from "../../services/convMembersRequests.js";

class convMembersAction {


    /**
     * getMembers : get members of conversation.
     */
    async getMembers() {
        const response = await GetMembers;
        const resData = await response.json();
        return resData;
    }
    /**
     * getMember : get member data.
     */
    async getMember(id) {
        const response = await getMember(id)
        const resData = await response.json();
        return resData;
    }
    /**
     * addMembers : add members to conversation.
     */

    async addMember(data) {
        const response = await postMember(data)
        const resData = await response.json()
        return resData
    }
    /**
     * updateMember : update member data.
     */
    async putMember(id, data) {
        const response = await putMember(id, data)
        const resData = await response.json()
        return resData
    }
    /**
     * deleteMembers : delete members from conversation.
     */
    async deleteMember(id) {
        const response = await deleteMember(id)
        const resData = await response.json()
        return resData
    }
}
export default convMembersAction