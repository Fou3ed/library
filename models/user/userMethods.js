 class userActions {


     /**
      * getUsers : get users data.
      */
     async getUsers() {
         const response = await fetch("http://127.0.0.1:3000/users");
         const resData = await response.json();
         return resData;
     }
     /**
      * getUser : get user data.
      */
     async getUser(id) {
         const response = await fetch(`http://127.0.0.1:3000/users/${id}`)
         const resData = await response.json();
         return resData;
     }
     /**
      * getUserName: get user by name 
      */
     async getUserName(name) {
         console.log("nickname:", name)
         const response = await fetch(`http://127.0.0.1:3000/users/userName/query?nickname=${name}`)
         const resData = await response.json()
         return resData
     }

     /**
      * createUser : create user.
      */
     async addUser(data) {
         const response = await fetch(`http://127.0.0.1:3000/users`, {
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
      * updateUser : update user data.
      */
     async putUser(id, data) {
         const response = await fetch(`http://127.0.0.1:3000/users/${id}`, {
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
      * deletedUser : delete user.
      */
     async deleteUser(id) {
         const response = await fetch(`http://127.0.0.1:3000/users/${id}`, {
             method: 'DELETE',
             headers: {
                 'Content-type': 'application/json'
             },
         })
         const resData = await response.json()
         return resData
     }
     /**
      * getUserStatus : get user status.
      */
     async getUserStatus(id) {
         const response = await fetch(`http://127.0.0.1:3000/users/status/${id}`)
         const resData = await response.json();
         return resData;
     }
     /**
      * getUsersOnline : get online users.
      */
     async getUsersOnline(id) {
         const response = await fetch(`http://127.0.0.1:3000/users/online/${id}`)
         const resData = await response.json();
         return resData;
     }
     /**
      * registerUser : log in a user.
      */
     async logIn(id) {
         const response = await fetch(`http://127.0.0.1:3000/users/login`)
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
         const response = await fetch(`http://127.0.0.1:3000/users/ban/${id}`, {
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
      * unbanUser
      */
     async unbanUser(id, data) {
         const response = await fetch(`http://127.0.0.1:3000/users/unban/${id}`, {
             method: 'PUT',
             headers: {
                 'Content-type': 'application/json'
             },
             body: JSON.stringify(data)
         })
         const resData = await response.json()
         return resData
     }

 }
 export default userActions