import {
deleteMedia,getMedia,getMedias,postMedia,putMedia
} from "../../services/mediaRequests.js";

class convMembersAction {
    /**
     * getMembers : get members of conversation.
     */
    async getMedias() {
        const response = await getMedias;
        const resData = await response;
        return resData;
    }
    /**
     * getMember : get member data.
     */
    async getMedia(id) {
        const response = await getMedia(id)
        const resData = await response;
        return resData;
    }
    /**
     * addMembers : add members to conversation.
     */

    async postMedia(data) {
        const response = await postMedia(data)
        const resData = await response
        return resData
    }
    /**
     * updateMember : update member data.
     */
    async putMedia(id, data) {
        const response = await putMedia(id, data)
        const resData = await response
        return resData
    }
    /**
     * deleteMembers : delete members from conversation.
     */
    async deleteMedia(id) {
        const response = await deleteMedia(id)
        const resData = await response
        return resData
    }
}
export default convMembersAction