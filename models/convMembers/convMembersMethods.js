import {
    GetMembers,
    deleteMember,
    getMember,
    postMember,
    putMember,
    getMembersByConversation,
    checkMember,
    removeMember
} from "../../services/convMembersRequests.js";
import User from '../user/userModel.js'

class convMembersAction {
    constructor(){

    }
    async getConversationMembers(convId){
        const members = await getMembersByConversation(convId);
        const userIds = members.map(member => member._id.toString());

        const users = await User.find({ _id: { $in: userIds } });
        return users.map(user => user._id.toString());
      }

    /**
     * getMembers : get members of conversation.
     */
    async getMembers() {
        const response = await GetMembers();
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
        return await postMember(data)
    }
    async checkMember(convId,userId) {
        const response = await checkMember(convId,userId)
        return response
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
    async removeMember(conversationId, userId, conversationType) {
        return await removeMember(conversationId, userId, conversationType)
    }
}
export default convMembersAction