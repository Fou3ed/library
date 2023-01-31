 import {
     getConversation,
     deleteConversation,
     getConversations,
     postConversation,
     putConversation
 } from '../../services/conversationsRequests.js'
 class conversationActions {


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
      * createConversation : create conversation.
      */
     async addCnv(data) {
         const response = await postConversation(data)
         return response
     }
     /**
      * updateConversation : update conversation.
      */
     async putCnv(id, data) {
         const response = await putConversation(id,data)
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