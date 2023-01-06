class convMembersAction {


    /**
     * getMembers : get members of conversation.
     */
    async getMembers() {
        const response = await fetch("http://127.0.0.1:3000/members");
        const resData = await response.json();
        return resData;
    }
    /**
     * getMember : get member data.
     */
    async getMember(id) {
        const response = await fetch(`http://127.0.0.1:3000/members/${id}`)
        const resData = await response.json();
        return resData;
    }
    /**
     * addMembers : add members to conversation.
     */

    async addMember(data) {
        const response = await fetch(`http://127.0.0.1:3000/members`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData = await response.json()
        return resData
    }
    /**
     * updateMember : update member data.
     */
    async putMember(id, data) {
        const response = await fetch(`http://127.0.0.1:3000/conversations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData = await response.json()
        return resData
    }
    /**
     * deleteMembers : delete members from conversation.
     */
    async deleteMember(id) {
        const response = await fetch(`http://127.0.0.1:3000/conversations/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
        })
        const resData = await response.json()
        return resData
    }
}
export default convMembersAction