import { clientBalance,socketIds } from '../models/connection/connectionEvents.js';
import axios from 'axios';
import { putUserBalance } from '../services/userRequests.js';



// export default async function reviewBalance(io, socket, userId,balance) {
//   try {   
//     console.log("balance data",balance)
//       try{






    //     putUserBalance(userId,balance)
    // console.log(updateRes.data)
    // if (updateRes.status === 200) {
    //   const response = updateRes.data;
    //   const balance = response.data[0].balance;
    //   // Find the index of the user's balance in the clientBalance array
    //   const userIndex = clientBalance.findIndex(b => b.user === userBalance.user);
    //   if (userIndex !== -1) {
    //     // If the user's balance is already in the array, update it
    //     clientBalance[userIndex].balance = balance;
    //   }

    //   const user_id = socketIds[socket.id]?.userId
    //   io.in(conversationId).emit('updatedBalance', { user_id: user_id, contact_id: userBalance.user, ...response.data[0] });
    // }else {
    //   console.log("error in Iheb's data base ")
    // }

//     return false;
//   }catch(err){
//     console.log("error ",err)
//   }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// Sample clientBalance array
// let clientBalance = [
//   { user: 977, balance: '171', balance_type: 1, sync: false },
//   { user: 1133, balance: 21, balance_type: 1, sync: false }
// ];

export default async function reviewBalance() {
  clientBalance.forEach(async (balance) => {
    try {
      const response = await axios.put(`${process.env.UPDATE_BALANCE}`, {
        contact_id: balance.user,
        type: balance.balance_type,
        total: balance.balance
      });

      if (response.status === 200) {
        balance.sync = true;
      } else {
        balance.sync = false;
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      balance.sync = false;
    }
  });
}

// setInterval(reviewBalance, 60000);
