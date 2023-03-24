 import {
     banUser,
     deleteUser,
     getUser,
     getUserName,
     getUserStatus,
     getUsers,
     getUsersOnline,
     postUser,
     putUser,
     registerUser,
     unBanUser,
     putUserSocket, 
     putUserActivity

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
      * getUser : get user data.
      */
     async getUser(id) {
         const response = await getUser(id)
         return response.socket_id
     }

     /**
      * getUserName: get user by name 
      */
     async getUserName(name) {
         const response = await getUserName(name)
         const resData = await response.json()
         return resData
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
         console.log("login")
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



 }
 export default userActions