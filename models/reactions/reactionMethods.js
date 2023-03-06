import {
    postReact,
    putReact,
    unReactMsg,
    getReact
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
    


  /**
     * update react : update react
     */
    async putReact(data) {
        const response = await putReact(data)
        return response
    }

    async unReactMsg(data){
        const response = await unReactMsg(data)
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