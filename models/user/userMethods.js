 import {
     banUser,
     deleteUser,
     getUser,
     getUserName,
     getUserStatus,
     getUsersOnline,
     postUser,
     putUser,
     registerUser,
     unBanUser,
     putUserSocket, 
     putUserActivity,
     getUserBySocket,
     getUserByP,
     createGuest,
     putUserStatus,
     agentAvailable,
    getAgent
 } from '../../services/userRequests.js'

 class userActions {


     /**
      * getUsers : get users data.
      */
     async getUsers() {
         const response = await  fetch(`http://127.0.0.1:3000/users`());
         const resData = await response.json();
         return resData;
     }
     /**
      * get connected users
      */
    //  async getConnectedUsers(){
    //     const response =await fetch(`http://127.0.0.1:3000/users/connected`())
    //     const resData=await response.json()
    //     return resData
    //  }
     /**
      * getUser : get user data.
      */
     async getUser(id) {
         const response = await getUser(id)
         return response
     }
     async getAgent(id) {
        const response = await getAgent(id)
        return response
    }
     async agentAvailable(accountId) {
        const response = await agentAvailable(accountId)
        return response
    }
     async getUserBySocket(id){
        const response = await getUserBySocket(id)
        return response
     }
     async getUserByP(id,type){
        const response = await getUserByP(id,type)
        return response
     }

     /**
      * getUserName: get user by name 
      */
     async getUserName(id) {
         const response = await getUserName(id)
         return response
     }

     /**
      * createUser : create user.
      */
     async addUser(data) {
         const response = await postUser(data)
         const resData = await response.json()
         return resData
     }
     /**
      * updateUser : update user data.
      */
     async putUser(id, data) {
         const response = await putUser(id, data)
         const resData = await response.json()
         return resData
     }
     async putUserSocket(id,socket_id){
        const response = await putUserSocket(id,socket_id)
        return response
     }
     async putUserActivity(id,status){
        const response = await putUserActivity(id,status)
        return response
     }
     /**
      * deletedUser : delete user.
      */
     async deleteUser(id) {
         const response = await deleteUser(id)
         const resData = await response.json()
         return resData
     }
     /**
      * getUserStatus : get user status.
      */
     async getUserStatus(id) {
         const response = await getUserStatus(id)
         const resData = await response.json();
         return resData;
     }
     /**
      * getUsersOnline : get online users.
      */
     async getUsersOnline(id) {
         const response = await getUsersOnline(id)
         const resData = await response.json();
         return resData;
     }
     /**
      * registerUser : log in a user.
      */
     async logIn(id) {
         const response = await registerUser(id)
         const resData = await response.json();
         return resData;
     }
     /**
      * UnregisterUser : Log out a user.
      */
     async logOut(id) {
         const response = await fetch(`http://127.0.0.1:3000/users/logout`)
         const resData = await response.json();
         return resData;
     }
     /**
      * banUser : ban a user.
      */
     async banUser(id, data) {
         const response = await banUser(id, data)
         const resData = await response.json()
         return resData
     }
     /**
      * unBanUser
      */
     async unBanUser(id, data) {
         const response = await unBanUser(id, data)
         const resData = await response.json()
         return resData
     }

     async createGuest(data){
        const response =await createGuest(data)
        return response
     }
     async putUserStatus(data){
        const response=await putUserStatus(data)
        return response 
     }

 }
 export default userActions