import mongoose from 'mongoose'

mongoose.set('strictQuery', true);

const dbServer = () => mongoose.connect("mongodb+srv://fou3ed:HJz1hkPtuQdWaMnu@cluster0.tbocpnt.mongodb.net/messaging?retryWrites=true&w=majority", () => {
    console.log("connected to data base")
  },
  e => console.error(e)
)
export default dbServer