import {
    postReact,
    putReact,
    unReactMsg,
    getReact,
    getMsgReact
} from "../../services/reactRequests.js"


'use-strict'
/* eslint-disable no-unused-vars */

class reactActions {
    constructor() {

    }
 
    /**
     * createReact : create message.
     */
    async postReact(data) {
        const response = await postReact(data)
        return response
    }
    
    async getMsgReact(message,user) {
       
        const response=await getMsgReact(message,user)
        return response
    }

  /**
     * update react : update react
     */
    async putReact(id,data) {
        const response = await putReact(id,data)
        return response
    }

    async unReactMsg(id){
        const response = await unReactMsg(id)
        return response
    }

    /***
     * delete react : delete react
     */
    async  unReactMsg(data){
        const response = await unReactMsg(data)
        return response
    }
    

}

export default reactActions