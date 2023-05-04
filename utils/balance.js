import https from 'https';

export default async function reviewBalance(io,socket,conversationId,userId) {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2Nzg5NjUzMzQsImV4cCI6MTYyMDA1NzIzMzMzLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlcm5hbWUiOiJ0ZXN0QGdtYWlsLmNvbSJ9.fUm3v7Bk6ooi0J8LJ9WmAmsIYsJUZlfvNplrnPgPnP0j3k2lf4E9GsltoqeQin20pnUoMQq7O5CQKjuqK8xO8WAeORC1yMX0dhdlXZapd9SQKCFrEviS_JoXiLOyB7qeNiaKlzm4n-gpDX0o6_LuN__p6u4_WB_abHI3dOmsJwliU4SElXQhfqYPDnkT9dcnHIHt6fv9H0urApxF42oSMMvhXYT_UJeL6r9cJ-tzHdqtpl6tsfsWhPgz1WdjuRyTZI-xctDIpDoX3xZ8wwruXMjEAPMfbz6UbX6FYJbBnNYrETsdS1lXgrWhnAmLVJT_6TzHfOmeGJZP-fDDnr7ozg';


//TODO create an array
  const updateOptions = {
    hostname: 'iheb.local.itwise.pro',
    path: '/private-chat-app/public/updateBalance/1', // Added a leading slash
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': updateData.length, // Added the Content-Length header
    }
  };

  return new Promise((resolve, reject) => {
    const updateReq = https.request(updateOptions, updateRes => {
      console.log(`statusCode for update: ${updateRes.statusCode}`);
      let updateResData = '';
      updateRes.on('data', d => {
        updateResData += d;
      });
      updateRes.on('end', () => {
        console.log("Updated balance:", updateResData); // Print the updated data received from the server
        // Send emit to agent and client here
        if (updateRes.statusCode === 200) {
            // Send emit to agent and client here
            const response = JSON.parse(updateResData);
            const balance = response.data.balance;
             io.to(conversationId).emit('updatedBalance',balance)
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
}
