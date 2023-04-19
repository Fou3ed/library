 import {
     getConversation,
     deleteConversation,
     getConversations,
     postConversation,
     putConversationLastMessage,
     getConversationById,
     getConvBetweenUsers,
     getPrivateConvBetweenUsers
 } from '../../services/conversationsRequests.js'
 class conversationActions {
    async getConvBetweenUsers(user1,user2){
        const response = await getConvBetweenUsers(user1,user2)
        return response
    }
    async getPrivateConvBetweenUsers(user1,user2){
        const response = await getPrivateConvBetweenUsers(user1,user2)
        return response
    }
    async getUserConversations(){
        const response=await fetch(``)
    }
     /**
      * get all conversations 
      *  */
     async getCnvs() {
         const response = await getConversations();
         const resData=await response.json()
         return response;
     }
     /**
      *  getConversation : get conversation data
      */
     async getCnv(id) {
         const response = await getConversation(id)
         const resData=await response.json()
         return resData;
     }
     /**
      * get conversation by id 
      */
     async getCnvById(id) {
        const response = await getConversationById(id)
  
        return response;
    }
     /**
      * createConversation : create conversation.
      */
     async addCnv(data) {
         const response = await postConversation(data)
         return response
     }
     /**
      * updateConversation : update conversation.
      */
     async putCnvLM(id,message) {
         const response = await putConversationLastMessage(id,message)
         return response
     }
     /**
      * deleteConversation : delete conversation.
      */
     async deleteCnv(id) {
         const response = await deleteConversation(id.conversation)
         return response
     }
 }
 export default conversationActions