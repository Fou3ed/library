import {
    deleteRole,getRole,getRoles,postRole,putRole
    } from "../../services/roleRequests.js";
    
    class roleAction {
        /**
         * getMembers : get members of conversation.
         */
        async  getRoles() {
            const response = await getRoles;
            const resData = await response.json();
            return resData;
        }
        /**
         * getMember : get member data.
         */
        async getRole(id) {
            const response = await getRole(id)
            const resData = await response.json();
            return resData;
        }
        /**
         * addMembers : add members to conversation.
         */
        async postRole(data) {
            const response = await postRole(data)
            return response 
        }
        /**
         * updateMember : update member data.
         */
        async putRole(id, data) {
            const response = await putRole(id, data)
            return response 
        }
        /**
         * deleteMembers : delete members from conversation.
         */
        async deleteRole(id) {
            const response = await deleteRole(id)
            return response
        }
    }
    
    export default roleAction
