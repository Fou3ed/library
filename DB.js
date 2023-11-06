import mongoose from 'mongoose'
import { updateActivities } from './services/conversationsRequests.js';

mongoose.set('strictQuery', true);

const dbServer = () => mongoose.connect(process.env.MONGODB, () => {
    console.log("connected to data base")
    //update all  conversations to status:0 (inactive) and all users to is_active:false 
    updateActivities()
  },
  e => console.error(e)
)
export default dbServer