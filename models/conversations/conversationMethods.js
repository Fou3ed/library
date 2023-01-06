 class conversationActions {


     /**
      * get all conversations 
      *  */
     async getCnvs() {
         const response = await fetch("http://127.0.0.1:3000/conversations");
         const resData = await response.json();
         return resData;
     }
     /**
      *  getConversation : get conversation data
      */
     async getCnv(id) {
         const response = await fetch(`http://127.0.0.1:3000/conversations/${id}`)
         const resData = await response.json();
         return resData;
     }
     /**
      * createConversation : create conversation.
      */
     async addCnv(data) {
         const response = await fetch(`http://127.0.0.1:3000/conversations`, {
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
      * updateConversation : update conversation.
      */
     async putCnv(id, data) {
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
      * deleteConversation : delete conversation.
      */
     async deleteCnv(id) {
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
 export default conversationActions