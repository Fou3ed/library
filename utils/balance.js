import https from 'https';
import { clientBalance } from '../models/connection/connectionEvents.js';
import userMethod from '../models/user/userMethods.js'

const userM = new userMethod() 

export default async function reviewBalance(io, socket, conversationId, userId) {
  console.log("balance conversationId,userId",conversationId,userId)
  userM.getUser(userId.user).then((res)=>{
    console.log("baz",res.status===1 && res.role !=="admin")

if(res.status===1 && res.role !=="admin"){
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2Nzg5NjUzMzQsImV4cCI6MTYyMDA1NzIzMzMzLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlcm5hbWUiOiJ0ZXN0QGdtYWlsLmNvbSJ9.fUm3v7Bk6ooi0J8LJ9WmAmsIYsJUZlfvNplrnPgPnP0j3k2lf4E9GsltoqeQin20pnUoMQq7O5CQKjuqK8xO8WAeORC1yMX0dhdlXZapd9SQKCFrEviS_JoXiLOyB7qeNiaKlzm4n-gpDX0o6_LuN__p6u4_WB_abHI3dOmsJwliU4SElXQhfqYPDnkT9dcnHIHt6fv9H0urApxF42oSMMvhXYT_UJeL6r9cJ-tzHdqtpl6tsfsWhPgz1WdjuRyTZI-xctDIpDoX3xZ8wwruXMjEAPMfbz6UbX6FYJbBnNYrETsdS1lXgrWhnAmLVJT_6TzHfOmeGJZP-fDDnr7ozg';
  const updateOptions = {
    hostname: 'iheb.local.itwise.pro',
    path: `/private-chat-app/public/updateBalance/${userId.balanceId}`, // Added a leading slash
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  };
  console.log("conversationId,userId",conversationId,userId.balanceId)
  return new Promise((resolve, reject) => {
    const updateReq = https.request(updateOptions, updateRes => {
      console.log(`statusCode for update: ${updateRes.statusCode}`);
      let updateResData = '';
      updateRes.on('data', d => {
        updateResData += d;
      });
      updateRes.on('end', () => {
        if (updateRes.statusCode === 200) {
          const response = JSON.parse(updateResData);
          const balance = response.data.balance;
          console.log("Updated balance:", balance); 
          // Find the index of the user's balance in the clientBalance array
          const userIndex = clientBalance.findIndex(b => b.user === userId);

          if (userIndex !== -1) {
            // If the user's balance is already in the array, update it
            clientBalance[userIndex].balance = balance;
          } 
          io.to(conversationId).emit('updatedBalance', balance)
        }
        resolve(updateResData);
      });
      
    });
  
    updateReq.on('error', error => {
      console.error(error);
      reject(error);
    });
    updateReq.end();
  });
}else {
  console.log("client is a guest or an admin  ")
}
})
}